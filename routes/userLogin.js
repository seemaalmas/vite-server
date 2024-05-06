const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../db/.env') });
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

router.post('/login',
    [
        check('username', 'Please enter valid user name').exists(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        try {
            let user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ msg: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
            if (!user.isVerified) return res.status(401).json({ msg: 'Please verify your email first' });


            const payload = {
                user: {
                    id: user.id
                },
            };

            jwt.sign(
                payload,
                process.env.SECRET_KEY,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, { httpOnly: true, secure: true });
                }

            )
        } catch (err){
            console.error(err.message);
            res.status(500).send('Server error');
        }

    })


module.exports = router;