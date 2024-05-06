const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../db/.env') })
const express = require('express');
const UserRegistration = require('../models/User');
const jwt = require('jsonwebtoken');
const app = express();

app.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).send('Invalid or expired token.');
      }
      const user = await UserRegistration.findById(decoded.userId); // Added await here
      if (!user) {
        return res.status(404).send('User not found');
      }
      user.isVerified = true;
      console.log(user);
      await user.save(); // This should now work properly

      return res.send('Email verified successfully');
    });
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

module.exports = app;
