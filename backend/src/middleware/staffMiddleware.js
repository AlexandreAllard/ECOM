const checkStaff = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'storekeeper' && req.user.role !== 'accountant') {
        return res.sendStatus(403);
    }
    next();
};

module.exports = checkStaff;
