const {User} = require("../models");

const checkPasswordExpiration = async (req, res, next) => {
    const user = await User.findByPk(req.user.id);
    if (new Date() - new Date(user.lastPasswordChange) > 60*24*60*60*1000) {
        return res.status(403).json({ message: 'Votre mot de passe a expiré. Veuillez le changer.' });
    }
    next();
};

module.exports = {checkPasswordExpiration};

