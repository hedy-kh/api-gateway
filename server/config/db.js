const mongoose = require('mongoose');
exports.ConnectDb=async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connection success');
    } catch (error) {
        console.log('connection error');
    }
};