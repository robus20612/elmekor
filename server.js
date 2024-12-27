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

// Schema for keys (adding timestamp)
const keySchema = new mongoose.Schema({
  key: { type: String, required: true },
  timestamp: { type: Date, default: Date.now } // Automatically set the current timestamp
});
const Key = mongoose.model('Key', keySchema);

app.post('/add-key', async (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).send('Key is required');
  }

  const newKey = new Key({ key });
  await newKey.save();
  res.send('Key added successfully!');
});

app.get('/get-keys', async (req, res) => {
  const keys = await Key.find();
  res.json(keys);
});

// Export the app as a serverless function
module.exports = createServer(app);
