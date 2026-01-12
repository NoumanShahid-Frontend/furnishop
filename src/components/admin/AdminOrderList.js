import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import { HiOutlineClipboardList, HiOutlineExclamationCircle } from 'react-icons/hi';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.get('/orders');
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return orders;
        return orders.filter((o) => {
            const hay = `${o._id || ''} ${o.user?.name || ''} ${o.user?.email || ''}`.toLowerCase();
            return hay.includes(q);
        });
    }, [orders, query]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Orders</h2>
                    <p className="text-sm text-gray-600">Track payments and deliveries</p>
                </div>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full sm:w-64 border rounded-lg px-3 py-2 text-sm bg-white"
                />
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm flex items-center gap-2">
                    <HiOutlineExclamationCircle className="text-lg" />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="min-h-[200px] flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="rounded-2xl border bg-gray-50 px-6 py-12 text-center">
                    <HiOutlineClipboardList className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-900 font-semibold">No orders found</p>
                    <p className="text-gray-600 text-sm mt-1">Try a different search.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border bg-white">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">ORDER</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">USER</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">DATE</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">TOTAL</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">PAID</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">DELIVERED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="border-t">
                                    <td className="py-3 px-4">
                                        <p className="font-semibold text-gray-900">{String(order._id).slice(0, 10)}…</p>
                                        <p className="text-xs text-gray-500">{order._id}</p>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{order.user?.name || '—'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{order.createdAt ? order.createdAt.substring(0, 10) : '—'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">${order.totalPrice}</td>
                                    <td className="py-3 px-4 text-sm">
                                        {order.isPaid ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                                                Paid {order.paidAt ? order.paidAt.substring(0, 10) : ''}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">Not Paid</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {order.isDelivered ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                                                Delivered {order.deliveredAt ? order.deliveredAt.substring(0, 10) : ''}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">Not Delivered</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrderList;
