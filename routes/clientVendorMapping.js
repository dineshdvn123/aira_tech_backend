// routes/clientVendorMapping.js
const express = require("express");
const router = express.Router();
const ClientVendorMapping = require("../models/clientVendorMapping");

// Get all client-vendor mappings with pagination
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
          { 'END CLIENT NAME': regex },
          { 'END CLIENT LOCATION': regex },
          { 'VENDOR COMPANY NAME': regex },
          { 'VENDOR COMPANY WEBSITE': regex },
          { 'VENDOR COMPANY LOCATION': regex },
          { 'VENDOR CONTACT NAME': regex },
          { 'VENDOR PHONE': regex },
          { 'VENDOR EMAIL': regex }
        ];
      }
    }

    const total = await ClientVendorMapping.countDocuments(query);
    const data = await ClientVendorMapping.find(query)
      .skip(skip)
      .limit(Number(pageSize));
    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching client-vendor mappings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single client-vendor mapping by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const mapping = await ClientVendorMapping.findById(id);
    if (mapping) {
      res.status(200).json(mapping);
    } else {
      res.status(404).json({ error: "Client-vendor mapping not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new client-vendor mapping
router.post("/", async (req, res) => {
  const mapping = req.body;
  try {
    const result = await ClientVendorMapping.create(mapping);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing client-vendor mapping
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const result = await ClientVendorMapping.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a client-vendor mapping
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await ClientVendorMapping.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
