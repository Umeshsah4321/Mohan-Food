import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { FaStar, FaShoppingCart, FaHeart, FaEye, FaShareAlt, FaLeaf, FaDrumstickBite, FaFire, FaClock, FaBolt } from 'react-icons/fa';
import { getFoodImage, getCategoryImage } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';

const Menu = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || '';
    const searchQuery = queryParams.get('search') || '';

    const { addToCart, buyNow } = useCart();
    
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Categories for Sidebar/Filter
        api.get('food/categories/')
            .then(res => setCategories(res.data.results || res.data))
            .catch(err => console.log(err));
    }, []);

    // Sync selectedCategory with URL if it changes (e.g. clicking category from Home)
    useEffect(() => {
        const cat = new URLSearchParams(location.search).get('category');
        if (cat) setSelectedCategory(cat);
    }, [location.search]);

    useEffect(() => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (selectedCategory) {
            searchParams.append('category__slug', selectedCategory);
        }
        if (searchQuery) {
            searchParams.append('search', searchQuery);
        }
        
        const url = `food/foods/?${searchParams.toString()}`;
        
        api.get(url)
            .then(res => {
                setFoods(res.data.results || res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [selectedCategory, searchQuery]);

    const handleCategorySelect = (slug) => {
        setSelectedCategory(slug === selectedCategory ? '' : slug);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
                
                {/* Sidebar Filter */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Categories</h2>
                        <ul className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                            <li 
                                onClick={() => handleCategorySelect('')}
                                className={`cursor-pointer px-4 py-2 rounded-lg transition-colors font-medium ${!selectedCategory ? 'bg-orange-gradient text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-dark'}`}
                            >
                                All Menu
                            </li>
                            {categories.map(cat => (
                                <li 
                                    key={cat.id} 
                                    onClick={() => handleCategorySelect(cat.slug)}
                                    className={`cursor-pointer px-4 py-2 rounded-lg transition-colors flex justify-between items-center font-medium ${selectedCategory === cat.slug ? 'bg-orange-gradient text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-dark'}`}
                                >
                                    <span>{cat.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat.slug ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                                        {cat.food_count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Food Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'Menu' : 'Full Menu'}
                        </h1>
                        <span className="text-gray-500 font-medium">Showing {foods.length} results</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-items-center">
                        {!loading ? foods.map(food => (
                            <FoodCard key={food.id} food={food} />
                        )) : (
                            // Skeletons
                            [...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-0 border border-gray-100 animate-pulse h-[460px] flex flex-col">
                                    <div className="h-56 bg-gray-200 w-full"></div>
                                    <div className="p-5 flex-1 space-y-4">
                                        <div className="flex justify-between">
                                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="flex gap-2">
                                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                                        </div>
                                        <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                                        <div className="flex gap-2 mt-auto">
                                            <div className="h-10 bg-gray-200 rounded flex-1"></div>
                                            <div className="h-10 bg-gray-200 rounded flex-1"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {!loading && foods.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
                            <h2 className="text-2xl font-bold text-gray-600 mb-2">No items found!</h2>
                            <p className="text-gray-500">Try selecting a different category.</p>
                            <button onClick={() => handleCategorySelect('')} className="mt-6 px-6 py-2 bg-orange-100 text-orange-dark font-bold rounded-lg hover:bg-orange-200 transition">
                                View All Menu
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
