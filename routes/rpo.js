// routes/rpo.js
const express = require("express");
const router = express.Router();
const RPO = require("../models/rpo");

// Get all RPO records with pagination
router.get('/', async (req, res) => {
  const { page = 1, pageSize = 20, search = '', column = '' } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const query = {};

    // Apply general search if a search term is provided
    if (search) {
      const regex = new RegExp(search, 'i');
      if (column) {
        query[column] = regex;
      } else {
        // Apply search to all columns
        query.$or = [
          { 'COMPANY NAME': regex },
          { 'CONTACT PERSON': regex },
          { 'DESIGNATION / TITLE': regex },
          { 'EMAIL': regex },
          { 'PHONE NUMBER': regex },
          { 'LOCATION': regex },
          { 'COMPANY SIZE': regex },
          { 'COMPANY WEBSITE': regex }
        ];
      }
    }

    const total = await RPO.countDocuments(query);
    const data = await RPO.find(query)
      .skip(skip)
      .limit(Number(pageSize));
    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching RPO records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single RPO record by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rpoRecord = await RPO.findById(id);
    if (rpoRecord) {
      res.status(200).json(rpoRecord);
    } else {
      res.status(404).json({ error: "RPO record not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new RPO record
router.post("/", async (req, res) => {
  const rpoRecord = req.body;
  try {
    const result = await RPO.create(rpoRecord);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing RPO record
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const result = await RPO.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an RPO record
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await RPO.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
