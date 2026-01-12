import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from '../api/axios';
import { HiArrowLeft, HiCreditCard, HiTruck } from 'react-icons/hi';

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const { cartItems } = cart;
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingPrice = itemsPrice > 200 ? 0 : 50;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/checkout');
            return;
        }
        if (cartItems.length === 0) {
            navigate('/products');
        }
    }, [cartItems, navigate, user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const order = {
                orderItems: cartItems,
                shippingAddress: { address, city, postalCode, country },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            };

            await axios.post('/orders', order);
            clearCart();
            navigate('/profile');
        } catch (error) {
            console.error("Error creating order", error);
        }
    };

    if (!user || cartItems.length === 0) {
         return null;
    }

    return (
        <div className="container mx-auto py-10 pt-36 px-4 min-h-screen bg-gray-50">
             <Link to="/cart" className="flex items-center text-gray-500 hover:text-primary mb-8 transition w-fit">
                <HiArrowLeft className="mr-2" /> Back to Cart
            </Link>

            <h1 className="text-3xl font-bold mb-10 text-center">Secure Checkout</h1>
            
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-2/3">
                    <form onSubmit={submitHandler} className="bg-white p-8 shadow-lg rounded-2xl border border-gray-100">
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-4">
                                <HiTruck className="text-primary" /> Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            placeholder="10001"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            placeholder="USA"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-4">
                                <HiCreditCard className="text-primary" /> Payment Method
                            </h2>
                            <div className="space-y-4">
                                <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition bg-gray-50 border-primary">
                                    <input
                                        type="radio"
                                        value="PayPal"
                                        checked={paymentMethod === 'PayPal'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-primary focus:ring-primary h-5 w-5"
                                    />
                                    <span className="font-medium">PayPal or Credit Card</span>
                                </label>
                                 {/* Add more payment methods here if needed */}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition shadow-lg transform active:scale-95"
                        >
                            Place Order (${totalPrice})
                        </button>
                    </form>
                </div>
                
                <div className="lg:w-1/3">
                    <div className="bg-white p-8 shadow-lg rounded-2xl border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => (
                                <div key={item.product} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-2 shrink-0">
                                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                                        <p className="text-gray-500 text-sm">{item.qty} x ${item.price}</p>
                                    </div>
                                    <p className="font-semibold text-sm">${(item.qty * item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-3 text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (15%)</span>
                                <span>${taxPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between border-t pt-4 mt-4 font-bold text-xl text-gray-900">
                            <span>Total</span>
                            <span>${totalPrice}</span>
                        </div>
                        
                         <div className="mt-6 bg-blue-50 text-blue-700 p-4 rounded-lg text-sm">
                            <p>Free shipping on orders over $200!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
