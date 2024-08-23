const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const Applicant = require('../models/applicants');
const Job = require('../models/jobs');

// Set up Google Cloud Storage
const secretFilePath = '/Users/dineshkumar/madhu_babai/admin_website_development/aira_tech_backend/airatechresumestorage-be0f1e0739c8.json'; // Ensure this path is correct
const projectId = 'airatechresumestorage';
const gc = new Storage({ projectId, keyFilename: secretFilePath });
const bucketName = 'aira_tech_bucket';
const bucket = gc.bucket(bucketName);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Apply for a job
router.post('/apply/:jobId', upload.single('resume'), async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  const jobId = parseInt(req.params.jobId, 10);

  if (!req.file) {
    return res.status(400).send({ message: "No resume file uploaded." });
  }

  const blob = bucket.file(Date.now() + '-' + req.file.originalname);
  const blobStream = blob.createWriteStream({ resumable: false });

  blobStream.on('error', (err) => {
    console.error('Blob Stream Error:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  });

  blobStream.on('finish', async () => {
    const resumeUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
    
    try {
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
    } catch (error) {
      console.error('Error applying for job:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });

  blobStream.end(req.file.buffer);
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

    const signedApplicants = await Promise.all(applicants.map(async (applicant) => {
      try {
        const resumeFile = bucket.file(applicant.resumeUrl.split('/').pop()); // Extract filename
        const [url] = await resumeFile.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 15, // URL expires in 15 minutes
        });

        return { ...applicant.toObject(), signedResumeUrl: url };
      } catch (error) {
        console.error('Error generating signed URL:', error);
        return { ...applicant.toObject(), signedResumeUrl: null };
      }
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

module.exports = router;
