const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/connectDB');
const userRegister = require('./routes/UserRegistration');
const verifiedToken = require('./routes/VerifyToken');
const userLogin = require('./routes/userLogin');
const news = require('./routes/newsApi');
const cors = require('cors');
const app = express();
app.use(cors());


// MongoDB connection
connectDB();

// Body parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', userRegister);
app.use('/api', verifiedToken);
app.use('/api', userLogin);
app.use('/api', news);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
