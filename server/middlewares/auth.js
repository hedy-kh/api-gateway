const jwt = require('jsonwebtoken');
exports.authMiddleware = async (req, res, next) => {
    try {
        const authCookie = req.cookies.Auth;
        if (!authCookie) return res.status(401).json({ 'error': 'invalid data' });
        const decoded = jwt.verify(authCookie, process.env.JWT_REFRESH);
        req.user = decoded;
        next();
        
    } catch (error) {
        console.log(error);
        next(error);
    }
};
exports.verifyRoleAdmin = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'forbidden' });
        if (req.user.role !== 'Admin') return res.status(403).json({ error: 'unauthorized' });
        next();
    } catch (error) {
        console.log(error);
        next(error);

    }
};