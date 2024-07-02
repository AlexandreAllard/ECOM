const { Cart, CartItem, Product, User } = require('../models');
const Sequelize = require('sequelize');

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    try {
        const cart = await Cart.findOrCreate({
            where: { userId },
            include: [{ model: CartItem, as : 'items'}]
        });
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).send('Produit non trouvé.');
        }
        const [item, created] = await CartItem.findOrCreate({
            where: { productId, cartId: cart[0].id },
            defaults: { quantity }
        });
        if (!created) {
            item.quantity += quantity;
            await item.save();
        }
        res.status(201).json(item);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    try {
        const item = await CartItem.findByPk(itemId);
        if (!item) {
            return res.status(404).send('Article non trouvé dans le panier.');
        }
        await item.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    try {
        const item = await CartItem.findByPk(itemId);
        if (!item) {
            return res.status(404).send('Article non trouvé dans le panier.');
        }
        item.quantity = quantity;
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({
            where: { userId },
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
            return res.status(404).send('Panier non trouvé.');
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateCartItemQuantity = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ message: "La quantité doit être au moins 1." });
    }

    try {
        const item = await CartItem.findByPk(itemId);
        if (!item) {
            return res.status(404).send('Article non trouvé dans le panier.');
        }
        item.quantity = quantity;
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
