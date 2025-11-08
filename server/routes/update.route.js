const router = require('express').Router();
const {changePassword,changePicture,updateProfile,getProfile} = require('../controllers/Profilecontroller');
const { authMiddleware } = require("../middlewares/auth");
const limit = require("../middlewares/rateLimit");
router.patch('/:id/profile',limit(12,55),authMiddleware, updateProfile);
router.patch('/:id/password', limit(3, 60), authMiddleware, changePassword);
router.patch('/:id/picture',limit(2,60*24*7),authMiddleware,changePicture);
router.get('/me',limit(60,1),authMiddleware,getProfile);
module.exports = router;