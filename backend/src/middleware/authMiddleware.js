const jwt = require('jsonwebtoken');
const User = require('../models').User;

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decodedToken.userId);
        next();
    } catch (err) {
        console.log('Token verification failed:', err);
        return res.status(401).send({ message: "Invalid token" });

    }
};

module.exports = authMiddleware;
