const jwt = require('jsonwebtoken');

const authorizeAccess = async (req, res, next) => {
    try {
        const user = req.user;
        const requestedUserId = req.params.id;

        if (user.id === requestedUserId || user.role === 'admin') {
            next();
        } else {
            return res.sendStatus(403);
        }
    } catch (error) {
        return res.sendStatus(401);
    }

};

module.exports = authorizeAccess;
