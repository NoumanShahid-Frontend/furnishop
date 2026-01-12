import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import CartContext from '../context/CartContext';
import { HiStar, HiTruck, HiShieldCheck } from 'react-icons/hi';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product", error);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(product, qty);
        navigate('/cart');
    };

    if (!product) {
        return <div className="text-center py-20 text-2xl">Loading...</div>;
    }

    return (
        <div className="container mx-auto py-20 px-4">
            <div className="flex flex-col lg:flex-row gap-16 mt-20">
                {/* Image Section */}
                <div className="lg:w-1/2 flex justify-center items-center bg-gray-50 rounded-2xl p-8">
                    <img src={product.image} alt={product.name} className="max-h-[500px] object-contain hover:scale-105 transition duration-300" />
                </div>

                {/* Details Section */}
                <div className="lg:w-1/2">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-6">
                        <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                                <HiStar key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"} />
                            ))}
                        </div>
                        <span className="text-gray-500">({product.numReviews} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-end mb-6">
                        <span className="text-4xl font-bold text-primary mr-4">${product.price}</span>
                        {product.oldPrice && (
                            <span className="text-xl text-gray-400 line-through mb-1">${product.oldPrice}</span>
                        )}
                    </div>

                    <div className="border-t border-b py-6 mb-6">
                        <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <span className="font-semibold text-gray-900 block mb-1">Category:</span> 
                            <span className="text-gray-600">{product.category}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-900 block mb-1">Availability:</span> 
                            <span className={`font-medium ${product.countInStock > 0 ? "text-green-600" : "text-red-600"}`}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                    </div>

                    {product.countInStock > 0 && (
                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex items-center border rounded-lg">
                                <button 
                                    className="px-4 py-2 hover:bg-gray-100 transition"
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                >-</button>
                                <span className="px-4 py-2 font-semibold border-l border-r">{qty}</span>
                                <button 
                                    className="px-4 py-2 hover:bg-gray-100 transition"
                                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                                >+</button>
                            </div>
                            <button
                                onClick={addToCartHandler}
                                className="flex-1 bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition shadow-lg transform active:scale-95"
                            >
                                Add to Cart
                            </button>
                        </div>
                    )}

                    {/* Additional Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                            <HiTruck className="text-2xl text-primary" />
                            <div>
                                <h4 className="font-semibold">Free Delivery</h4>
                                <p className="text-sm text-gray-500">For orders over $200</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                            <HiShieldCheck className="text-2xl text-primary" />
                            <div>
                                <h4 className="font-semibold">2 Year Warranty</h4>
                                <p className="text-sm text-gray-500">Full guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
