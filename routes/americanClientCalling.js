const express = require("express");
const router = express.Router();
const AmericanClientCalling = require("../models/americanClientCalling");

// Get all clients with pagination
router.get('/', async (req, res) => {
  const { page = 1, pageSize = 20, search = '', column = '' } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const query = {};

    // Apply search if a search term is provided
    if (search) {
      const regex = new RegExp(search, 'i');
      if (column) {
        query[column] = regex;
      } else {
        query.$or = [
          { 'CLIENT NAME': regex },
          { 'PHONE NUMBERS': regex },
          { 'EMAIL': regex },
          { 'COMMENTS': regex }
        ];
      }
    }

    const total = await AmericanClientCalling.countDocuments(query);
    const data = await AmericanClientCalling.find(query)
      .skip(skip)
      .limit(Number(pageSize));

    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching American clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single client by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await AmericanClientCalling.findById(id);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new client
router.post("/", async (req, res) => {
  const client = req.body;
  try {
    const result = await AmericanClientCalling.create(client);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing client
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const result = await AmericanClientCalling.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a client
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await AmericanClientCalling.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
