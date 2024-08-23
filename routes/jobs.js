const express = require('express');
const router = express.Router();
const Job = require('../models/jobs'); // Reference the Job model
const multer = require('multer');
const upload = multer(); // if needed for job-related file uploads


router.get('/', async (req, res) => {
    const { page = 1, pageSize = 20, search = '', column = '' } = req.query;
    const skip = (page - 1) * pageSize;

    try {
        const query = {};

        if (search) {
            const regex = new RegExp(search, 'i');
            if (column === 'Location') {
                // If searching for 'Location', check across City, State, and Country
                query.$or = [
                    { 'City': regex },
                    { 'State': regex },
                    { 'Country': regex }
                ];
            } else if (column) {
                // If a specific column is provided
                query[column] = regex;
            } else {
                // Apply search to all relevant fields
                query.$or = [
                    { 'RoleName': regex },
                    { 'CompanyName': regex },
                    { 'City': regex },
                    { 'State': regex },
                    { 'Country': regex }
                ];
            }
        }

            const total = await Job.countDocuments(query);
            const data = await Job.find(query)
                .skip(skip)
                .limit(Number(pageSize));
            res.json({ data, total });
        } catch (error) {
            console.error('Error fetching Job data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

// Create a new job
router.post('/', async (req, res) => {
    const {
        RoleName,
        RoleCategory,
        CompanyName,
        WorkEnv,
        State,
        Country,
        City,
        SalaryLow,
        SalaryHigh,
        CompanyDescription,
        Responsibilities,
        Qualifications,
        Benefits,
        ExperienceRequired,
        JobType,
        PostedDate,
        Status
    } = req.body;

    try {
        const lastJob = await Job.findOne().sort({ _id: -1 });
        const newJobId = lastJob ? lastJob.JobId + 1 : 1;

        const newJob = new Job({
            JobId: newJobId,
            RoleName,
            RoleCategory,
            CompanyName,
            WorkEnv,
            State,
            Country,
            City,
            SalaryLow,
            SalaryHigh,
            CompanyDescription,
            Responsibilities,
            Qualifications,
            Benefits,
            ExperienceRequired,
            JobType,
            PostedDate,
            Status
        });

        const job = await newJob.save();
        res.status(201).json(job);
    } catch (err) {
        console.error('Error creating job:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Other job-related routes here (e.g., searching, getting unique locations, etc.)

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const jobRecord = await Job.findById(id);
      if (jobRecord) {
        res.status(200).json(jobRecord);
      } else {
        res.status(404).json({ error: "Job record not found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update an existing job
router.put('/:id', async (req, res) => {
    const jobId = req.params.id;
    const {
      RoleName,
      RoleCategory,
      CompanyName,
      WorkEnv,
      State,
      Country,
      City,
      SalaryLow,
      SalaryHigh,
      CompanyDescription,
      Responsibilities,
      Qualifications,
      Benefits,
      ExperienceRequired,
      JobType,
      PostedDate,
      Status
    } = req.body;
  
    try {
      // Find the job by JobId and update it with the new data
      const updatedJob = await Job.findOneAndUpdate(
        { JobId: jobId },  // Query to find the job by JobId
        {
          RoleName,
          RoleCategory,
          CompanyName,
          WorkEnv,
          State,
          Country,
          City,
          SalaryLow,
          SalaryHigh,
          CompanyDescription,
          Responsibilities,
          Qualifications,
          Benefits,
          ExperienceRequired,
          JobType,
          PostedDate,
          Status
        },
        { new: true }  // Option to return the updated document
      );
  
      if (updatedJob) {
        res.status(200).json(updatedJob);  // Return the updated job
      } else {
        res.status(404).json({ error: 'Job not found' });  // If no job found with the given JobId
      }
    } catch (err) {
      console.error('Error updating job:', err);
      res.status(500).send('Internal Server Error');  // Handle any errors that occur during the update
    }
  });
  

module.exports = router;
