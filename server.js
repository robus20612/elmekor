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

const keySchema = new mongoose.Schema({ key: String, expireAt: Date });
const Key = mongoose.model('Key', keySchema);

app.post('/add-key', async (req, res) => {
  const { key, expireAt } = req.body;
  const newKey = new Key({ key, expireAt });
  await newKey.save();
  res.send('Key added successfully!');
});

app.get('/get-keys', async (req, res) => {
  const keys = await Key.find();
  res.json(keys);
});

// Export the app as a serverless function
module.exports = createServer(app);
