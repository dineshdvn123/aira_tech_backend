// routes/vendors.js
const express = require("express");
const router = express.Router();
const Vendor = require("../models/vendors");

// Get all Vendor records with pagination
router.get('/', async (req, res) => {
  const { page = 1, pageSize = 20, search = '' } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const query = {};

    // Apply search if a search term is provided
    if (search) {
      const regex = new RegExp(search, 'i');
      query['Email'] = regex;
    }

    const total = await Vendor.countDocuments(query);
    const data = await Vendor.find(query)
      .skip(skip)
      .limit(Number(pageSize));
    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching Vendor records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single Vendor record by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const vendor = await Vendor.findById(id);
    if (vendor) {
      res.status(200).json(vendor);
    } else {
      res.status(404).json({ error: "Vendor record not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Vendor record
router.post("/", async (req, res) => {
  const vendor = req.body;
  try {
    const result = await Vendor.create(vendor);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing Vendor record
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const result = await Vendor.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Vendor record
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Vendor.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
