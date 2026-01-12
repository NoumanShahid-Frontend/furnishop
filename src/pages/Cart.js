import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { HiTrash, HiArrowLeft, HiOutlineShoppingBag } from 'react-icons/hi';

const Cart = () => {
    const { cart, removeFromCart, addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { cartItems } = cart;

    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    const checkoutHandler = () => {
        if (user) {
            navigate('/checkout');
            return;
        }
        navigate('/login?redirect=/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto py-20 pt-40 px-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl text-gray-400 mb-6">
                    <HiOutlineShoppingBag />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our products and find something you love.</p>
                <Link 
                    to="/" 
                    className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
                >
                    <HiArrowLeft /> Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16 pt-36 px-4 min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-10 text-center md:text-left">Shopping Cart ({totalItems})</h1>
            
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b font-semibold text-gray-600">
                            <div className="col-span-3">Product</div>
                            <div className="text-center">Price</div>
                            <div className="text-center">Quantity</div>
                            <div className="text-right">Total</div>
                        </div>
                        
                        {cartItems.map((item) => (
                            <div key={item.product} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 border-b last:border-0 items-center hover:bg-gray-50 transition">
                                <div className="col-span-3 flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg p-2 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <Link to={`/product/${item.product}`} className="font-semibold text-lg text-gray-900 hover:text-primary transition">
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                        <button 
                                            onClick={() => removeFromCart(item.product)}
                                            className="text-red-500 text-sm hover:underline mt-2 flex items-center gap-1 md:hidden"
                                        >
                                            <HiTrash /> Remove
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="text-center font-medium text-gray-900">
                                    <span className="md:hidden text-gray-500 mr-2">Price:</span>
                                    ${item.price}
                                </div>
                                
                                <div className="flex justify-center">
                                    <div className="flex items-center border rounded-lg bg-white">
                                        <button 
                                            className="px-3 py-1 hover:bg-gray-100 transition"
                                            onClick={() => addToCart(item, Math.max(1, item.qty - 1))}
                                            disabled={item.qty <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 font-semibold min-w-[2rem] text-center">{item.qty}</span>
                                        <button 
                                            className="px-3 py-1 hover:bg-gray-100 transition"
                                            onClick={() => addToCart(item, Math.min(item.countInStock, item.qty + 1))}
                                            disabled={item.qty >= item.countInStock}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="text-right font-bold text-lg text-primary flex items-center justify-between md:justify-end">
                                    <span className="md:hidden text-gray-500 font-normal text-sm">Total:</span>
                                    ${(item.qty * item.price).toFixed(2)}
                                    <button 
                                        onClick={() => removeFromCart(item.product)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition ml-4 hidden md:block"
                                    >
                                        <HiTrash className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6">
                        <Link to="/" className="text-primary font-semibold hover:underline flex items-center gap-2">
                            <HiArrowLeft /> Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-8 shadow-lg rounded-xl border sticky top-24">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax Estimate</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-900">
                                <span>Total</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>
                        <button
                            onClick={checkoutHandler}
                            className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition shadow-lg transform active:scale-95"
                        >
                            Proceed to Checkout
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            Secure Checkout - SSL Encrypted
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
