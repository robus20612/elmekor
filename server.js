const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://robus206:<db_password>@cluster0.1z7za.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
