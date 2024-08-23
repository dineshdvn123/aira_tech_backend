// routes/infosysPMContacts.js
const express = require("express");
const router = express.Router();
const InfosysPMContacts = require("../models/infosysPMContacts");

// Get all Infosys PM contacts with pagination
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
          { 'PROJECT MANAGER': regex },
          { 'PROJECT MANAGER - EMAIL': regex }
        ];
      }
    }

    const total = await InfosysPMContacts.countDocuments(query);
    const data = await InfosysPMContacts.find(query)
      .skip(skip)
      .limit(Number(pageSize));
    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching Infosys PM contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single Infosys PM contact by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const contact = await InfosysPMContacts.findById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ error: "Infosys PM contact not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Infosys PM contact
router.post("/", async (req, res) => {
  const contact = req.body;
  try {
    const result = await InfosysPMContacts.create(contact);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing Infosys PM contact
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const result = await InfosysPMContacts.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an Infosys PM contact
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await InfosysPMContacts.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
