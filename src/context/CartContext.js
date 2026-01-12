import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ cartItems: [] });
    const { user } = useContext(AuthContext);
    const guestCartKey = 'guest_cart';

    useEffect(() => {
        const sync = async () => {
            if (!user) {
                setCart(loadGuestCart());
                return;
            }

            const guestCart = loadGuestCart();
            if (guestCart.cartItems.length > 0) {
                for (const item of guestCart.cartItems) {
                    await axios.post('/cart', {
                        productId: item.product,
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        qty: item.qty,
                    });
                }
                localStorage.removeItem(guestCartKey);
            }

            await fetchCart();
        };

        sync();
    }, [user]);

    const loadGuestCart = () => {
        try {
            const stored = localStorage.getItem(guestCartKey);
            if (!stored) return { cartItems: [] };
            const parsed = JSON.parse(stored);
            if (!parsed || !Array.isArray(parsed.cartItems)) return { cartItems: [] };
            return { cartItems: parsed.cartItems };
        } catch {
            return { cartItems: [] };
        }
    };

    const saveGuestCart = (nextCart) => {
        localStorage.setItem(guestCartKey, JSON.stringify({ cartItems: nextCart.cartItems }));
    };

    const fetchCart = async () => {
        try {
            const { data } = await axios.get('/cart');
            setCart(data);
        } catch (error) {
            console.error("Error fetching cart", error);
        }
    };

    const addToCart = async (product, qty) => {
        const productId = product?._id || product?.product || product?.productId;
        if (!productId) return;

        if (!user) {
            setCart((prev) => {
                const prevItems = Array.isArray(prev.cartItems) ? prev.cartItems : [];
                const existing = prevItems.find((i) => i.product === productId);
                const nextItems = existing
                    ? prevItems.map((i) => (i.product === productId ? { ...i, qty } : i))
                    : [
                          ...prevItems,
                          {
                              product: productId,
                              name: product.name,
                              image: product.image,
                              price: product.price,
                              qty,
                              countInStock: product.countInStock,
                              category: product.category,
                          },
                      ];
                const nextCart = { ...prev, cartItems: nextItems };
                saveGuestCart(nextCart);
                return nextCart;
            });
            return;
        }

        try {
            const { data } = await axios.post('/cart', {
                productId,
                name: product.name,
                image: product.image,
                price: product.price,
                qty,
            });
            setCart(data);
        } catch (error) {
            console.error("Error adding to cart", error);
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) {
            setCart((prev) => {
                const prevItems = Array.isArray(prev.cartItems) ? prev.cartItems : [];
                const nextCart = { ...prev, cartItems: prevItems.filter((i) => i.product !== productId) };
                saveGuestCart(nextCart);
                return nextCart;
            });
            return;
        }
        try {
            const { data } = await axios.delete(`/cart/${productId}`);
            setCart(data);
        } catch (error) {
            console.error("Error removing from cart", error);
        }
    };

    const clearCart = async () => {
        if (!user) {
            const nextCart = { cartItems: [] };
            setCart(nextCart);
            saveGuestCart(nextCart);
            return;
        }
        try {
            const { data } = await axios.delete('/cart');
            setCart(data);
        } catch (error) {
            console.error("Error clearing cart", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
