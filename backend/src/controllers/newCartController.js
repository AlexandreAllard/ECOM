const {Cart, CartItem, Product, sequelize} = require('../models');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: {userId: req.user.id},
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });
        if (!cart) {
            return res.sendStatus(404);
        }
        res.status(200).json(cart);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.addToCart = async (req, res) => {
    if (!req.body.quantity || req.body.quantity < 1) {
        return res.sendStatus(400);
    }

    try {
        if (!req.user || !req.user.id) {
            return res.sendStatus(401);
        }

        const [cart, created] = await Cart.findOrCreate({
            where: { userId: req.user.id }
        });

        const product = await Product.findByPk(req.params.productId);
        if (!product) {
            return res.sendStatus(404);
        }

        if (product.stock < req.body.quantity) {
            return res.sendStatus(400);
        }

        const [item, itemCreated] = await CartItem.findOrCreate({
            where: { productId: req.params.productId, cartId: cart.id },
            defaults: { quantity: req.body.quantity }
        });

        if (!itemCreated) {
            const newQuantity = item.quantity + req.body.quantity;
            if (product.stock < newQuantity) {
                return res.sendStatus(400);
            }

            item.quantity = newQuantity;
            await item.save();
        }

        res.sendStatus(201);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.sendStatus(500);
    }
};

exports.updateCartItemQuantity = async (req, res) => {
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.sendStatus(400);
    }

    try {
        const item = await CartItem.findByPk(req.params.itemId);
        if (!item) {
            return res.sendStatus(404);
        }

        const product = await Product.findByPk(item.productId);
        if (!product) {
            return res.sendStatus(404);
        }

        if (product.stock < quantity) {
            return res.sendStatus(400);
        }

        item.quantity = quantity;
        await item.save();
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.clearCart = async (req, res) => {

    if (!req.user.id) {
        return res.sendStatus(400);
    }

    const transaction = await sequelize.transaction();

    try {
        const cart = await Cart.findOne({where: {userId: req.user.id}, transaction});

        if (!cart) {
            await transaction.commit();
            return res.sendStatus(404);
        }

        await CartItem.destroy({
            where: {cartId: cart.id},
            transaction
        });

        await transaction.commit();
        res.sendStatus(200);
    } catch (error) {
        await transaction.rollback();
        res.sendStatus(500);
    }
};

exports.deleteCartItem = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const item = await CartItem.findByPk(req.params.itemId, {transaction});
        if (!item) {
            await transaction.commit();
            return res.sendStatus(404);
        }

        await item.destroy({transaction});
        await transaction.commit();
        res.sendStatus(200);
    } catch (error) {
        await transaction.rollback();
        res.sendStatus(500);
    }
};
