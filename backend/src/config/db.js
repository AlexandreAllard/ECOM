const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.DB_HOST || 'postgres',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connexion à MongoDB réussie !');
}).catch(error => {
    console.error('Impossible de se connecter à MongoDB :', error);
    process.exit(1);
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à PostgreSQL réussie !');
        await sequelize.sync();
        console.log('Modèles synchronisés avec la base de données');
    } catch (error) {
        console.error('Impossible de se connecter à PostgreSQL ou de synchroniser les modèles :', error);
        process.exit(1);
    }
})();

module.exports = {
    sequelize,
    Sequelize
};
