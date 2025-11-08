const mongoose = require('mongoose');
async function ConnectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('db connection success ✅');
    } catch (error) {
        console.log(error);
        console.log('connection error');
    }
};
module.exports = ConnectDb;