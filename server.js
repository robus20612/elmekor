const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('@vercel/node');

const app = express();

app.use(express.json());

// MongoDB connection setup
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.send('Server is running!'));

const keySchema = new mongoose.Schema({
  key: String,
  expireAt: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now } // Automatically set the current timestamp
});
const Key = mongoose.model('Key', keySchema);

app.post('/add-key', async (req, res) => {
  const { key, expireAt } = req.body;

  // Ensure expireAt is a valid Date object (if it's a string, convert it to Date)
  const expireAtDate = new Date(expireAt);
  if (isNaN(expireAtDate)) {
    return res.status(400).send('Invalid expireAt date format');
  }

  const newKey = new Key({ key, expireAt: expireAtDate });
  await newKey.save();
  res.send('Key added successfully!');
});

app.get('/get-keys', async (req, res) => {
  const keys = await Key.find();
  res.json(keys);
});

// Export the app as a serverless function
module.exports = createServer(app);
