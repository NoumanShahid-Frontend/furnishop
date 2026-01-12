import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import { HiOutlineExclamationCircle, HiOutlineTrash, HiOutlineUsers } from 'react-icons/hi';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.get('/users');
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) => `${u.name || ''} ${u.email || ''} ${u._id || ''}`.toLowerCase().includes(q));
    }, [users, query]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                setError(error?.response?.data?.message || 'Delete failed');
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Users</h2>
                    <p className="text-sm text-gray-600">View and manage registered accounts</p>
                </div>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users..."
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
            ) : filteredUsers.length === 0 ? (
                <div className="rounded-2xl border bg-gray-50 px-6 py-12 text-center">
                    <HiOutlineUsers className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-900 font-semibold">No users found</p>
                    <p className="text-gray-600 text-sm mt-1">Try a different search.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border bg-white">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">USER</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">EMAIL</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">ADMIN</th>
                                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="border-t">
                                    <td className="py-3 px-4">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user._id}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        <a className="text-primary hover:underline" href={`mailto:${user.email}`}>{user.email}</a>
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {user.isAdmin ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">Yes</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">No</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => deleteHandler(user._id)}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm"
                                            >
                                                <HiOutlineTrash className="text-lg" />
                                                Delete
                                            </button>
                                        </div>
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

export default AdminUserList;
