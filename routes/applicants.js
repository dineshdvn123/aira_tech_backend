const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Applicant = require('../models/applicants');
const Job = require('../models/jobs');

// Set up GridFS
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('resumes'); // Set the collection name for storing resume files
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Apply for a job
router.post('/apply/:jobId', upload.single('resume'), async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  const jobId = parseInt(req.params.jobId, 10);

  if (!req.file) {
    return res.status(400).send({ message: "No resume file uploaded." });
  }

  try {
    // Store the file in GridFS
    const writeStream = gfs.createWriteStream({
      filename: Date.now() + '-' + req.file.originalname,
      content_type: req.file.mimetype,
    });
    writeStream.write(req.file.buffer);
    writeStream.end();

    writeStream.on('close', async (file) => {
      const resumeId = file._id;
      const resumeUrl = `/files/${resumeId}`;

      const existingApplicant = await Applicant.findOne({ email, JobId: jobId });
      if (existingApplicant) {
        return res.status(400).send({ message: "You have already applied for this position. We'll be in touch soon." });
      }

      const newApplicant = new Applicant({
        firstName,
        lastName,
        email,
        phone,
        resumeUrl,
        JobId: jobId,
      });

      await newApplicant.save();

      const job = await Job.findOne({ JobId: jobId });
      if (!job) {
        return res.status(404).send({ message: "Job not found." });
      }
      job.applicants.push(newApplicant._id);
      await job.save();

      res.status(201).send({ message: "Thanks for applying! We'll review your application and contact you soon." });
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Retrieve applicants
router.get('/:id', async (req, res) => {
  const jobId = req.params.id;
  const { page = 1, pageSize = 20, search = '', column = '' } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const query = { JobId: jobId };

    if (search) {
      const regex = new RegExp(search, 'i');
      if (column) {
        query[column] = regex;
      } else {
        query.$or = [
          { 'firstName': regex },
          { 'lastName': regex },
          { 'email': regex },
          { 'phone': regex }
        ];
      }
    }

    const totalApplicants = await Applicant.countDocuments(query);
    const applicants = await Applicant.find(query)
      .skip(skip)
      .limit(Number(pageSize));

    const signedApplicants = applicants.map((applicant) => ({
      ...applicant.toObject(),
      signedResumeUrl: `/files/${applicant.resumeUrl.split('/').pop()}`
    }));

    if (signedApplicants.length > 0) {
      res.status(200).json({
        totalApplicants,
        applicants: signedApplicants,
      });
    } else {
      res.status(404).json({ error: "No applicants found for this job" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve resume files
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    const readStream = gfs.createReadStream({ filename: file.filename });
    readStream.pipe(res);
  });
});

module.exports = router;
