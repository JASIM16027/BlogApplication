const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/auth.middleware');
const upload = require('../config/multer');


router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/me', authenticate, async (req, res) => {
    try {
        const { name, bio, profilePicture } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            name,
            bio,
            profilePicture,
        }, { new: true }).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/me/upload', authenticate, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            // Update user profile picture URL
            const user = await User.findByIdAndUpdate(req.user.id, {
                profilePicture: `/uploads/${req.file.filename}`,
            }, { new: true }).select('-password');

            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
});

router.get('/profile/:id', authenticate, async (req, res) => {
    try {
        // Check if the requested user is the same as the authenticated user
        if (req.user.id !== req.params.id) {
            res.status(401).json({ message: 'Authentication Failed!' });
        }
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
