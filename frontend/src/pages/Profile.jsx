import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaLock, FaSignOutAlt, FaSave, FaCamera, FaHistory, FaShoppingBag } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        username: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postal_code: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setForm({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            username: user.username || '',
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            province: user.province || '',
            postal_code: user.postal_code || ''
        });
    }, [user, navigate]);

    useEffect(() => {
        if (activeTab === 'orders') {
            const token = localStorage.getItem('access_token');
            api.get('orders/my-orders/', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setOrders(res.data.results || res.data || []))
              .catch(() => setOrders([]));
        }
    }, [activeTab]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            await api.patch('users/profile/', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile.');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-gray-50 hover:bg-white";

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FaUser /> },
        { id: 'orders', label: 'Orders', icon: <FaShoppingBag /> },
    ];

    return (
        <div className="min-h-[90vh] bg-gradient-to-br from-orange-50 via-white to-red-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* User Header */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {user.first_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            {user.first_name} {user.last_name}
                        </h2>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        {user.is_email_verified && (
                            <span className="inline-block mt-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Verified</span>
                        )}
                    </div>
                    <button onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition text-sm">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input name="first_name" type="text" value={form.first_name} onChange={handleChange}
                                        className={inputClass} placeholder="First Name" />
                                </div>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input name="last_name" type="text" value={form.last_name} onChange={handleChange}
                                        className={inputClass} placeholder="Last Name" />
                                </div>
                            </div>

                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input name="username" type="text" value={form.username} onChange={handleChange}
                                    className={inputClass} placeholder="Username" />
                            </div>

                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input type="email" disabled value={user.email}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-400 bg-gray-100 cursor-not-allowed" />
                            </div>

                            <div className="relative">
                                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                                    className={inputClass} placeholder="Mobile Number" />
                            </div>

                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input name="address" type="text" value={form.address} onChange={handleChange}
                                    className={inputClass} placeholder="Address" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="relative">
                                    <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input name="city" type="text" value={form.city} onChange={handleChange}
                                        className={inputClass} placeholder="City" />
                                </div>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input name="province" type="text" value={form.province} onChange={handleChange}
                                        className={inputClass} placeholder="Province" />
                                </div>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input name="postal_code" type="text" value={form.postal_code} onChange={handleChange}
                                        className={inputClass} placeholder="Postal Code" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>
                        {orders.length === 0 ? (
                            <div className="text-center py-16">
                                <FaHistory className="text-gray-300 text-5xl mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">No orders yet</p>
                                <p className="text-gray-300 text-sm">Your order history will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition flex flex-col sm:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="font-bold text-gray-900">Order #{order.id}</span>
                                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {order.status?.replace(/_/g, ' ').toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">{order.items?.length || 0} items • {order.payment_method?.toUpperCase()}</span>
                                                <span className="font-extrabold text-gray-900">NPR {order.grand_total}</span>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col justify-end items-end gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-5">
                                            <button onClick={() => navigate(`/order-tracking/${order.id}`)}
                                                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-xl hover:opacity-90 shadow-sm transition">
                                                Track Order
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
