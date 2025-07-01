const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const Sighting = require('./db');


const app = express();
const ports = [4000, 4001, 4002, 4003];

app.use(cors());
app.use(express.json());

// MongoDB connection status
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Server');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB Server');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// POST /sighting - Report a sighting
app.post('/sighting', async (req, res) => {
  try {
    const { productId, lat, lon, userId } = req.body;
    if (!productId || !lat || !lon) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const roundedLat = Math.round(lat * 10000) / 10000;
    const roundedLon = Math.round(lon * 10000) / 10000;
    const timestamp = new Date();

    const sighting = new Sighting({
      productId,
      lat: roundedLat,
      lon: roundedLon,
      timestamp,
      userId: userId || null,
      available: true,
    });

    await sighting.save();
    res.json({ id: sighting._id, message: 'Sighting recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /sightings - NO timestamp filter
app.get('/sightings', async (req, res) => {
  try {
    const { productId } = req.query;
    console.log(`Searching for sightings with productId: "${productId}"`);

    if (!productId) {
      return res.status(400).json({ error: 'Missing productId' });
    }

    const query = {
      productId,
      available: true
    };
    console.log('Executing find with query:', query);

    const sightings = await Sighting.find(query).sort({ timestamp: -1 });

    console.log(`Found ${sightings.length} matching sightings.`);

    res.json({
      sightings,
      count: sightings.length
    });
  } catch (error) {
    console.error('Error fetching sightings:', error);
    res.status(500).json({ error: error.message });
  }
});

// TEMPORARY TEST ENDPOINT: Get ALL sightings, ignoring filters
app.get('/sightings/all', async (req, res) => {
  try {
    console.log('--- TEST: Fetching ALL documents from the sightings collection ---');
    const allSightings = await Sighting.find({}); // Find all documents, no filter
    console.log(`Found ${allSightings.length} total documents.`);
    res.json({
      message: "This is a temporary test endpoint. Remove it after debugging.",
      totalCount: allSightings.length,
      allSightings,
    });
  } catch (error) {
    console.error('Error fetching all sightings:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /sighting/validate
app.post('/sighting/validate', async (req, res) => {
  try {
    const { sightingId, available } = req.body;
    if (!sightingId || typeof available !== 'boolean') {
      return res.status(400).json({ error: 'Missing sightingId or invalid available status' });
    }

    const result = await Sighting.findByIdAndUpdate(sightingId, { available }, { new: true });
    if (!result) {
      return res.status(404).json({ error: 'Sighting not found' });
    }

    res.json({ 
      updated: true,
      message: `Sighting ${sightingId} availability updated to ${available}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /product/:barcodeNumber - Open Food Facts lookup
app.get('/product/:barcodeNumber', async (req, res) => {
  try {
    const barcodeNumber = req.params.barcodeNumber;
    const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${barcodeNumber}.json`;
    console.log(`Searching for barcode: ${barcodeNumber}`);

    const response = await axios.get(apiUrl, { timeout: 7000 });
    const productDetails = response.data;

    if (!productDetails || !productDetails.product) {
      return res.status(404).json({
        success: false,
        message: `Product not found in Open Food Facts database for barcode ${barcodeNumber}.`,
        barcode: barcodeNumber
      });
    }

    res.json({
      success: true,
      product: productDetails.product,
      barcode: barcodeNumber
    });
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('Network')) {
      return res.status(503).json({
        success: false,
        message: 'Network error: Unable to reach Open Food Facts. Please try again later.',
        barcode: req.params.barcodeNumber
      });
    }
    console.error('Error fetching product:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch product information from Open Food Facts.',
      error: error.message,
      barcode: req.params.barcodeNumber
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server with fallback ports
const startServer = async () => {
  for (const port of ports) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port)
          .once('error', reject)
          .once('listening', () => {
            console.log(`Server running on port ${port}`);
            resolve();
          });
      });
      return;
    } catch (err) {
      console.log(`Port ${port} is in use, trying next port...`);
    }
  }

  console.error('No available ports found');
  process.exit(1);
};

startServer();
