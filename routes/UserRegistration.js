const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../db/.env') })
const UserRegistration = require('../models/User');
const express = require('express');
const nodeMailer = require('nodemailer');
const router = express.Router();
const jwt = require('jsonwebtoken');


//Nodemailer setup

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME, // Replace with your Gmail address
        pass: process.env.EMAIL_PASSWORD      // Replace with your 16-character app password
    }
});

router.post('/register', async (req, res)=>{
    try {   
        const { username, email, password } = req.body;
        const user = new UserRegistration({ username, email, password });
        await user.save();

        const verificationToken = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '3m' });
        const verificationLink = `http://localhost:5000/api/verify/${verificationToken}`;

        // Send verification email (omitting Nodemailer setup for brevity)
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Please click <a href="${verificationLink}">here</a> to verify your email and complete the registration.</p>`
        };

        transporter.sendMail(mailOptions, (error, info)=> {
            if(error){
                return res.status(500).send(error.toString());
            }
            return res.status(200).json({message: 'Verification email sent'});
        })
    } catch (error) {
        return res.status(400).json({error: "In register"});
    }
})

module.exports = router;