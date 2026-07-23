import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirm_password) {
            toast.error("Passwords don't match!");
            return;
        }
        if (form.password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        const res = await register(form);
        if (res.success) {
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } else {
            const errors = res.error;
            if (typeof errors === 'object') {
                Object.values(errors).forEach(errArr => {
                    const msg = Array.isArray(errArr) ? errArr[0] : errArr;
                    toast.error(String(msg));
                });
            } else {
                toast.error(String(errors));
            }
        }
        setLoading(false);
    };

    const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-gray-50 hover:bg-white";

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 py-10 px-4">
            <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mb-4 shadow-lg">
                        <FaUser className="text-white text-2xl" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                    <p className="text-gray-500 mt-2 text-sm">Join Mohan Food and start ordering</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input name="first_name" type="text" required value={form.first_name} onChange={handleChange}
                                className={inputClass} placeholder="First Name" />
                        </div>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input name="last_name" type="text" required value={form.last_name} onChange={handleChange}
                                className={inputClass} placeholder="Last Name" />
                        </div>
                    </div>

                    {/* Username */}
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input name="username" type="text" required value={form.username} onChange={handleChange}
                            className={inputClass} placeholder="Username" />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input name="email" type="email" required value={form.email} onChange={handleChange}
                            className={inputClass} placeholder="Email Address" />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
                            className={inputClass} placeholder="Mobile Number" />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={handleChange}
                            className={inputClass} placeholder="Password (min 8 characters)" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input name="confirm_password" type={showConfirm ? 'text' : 'password'} required value={form.confirm_password} onChange={handleChange}
                            className={inputClass} placeholder="Confirm Password" />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-orange-200 disabled:opacity-50 text-sm">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600 transition">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
