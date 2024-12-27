const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('@vercel/node');

const app = express();

app.use(express.json());

// Environment variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.send('Server is running!'));

// Key schema (with key and expireAt)
const keySchema = new mongoose.Schema({ key: String, expireAt: Date });
const Key = mongoose.model('Key', keySchema);

// POST route to add a key with dynamic expireAt
app.post('/add-key', async (req, res) => {
  const { key, expireInHours = 1 } = req.body;  // Default to 1 hour, or get from the request body

  // Get the current date and time
  const currentTime = new Date();

  // Add the specified number of hours to the current time
  const expireAt = new Date(currentTime.setHours(currentTime.getHours() + expireInHours));

  // Create the new key object with expireAt
  const newKey = new Key({ key, expireAt });

  // Save the new key to MongoDB
  await newKey.save();
  
  res.send(`Key added successfully with expiration set to: ${expireAt}`);
});

// GET route to fetch all keys
app.get('/get-keys', async (req, res) => {
  const keys = await Key.find();
  res.json(keys);
});

// Export the app as a serverless function (for Vercel)
module.exports = createServer(app);
