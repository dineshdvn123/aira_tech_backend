const express = require("express");
const router = express.Router();
const H1BCandidate = require("../models/h1bCandidates");

// Get all H1B candidates with pagination
router.get('/', async (req, res) => {
    console.log(1)
  const { page = 1, pageSize = 20, search = '', column = '' } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const query = {};

    // Apply general search if search term is provided
    if (search) {
      const regex = new RegExp(search, 'i');
      if (column) {
        query[column] = regex;
      } else {
        // Apply search to all columns
        query.$or = [
          { 'CONSULTANT NAME': regex },
          { 'PHONE': regex },
          { 'EMAIL': regex },
          { 'TECHNICAL SKILLS': regex },
          { 'CURRENT LOCATION': regex },
          { 'RATES': regex } // Include RATES in search
        ]
      }
    }
    const total = await H1BCandidate.countDocuments(query);
    const data = await H1BCandidate.find(query)
      .skip(skip)
      .limit(Number(pageSize));
    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching H1B candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single H1B candidate by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const candidate = await H1BCandidate.findById(id);
    if (candidate) {
      res.status(200).json(candidate);
    } else {
      res.status(404).json({ error: "H1B Candidate not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new H1B candidate
router.post("/", async (req, res) => {
  const candidate = req.body;
  try {
    const result = await H1BCandidate.create(candidate);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing H1B candidate
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const result = await H1BCandidate.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an H1B candidate
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await H1BCandidate.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
