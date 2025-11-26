const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const match = authHeader.match(/Bearer\s+(.+)/i);
    const token = match ? match[1] : authHeader;

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
