require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./models');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const cartRoutes = require('./routes/cart');
const subscriptionRoutes = require('./routes/subscription');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order');
const deliveryRoutes = require('./routes/delivery');

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
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/payment', paymentRoutes);
app.use('/orders', orderRoutes);
app.use('/deliveries', deliveryRoutes);

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
