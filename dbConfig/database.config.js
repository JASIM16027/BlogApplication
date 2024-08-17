const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
    }
};

module.exports = dbConnection;
