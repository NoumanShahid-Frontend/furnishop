import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from '../api/axios';
import { HiUser, HiShoppingBag, HiLogout, HiPencil } from 'react-icons/hi';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setName(user.name);
            setEmail(user.email);
            fetchOrders();
        }
    }, [navigate, user]);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            try {
                await axios.put('/users/profile', {
                    id: user._id,
                    name,
                    email,
                    password,
                });
                setMessage('Profile Updated Successfully');
            } catch (error) {
                setMessage('Error Updating Profile');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="container mx-auto py-16 px-4 min-h-[80vh]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                                    <HiUser />
                                </div>
                                <h2 className="font-bold text-xl">{user?.name}</h2>
                                <p className="text-gray-500 text-sm">{user?.email}</p>
                            </div>
                            
                            <nav className="flex flex-col gap-2">
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <HiPencil className="text-xl" /> Edit Profile
                                </button>
                                <button 
                                    onClick={() => setActiveTab('orders')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <HiShoppingBag className="text-xl" /> Order History
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition mt-4"
                                >
                                    <HiLogout className="text-xl" /> Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:w-3/4">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            {activeTab === 'profile' ? (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 pb-4 border-b">Edit Profile</h2>
                                    {message && (
                                        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {message}
                                        </div>
                                    )}
                                    <form onSubmit={submitHandler} className="max-w-lg">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password (leave blank to keep current)</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition shadow-md"
                                        >
                                            Update Profile
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 pb-4 border-b">Order History</h2>
                                    {orders.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500">
                                            <p className="text-lg">No orders found.</p>
                                            <button onClick={() => navigate('/products')} className="mt-4 text-primary hover:underline">Start Shopping</button>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                                        <th className="p-4 border-b">Order ID</th>
                                                        <th className="p-4 border-b">Date</th>
                                                        <th className="p-4 border-b">Total</th>
                                                        <th className="p-4 border-b">Paid</th>
                                                        <th className="p-4 border-b">Delivered</th>
                                                        <th className="p-4 border-b">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    {orders.map((order) => (
                                                        <tr key={order._id} className="hover:bg-gray-50 transition border-b last:border-0">
                                                            <td className="p-4 font-mono text-gray-500">{order._id.substring(0, 10)}...</td>
                                                            <td className="p-4">{order.createdAt.substring(0, 10)}</td>
                                                            <td className="p-4 font-semibold">${order.totalPrice}</td>
                                                            <td className="p-4">
                                                                {order.isPaid ? (
                                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Paid</span>
                                                                ) : (
                                                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Unpaid</span>
                                                                )}
                                                            </td>
                                                            <td className="p-4">
                                                                {order.isDelivered ? (
                                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Delivered</span>
                                                                ) : (
                                                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
                                                                )}
                                                            </td>
                                                            <td className="p-4">
                                                                <button className="text-primary hover:underline font-medium">Details</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
