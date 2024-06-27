const express = require("express");
const router = express.Router();
const Job = require("../models/jobs");

// Get all jobs with pagination and filters
router.get("/jobs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const title = req.query.title || "";
    const location = req.query.location || "";

    // Build query object based on filters
    let query = {};
    if (title) {
      query.RoleName = new RegExp(title, "i");
    }
    if (location) {
      const [city, state, country] = location.split(", ").map(part => part.trim());
      query.City = city;
      if (state) query.State = state;
      if (country) query.Country = country;
    }

    const totalJobs = await Job.countDocuments(query);
    const startIndex = (page - 1) * limit;
    const jobs = await Job.find(query).skip(startIndex).limit(limit);

    res.json({
      totalJobs: totalJobs,
      jobs: jobs,
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new job
router.post('/jobs', async (req, res) => {
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


// Search job titles
router.get("/job-titles", async (req, res) => {
  try {
    const searchTerm = req.query.q || "";
    const jobTitles = await Job.find({
      RoleName: new RegExp(searchTerm, "i"),
    }).distinct("RoleName");
    res.json(jobTitles);
  } catch (err) {
    console.error("Error fetching job titles:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/jobs/:jobId", async (req, res) => {
  try {
    const job = await Job.findOne({ JobId: parseInt(req.params.jobId) });
    if (!job) {
      return res.status(404).send("Job not found");
    }
    res.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get unique locations
router.get("/locations", async (req, res) => {
  try {
    const locations = await Job.aggregate([
      {
        $group: {
          _id: {
            city: "$City",
            state: "$State",
            country: "$Country",
          },
        },
      },
      {
        $project: {
          _id: 0,
          city: "$_id.city",
          state: "$_id.state",
          country: "$_id.country",
        },
      },
      {
        $sort: {
          city: 1,
        },
      },
    ]);

    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
