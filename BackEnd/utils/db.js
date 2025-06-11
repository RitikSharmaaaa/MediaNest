const mongoose = require('mongoose');

const mongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("MongoDB Connected");
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
};

// Correct export syntax
module.exports = mongoDb;
