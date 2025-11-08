const router = require('express').Router();
const { createAccount, logout,
    verifyAccount, logIn,
    resetPassword,setPassword,
    tokenRefersh } = require('../controllers/usercontroller');
const {authMiddleware } = require('../middlewares/auth');
const limit =require('../middlewares/rateLimit');
router.post('/register',limit(100,30),createAccount);
router.post('/login',limit(12,30), logIn);
router.post('/verifyaccount', limit(7, 10), verifyAccount);
router.post('/refreshtoken', tokenRefersh);
router.post('/logout',authMiddleware,logout);
router.post('/resetpassword', limit(3, 240), resetPassword);
router.patch('/setpassword', limit(3, 240), setPassword);
module.exports = router;