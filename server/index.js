require('dotenv').config();
const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONT_URL || 'http://localhost:8080', 
    credentials: true 
}));
const PORT = process.env.PORT || 3000;  
const ConnectDb = require('./config/db');
ConnectDb();
app.use('/api/',require('./routes/auth.route'));
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`,process.memoryUsage());
});