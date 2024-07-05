const {Cart, CartItem, Product, sequelize} = require('../models');

exports.addToCart = async (req, res) => {
    const {productId, quantity} = req.body;
    const userId = req.user.id;

    try {
        const [cart] = await Cart.findOrCreate({
            where: {userId}
        });

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).send('Produit non trouvé.');
        }

        if (product.stock < quantity) {
            return res.status(400).send("Quantité demandée non disponible en stock.");
        }

        const [item, created] = await CartItem.findOrCreate({
            where: {productId, cartId: cart.id},
            defaults: {quantity}
        });

        if (!created) {
            const newQuantity = item.quantity + quantity;
            if (product.stock < newQuantity) {
                return res.status(400).send("Quantité totale demandée non disponible en stock.");
            }

            item.quantity = newQuantity;
            await item.save();
        }

        res.status(201).json(item);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send(error.message);
    }
};

exports.removeFromCart = async (req, res) => {
    const {itemId} = req.params;
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
    const {itemId} = req.params;
    const {quantity} = req.body;
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
            where: {userId},
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
    const {itemId} = req.params;
    const {quantity} = req.body;

    if (quantity < 1) {
        return res.status(400).json({message: "La quantité doit être au moins 1."});
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
        res.status
        500.
        send(error.message);
    }
};

exports.getCartTotal = async (userId, transaction = null) => {
    const cart = await Cart.findOne({
        where: {userId},
        include: [{
            model: CartItem,
            as: 'items',
            include: [{
                model: Product,
                as: 'product'
            }]
        }],
        transaction
    });

    if (!cart || !cart.items) {
        return 0;
    }

    return cart.items.reduce((total, item) => {
        return total + (item.quantity * item.product.price);
    }, 0);
};

exports.clearCart = async (userId, transaction) => {
    try {
        console.log("Clearing cart for userId:", userId);
        const cart = await Cart.findOne({ where: { userId }, transaction });
        if (!cart) {
            console.log("No cart found for userId:", userId);
            return;
        }
        const result = await CartItem.destroy({
            where: { cartId: cart.id },
            transaction
        });
        console.log("Items cleared from cart:", result);

        if (transaction) {
            console.log("Committing transaction");
            await transaction.commit();
        }
    } catch (error) {
        console.error("Failed to clear cart:", error);
        if (transaction) {
            console.log("Rolling back transaction due to error");
            await transaction.rollback();
        }
        throw new Error("Failed to clear cart: " + error.message);
    }
};
