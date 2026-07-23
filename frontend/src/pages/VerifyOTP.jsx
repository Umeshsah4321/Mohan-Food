import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaKey, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOtp } = useAuth();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    const email = location.state?.email || '';

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('No email found. Please register again.');
            navigate('/register');
            return;
        }
        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP.');
            return;
        }

        setLoading(true);
        const res = await verifyOtp(email, otp);
        if (res.success) {
            setVerified(true);
            toast.success('Email verified successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            toast.error(res.error);
        }
        setLoading(false);
    };

    if (verified) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
                <div className="text-center bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md">
                    <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Email Verified!</h2>
                    <p className="text-gray-500">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 py-10 px-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mb-4 shadow-lg">
                        <FaKey className="text-white text-2xl" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Verify Email</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        We sent a 6-digit OTP to <span className="font-semibold text-gray-700">{email || 'your email'}</span>
                    </p>
                    <p className="text-xs text-orange-500 mt-1 font-medium">(Check your Django server console for the OTP)</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" disabled value={email}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-500 bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div>
                        <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit OTP"
                            className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-gray-50 hover:bg-white" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-orange-200 disabled:opacity-50">
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-400">
                    Didn't receive OTP? <button className="text-orange-500 font-semibold hover:underline">Resend</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
