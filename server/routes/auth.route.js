const router = require('express').Router();
const { createAccount, verifyAccount, logIn } = require('../controllers/usercontroller');
const { verifyRoleAdmin, authMiddleware } = require('../middlewares/auth');
const limit =require('../middlewares/rateLimit');
router.post('/register',limit(10,30),createAccount);
router.post('/login',limit(12,30), logIn);
router.post('/verifyaccount', limit(7,10),verifyAccount);
module.exports = router;