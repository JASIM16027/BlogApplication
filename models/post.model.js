const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogPostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 5,
        maxLength: 100,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minLength: 20,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
        enum: ['tech', 'life', 'education', 'news'],
    }],
    views: {
        type: Number,
        default: 0,
        min: 0,
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
