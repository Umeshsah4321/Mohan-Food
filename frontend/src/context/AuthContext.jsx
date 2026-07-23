import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 > Date.now()) {
                        // Token valid, fetch user profile
                        const res = await api.get('users/profile/', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setUser(res.data);
                    } else {
                        logout();
                    }
                } catch (e) {
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('users/login/', { email, password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.detail || "Invalid credentials." 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        toast.success("Logged out successfully");
    };

    const register = async (userData) => {
        try {
            await api.post('users/register/', userData);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data || "Registration failed." 
            };
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const res = await api.post('users/verify-otp/', { email, otp });
            return { success: true, message: res.data.message };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || "OTP Verification failed." 
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, verifyOtp }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
