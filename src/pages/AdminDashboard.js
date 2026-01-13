import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AdminUserList from '../components/admin/AdminUserList';
import AdminProductList from '../components/admin/AdminProductList';
import AdminOrderList from '../components/admin/AdminOrderList';
import axios from '../api/axios';
import Logo from '../assets/images/logo.svg';
import { HiOutlineClipboardList, HiOutlineCube, HiOutlineRefresh, HiOutlineShoppingCart, HiOutlineUsers } from 'react-icons/hi';
import { BarChart as ReBarChart, LineChart as ReLineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const buildLastNDays = (days) => {
    const result = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const iso = d.toISOString().slice(0, 10);
        result.push(iso);
    }
    return result;
};

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const formatShortDate = (isoDate) => {
    if (!isoDate || typeof isoDate !== 'string') return '';
    return isoDate.slice(5, 10);
};

const Card = ({ title, subtitle, children }) => (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
                {subtitle ? <p className="text-xs text-gray-600 mt-0.5 truncate">{subtitle}</p> : null}
            </div>
        </div>
        {children}
    </div>
);

const OrdersChart = ({ data }) => {
    const safe = Array.isArray(data) ? data : [];
    if (safe.length === 0) {
        return <p className="text-sm text-gray-600">No data</p>;
    }
    return (
        <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={safe} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#23262F" radius={[6, 6, 0, 0]} />
                </ReBarChart>
            </ResponsiveContainer>
        </div>
    );
};

const RevenueChart = ({ data }) => {
    const safe = Array.isArray(data) ? data : [];
    if (safe.length === 0) {
        return <p className="text-sm text-gray-600">No data</p>;
    }
    return (
        <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={safe} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#23262F" strokeWidth={3} dot={{ r: 4 }} />
                </ReLineChart>
            </ResponsiveContainer>
        </div>
    );
};

const AdminDashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [overview, setOverview] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
    const [dashboardData, setDashboardData] = useState({ products: [], orders: [], users: [] });
    const [overviewLoading, setOverviewLoading] = useState(false);
    const [overviewError, setOverviewError] = useState('');

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            navigate('/login?redirect=/admin');
        }
    }, [navigate, user, loading]);

    const fetchOverview = async () => {
        if (!user?.isAdmin) return;
        setOverviewError('');
        setOverviewLoading(true);
        try {
            const [productsRes, ordersRes, usersRes] = await Promise.all([
                axios.get('/products'),
                axios.get('/orders'),
                axios.get('/users'),
            ]);

            const products = Array.isArray(productsRes.data) ? productsRes.data : [];
            const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
            const users = Array.isArray(usersRes.data) ? usersRes.data : [];

            const revenue = orders.reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);

            setOverview({
                products: products.length,
                orders: orders.length,
                users: users.length,
                revenue,
            });
            setDashboardData({ products, orders, users });
        } catch (err) {
            setOverviewError(err?.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setOverviewLoading(false);
        }
    };

    const chartData = useMemo(() => {
        const products = Array.isArray(dashboardData.products) ? dashboardData.products : [];
        const orders = Array.isArray(dashboardData.orders) ? dashboardData.orders : [];

        const last14 = buildLastNDays(14);
        const ordersPerDay = new Map(last14.map((d) => [d, 0]));
        const revenuePerDay = new Map(last14.map((d) => [d, 0]));

        for (const o of orders) {
            const date = typeof o?.createdAt === 'string' ? o.createdAt.slice(0, 10) : '';
            if (!ordersPerDay.has(date)) continue;
            ordersPerDay.set(date, (ordersPerDay.get(date) || 0) + 1);
            revenuePerDay.set(date, (revenuePerDay.get(date) || 0) + toNumber(o?.totalPrice));
        }

        const ordersSeries = last14.map((d) => ({ label: formatShortDate(d), value: ordersPerDay.get(d) || 0 }));
        const revenueSeries = last14.map((d) => ({ label: formatShortDate(d), value: Math.round((revenuePerDay.get(d) || 0) * 100) / 100 }));

        const paid = orders.filter((o) => Boolean(o?.isPaid)).length;
        const unpaid = orders.length - paid;
        const delivered = orders.filter((o) => Boolean(o?.isDelivered)).length;
        const undelivered = orders.length - delivered;
        const orderHealthBars = [
            { label: 'Paid', value: paid },
            { label: 'Unpaid', value: unpaid },
            { label: 'Delivered', value: delivered },
            { label: 'Not Delivered', value: undelivered },
        ];

        const categoryCounts = new Map();
        for (const p of products) {
            const raw = typeof p?.category === 'string' ? p.category.trim() : '';
            const key = raw || 'Uncategorized';
            categoryCounts.set(key, (categoryCounts.get(key) || 0) + 1);
        }

        const topCategories = Array.from(categoryCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([label, value]) => ({ label, value }));

        return { ordersSeries, revenueSeries, orderHealthBars, topCategories };
    }, [dashboardData.orders, dashboardData.products]);

    useEffect(() => {
        if (loading) return;
        if (!user?.isAdmin) return;
        fetchOverview();
    }, [loading, user?.isAdmin]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-medium">Checking admin access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto pt-28 py-10 px-4">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage products, orders, and users</p>
                    </div>
                    <button
                        onClick={fetchOverview}
                        disabled={overviewLoading}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-800 ${overviewLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <HiOutlineRefresh className="text-lg" />
                        Refresh
                    </button>
                </div>

                {overviewError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                        {overviewError}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Products</p>
                            <HiOutlineCube className="text-2xl text-primary" />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{overviewLoading ? '—' : overview.products}</p>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Orders</p>
                            <HiOutlineShoppingCart className="text-2xl text-primary" />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{overviewLoading ? '—' : overview.orders}</p>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Users</p>
                            <HiOutlineUsers className="text-2xl text-primary" />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{overviewLoading ? '—' : overview.users}</p>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Revenue</p>
                            <span className="text-2xl font-semibold text-primary">$</span>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{overviewLoading ? '—' : `$${overview.revenue.toFixed(2)}`}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <div className="bg-white shadow-sm border rounded-2xl overflow-hidden sticky top-24">
                        <div className="px-5 py-4 border-b bg-gray-50">
                            <div className="flex items-center gap-3">
                                <img src={Logo} alt="FurniShop" className="h-7 w-7" />
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate">Admin Panel</p>
                                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3">
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-800'}`}
                                >
                                    <HiOutlineCube className="text-xl" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left ${activeTab === 'products' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-800'}`}
                                >
                                    <HiOutlineCube className="text-xl" />
                                    Products
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-800'}`}
                                >
                                    <HiOutlineClipboardList className="text-xl" />
                                    Orders
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left ${activeTab === 'users' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-800'}`}
                                >
                                    <HiOutlineUsers className="text-xl" />
                                    Users
                                </button>
                            </nav>
                        </div>
                    </div>
                </aside>

                <main className="md:w-3/4">
                    <div className="bg-white shadow-sm border rounded-2xl p-6">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-gray-900">Overview</h2>
                                    <p className="text-gray-600 text-sm">Quick trends from your latest data.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <Card title="Orders (Last 14 Days)" subtitle="Daily order count">
                                        {overviewLoading ? <p className="text-sm text-gray-600">Loading…</p> : <OrdersChart data={chartData.ordersSeries} />}
                                    </Card>
                                    <Card title="Revenue (Last 14 Days)" subtitle="Daily revenue total ($)">
                                        {overviewLoading ? <p className="text-sm text-gray-600">Loading…</p> : <RevenueChart data={chartData.revenueSeries} />}
                                    </Card>
                                    <Card title="Order Status" subtitle="Paid vs delivered overview">
                                        {overviewLoading ? <p className="text-sm text-gray-600">Loading…</p> : <OrdersChart data={chartData.orderHealthBars} />}
                                    </Card>
                                    <Card title="Top Categories" subtitle="Products by category">
                                        {overviewLoading ? <p className="text-sm text-gray-600">Loading…</p> : <OrdersChart data={chartData.topCategories} />}
                                    </Card>
                                </div>
                            </div>
                        )}
                        {activeTab === 'products' && <AdminProductList />}
                        {activeTab === 'orders' && <AdminOrderList />}
                        {activeTab === 'users' && <AdminUserList />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
