const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, cartItems: [] });
    }
    res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
    const { productId, name, image, price, qty } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, cartItems: [] });
    }

    const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
        // Product exists in cart, update quantity
        let productItem = cart.cartItems[itemIndex];
        productItem.qty = qty; // Set to new quantity or productItem.qty + qty
        cart.cartItems[itemIndex] = productItem;
    } else {
        // Product does not exist in cart, add new item
        cart.cartItems.push({ product: productId, name, image, price, qty });
    }

    await cart.save();
    res.json(cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems = cart.cartItems.filter(
            (item) => item.product.toString() !== req.params.productId
        );
        await cart.save();
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        cart.cartItems = [];
        await cart.save();
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
});

module.exports = router;
