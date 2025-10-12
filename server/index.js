require('dotenv').config();
const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.FRONT_URL || 'http://localhost:8080',  // nginx proxy
    credentials: true  // if you'll use cookies/sessions
}));

const PORT = process.env.PORT || 3000;  // Keep as 3000 inside container

// All your API routes should start with /api
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API is working',
        instance: process.env.INSTANCE_ID || 'unknown'  // To see which container responds
    });
});

app.get('/api/test', (req, res) => {
    res.json({ data: 'test data' });
});

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});