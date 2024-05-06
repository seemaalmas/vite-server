const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const mongoose = require('mongoose');

const connectDB = async ()=> {
    return await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
}

module.exports = connectDB;