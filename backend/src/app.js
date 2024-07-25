require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./models');


const paymentRoutes = require('./routes/payment');
const newUserRoutes = require('./routes/newUser');
const newAuthRoutes = require('./routes/newAuth');
const newOrderRoutes = require('./routes/newOrder');
const newSubscriptionRoutes = require('./routes/newSubscriptions');
const newDeliveryRoutes = require('./routes/newDelivery');
const newCategoryRoutes = require('./routes/newCategory');
const newPoductRoutes = require('./routes/newProduct');
const newStockRoutes = require('./routes/newStock');
const newCartRoutes = require('./routes/newCart');
const newPaymentRoutes = require('./routes/newPayment');
const newLegalRoutes = require('./routes/newLegal');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: ["http://localhost:8080", "http://104.248.129.67/", "https://facturo.fr"],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get('/', (req, res) => res.send('Bonjour de l\'API Mecascrap !'));

app.use('/userss', newUserRoutes);
app.use('/auths', newAuthRoutes);
app.use('/orderss', newOrderRoutes);
app.use('/subscriptionss', newSubscriptionRoutes);
app.use('/deliveriess', newDeliveryRoutes);
app.use('/categoriess', newCategoryRoutes);
app.use('/productss', newPoductRoutes);
app.use('/stocks', newStockRoutes);
app.use('/cartss', newCartRoutes)
app.use('/payment', paymentRoutes);
app.use('/payments', newPaymentRoutes);
app.use('/legals', newLegalRoutes);



app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError' ? 422 : 500;
    const message = err.name === 'SequelizeUniqueConstraintError' ? 'Cette valeur est déjà utilisée.' : 'Erreur serveur';
    res.status(statusCode).json({message, errors: err.errors?.map(e => e.message)});
});

(async () => {
    try {
        await db.sequelize.sync();
        console.log('Modèles synchronisés avec la base de données');
        app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
    } catch (error) {
        console.error("Erreur lors de la synchronisation ou du démarrage:", error);
    }
})();

module.exports = app;
