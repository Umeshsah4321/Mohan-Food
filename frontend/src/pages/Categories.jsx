import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getCategoryImage } from '../utils/imageUtils';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('food/categories/')
            .then(res => {
                setCategories(res.data.results || res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                        Explore Our <span className="bg-clip-text text-transparent bg-red-gradient">Categories</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Dive into our diverse range of delicious offerings. From spicy Biryanis to sweet Desserts, we have something for every craving.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {!loading ? categories.map(category => (
                        <div key={category.id} className="group relative rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 p-[2px] hover:shadow-[0_20px_50px_rgba(255,65,108,0.3)] transition-all duration-500">
                            <div className="bg-white/90 backdrop-blur-xl h-full rounded-2xl overflow-hidden flex flex-col relative z-10">
                                {/* Image Container */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={getCategoryImage(category)}
                                        alt={category.name}
                                        loading="lazy"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'; }}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white shadow-sm">{category.name}</h3>
                                </div>
                                
                                {/* Details Content */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    {category.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                                    )}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="bg-orange-100 text-orange-dark text-xs font-bold px-3 py-1 rounded-full">
                                            {category.food_count} Items
                                        </span>
                                        <div className="text-sm text-gray-500">
                                            Starts at <span className="font-bold text-gray-900 text-lg">NPR {category.starting_price}</span>
                                        </div>
                                    </div>
                                    
                                    <Link to={`/menu?category=${category.slug}`} className="w-full text-center py-3 bg-gray-50 hover:bg-orange-gradient hover:text-white text-gray-800 font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
                                        View Menu
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        // Skeletons
                        [...Array(12)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-gray-200 p-[2px] animate-pulse">
                                <div className="bg-white h-[320px] rounded-2xl overflow-hidden flex flex-col">
                                    <div className="h-48 bg-gray-300"></div>
                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between">
                                            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                                            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                                        </div>
                                        <div className="h-10 bg-gray-300 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
