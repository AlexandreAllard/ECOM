require('dotenv').config();

const port = process.env.PORT || 3000;

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const db = require('./models');

const userRoutes = require('./routes/user');

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Bonjour de l\'API Mecascrap !');
});

app.use('/users', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'SequelizeValidationError') {
        return res.status(422).json({ errors: err.errors.map(e => e.message) });
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'Cette valeur est déjà utilisée.' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
});

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Serveur démarré sur le port ${port}`);
    });
}).catch((err) => {
    console.error("Erreur lors de la synchronisation des modèles ou du démarrage du serveur:", err);
});

module.exports = app;
