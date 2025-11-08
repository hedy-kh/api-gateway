const jwt = require('jsonwebtoken');
exports.authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(({ 'error': 'Authorization required' }));
        }
        const token = authHeader.substring(7);
        if (!token) {
            return res.status(401).json({ error: 'token missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
        return res.status(401).json({ error: 'invalid token' });
    }
};
exports.verifyRoleClient = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'forbidden' });
        if (req.user.role === 'user') return res.status(403).json({ error: 'unauthorized' });
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};