const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 500,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'BlogPost',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comment', CommentSchema);
