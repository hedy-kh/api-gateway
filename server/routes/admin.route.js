const router = require('express').Router();
const {authMiddleware,verifyRoleAdmin, verifyRoleClient} = require('../middlewares/auth');
const limit = require('../middlewares/rateLimit');
const { deleteUser,
    setClient,
    setAdmin,
    setUser,getAllAdmins,getAllClients,getAllUsers,getTotal
} = require('../controllers/admin.controller');
router.delete('/delete/:id',limit(50,2),authMiddleware,verifyRoleAdmin,deleteUser);
router.patch('/editclient/:id',limit(50,2),authMiddleware,verifyRoleAdmin,setClient);
router.patch('/edituser/:id',limit(50,2), authMiddleware, verifyRoleAdmin, setUser);
router.patch('/addAdmin/:id',limit(50,2), authMiddleware, verifyRoleAdmin,setAdmin);
router.get('/allAdmins',limit(50,2), authMiddleware, verifyRoleAdmin, getAllAdmins);
router.get('/allUsers',limit(50,2), authMiddleware, verifyRoleAdmin, getAllUsers);
router.get('/allClients',limit(50,2), authMiddleware, verifyRoleAdmin, getAllClients);
router.get('/total',limit(50,2),authMiddleware,verifyRoleAdmin,getTotal);
module.exports = router;