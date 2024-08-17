const express = require('express');
const router = express.Router();
const Comment = require('../models/comment.model');
const BlogPost = require('../models/post.model');

// Add a comment to a post
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { content, author } = req.body;
    const { postId } = req.params;

    // Ensure the post exists
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create and save the comment
    const comment = new Comment({ content, author, post: postId });
    await comment.save();

    // Add the comment to the post's comments array
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId }).populate('author', 'name email');
    if (!comments) {
      return res.status(404).json({ message: 'Comments not found' });
    }

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
