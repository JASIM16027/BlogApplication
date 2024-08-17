const express = require('express');
const router = express.Router();
const BlogPost = require('../models/post.model');
const authenticate = require('../middlewares/auth.middleware');

router.post('/posts', authenticate, async (req, res) => {
    try {
        const blogPost = new BlogPost(req.body);
        const savedPost = await blogPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/posts', async (req, res) => {
    try {
        const blogPosts = await BlogPost.find().populate('author', 'name email');
        res.status(200).json(blogPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/posts/:id', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id).populate('author', 'name email');
        if (!blogPost) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(blogPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/posts/:id', async (req, res) => {
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a blog post
router.delete('/posts/:id', authenticate, async (req, res) => {
    try {
        const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
