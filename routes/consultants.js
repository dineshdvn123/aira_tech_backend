const express = require("express");
const router = express.Router();
const Consultant = require("../models/consultants");

// Get all consultants with pagination
router.get('/', async (req, res) => {
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
          { 'CONSULTANTS NAME': regex },
          { 'PHONE': regex },
          { 'EMAIL': regex },
          { 'TECHNICAL SKILLS': regex },
          { 'CURRENT LOCATION': regex }
        ]
      }
    }
    const total = await Consultant.countDocuments(query);
    const data = await Consultant.find(query)
      .skip(skip)
      .limit(Number(pageSize));
    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching consultants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single consultant by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const consultant = await Consultant.getConsultantById(id);
    if (consultant) {
      res.status(200).json(consultant);
    } else {
      res.status(404).json({ error: "Consultant not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new consultant
router.post("/", async (req, res) => {
  const consultant = req.body;
  try {
    const result = await Consultant.create(consultant);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    // Use findByIdAndUpdate to find the document by ID and update it
    const result = await Consultant.findByIdAndUpdate(id, updateData, { new: true });
    if (!result) {
      return res.status(404).json({ error: "Consultant not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a consultant
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Consultant.findOneAndDelete({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
