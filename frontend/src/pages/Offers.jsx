import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { getBannerImage } from '../utils/imageUtils';

const Offers = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('food/banners/')
            .then(res => {
                setBanners(res.data.results || res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const copyCode = (code) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        toast.success(`Coupon code ${code} copied!`);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 bg-gray-200 rounded w-64 mb-12"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-gray-200 rounded-2xl w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh]">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                    Special <span className="bg-clip-text text-transparent bg-red-gradient">Offers</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Grab the best deals before they are gone! Use these coupon codes at checkout.
                </p>
            </div>

            {banners.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    No active offers at the moment. Check back later!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {banners.map((banner, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={banner.id} 
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={getBannerImage(banner)} 
                                    alt={banner.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-md text-sm flex items-center gap-1.5">
                                    <FaTag /> {banner.discount_text}
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{banner.title}</h3>
                                    <p className="text-gray-600 mb-6">{banner.subtitle}</p>
                                </div>
                                {banner.code && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <span className="block text-xs text-orange-600 font-semibold mb-1 uppercase">Coupon Code</span>
                                            <span className="font-mono text-lg font-bold text-gray-900 tracking-wider">{banner.code}</span>
                                        </div>
                                        <button 
                                            onClick={() => copyCode(banner.code)}
                                            className="bg-white text-orange-500 p-3 rounded-lg shadow-sm hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2"
                                            title="Copy Code"
                                        >
                                            <FaCopy />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Offers;
