import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('users/forgot-password/', { email });
            toast.success(res.data.message || 'OTP sent successfully!');
            navigate('/reset-password', { state: { email } });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send OTP.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-orange-50 to-white py-10 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                    <p className="text-gray-500 mt-2 text-sm">Enter your email to receive an OTP</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" 
                            placeholder="Email Address" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg disabled:opacity-50 text-sm">
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-500">
                    Remember your password? <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
