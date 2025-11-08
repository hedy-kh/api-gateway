const rateLimit = require('express-rate-limit');
const limit = (maxRequests = 100, minutes=5) => {
    const timePermintues = minutes * 60 * 1000;
  return rateLimit({
    windowMs: timePermintues,
    max: maxRequests,       
    message: 'Too many requests. Please try again later.',
    standardHeaders: true,  
    legacyHeaders: false,   
  });
};
module.exports = limit;
