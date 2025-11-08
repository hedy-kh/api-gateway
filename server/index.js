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
    origin: process.env.FRONT_URL || 'http://localhost:5173', 
    credentials: true 
}));

const PORT = process.env.PORT || 3000;  
const ConnectDb = require('./config/db');
ConnectDb();
app.use('/api/auth', require('./routes/auth.route'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`,process.memoryUsage());
});