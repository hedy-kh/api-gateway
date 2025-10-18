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
    origin: process.env.FRONT_URL || 'http://localhost:8080', 
    credentials: true 
}));
const PORT = process.env.PORT || 3000;  
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API is working',
        instance: process.env.INSTANCE_ID || 'unknown' 
    });
});
app.get('/api/test', (req, res) => {
    res.json({ data: 'test data' });

});
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});