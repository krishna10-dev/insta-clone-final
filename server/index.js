const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
// Render dynamic port use karta hai
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (MongoDB Atlas URI yahan aayegi)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@cluster0.mongodb.net/instagram_clone?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to Cloud Database'))
  .catch(err => console.error('❌ Database Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Instagram Clone API is live!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
