const express = require("express");
const router = express.Router();
const CanadianCandidate = require("../models/canadianCandidate");

// Get all Canadian candidates with pagination
router.get('/', async (req, res) => {
  const { page = 1, pageSize = 20, search = '', column = '' } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const query = {};

    // Apply search if search term is provided
    if (search) {
      const regex = new RegExp(search, 'i');
      if (column) {
        query[column] = regex;
      } else {
        query.$or = [
          { 'NAME': regex },
          { 'PHONE NUMBER': regex },
          { 'EMAIL': regex },
          { 'SKILLS': regex },
          { 'LOCATION': regex }
        ];
      }
    }

    const total = await CanadianCandidate.countDocuments(query);
    const data = await CanadianCandidate.find(query).skip(skip).limit(Number(pageSize));
    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching Canadian candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single Canadian candidate by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const candidate = await CanadianCandidate.findById(id);
    if (candidate) {
      res.status(200).json(candidate);
    } else {
      res.status(404).json({ error: "Canadian Candidate not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Canadian candidate
router.post("/", async (req, res) => {
  const candidate = req.body;
  try {
    const result = await CanadianCandidate.create(candidate);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing Canadian candidate
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const result = await CanadianCandidate.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Canadian candidate
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await CanadianCandidate.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
