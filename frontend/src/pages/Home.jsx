import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaEye, FaShareAlt, FaLeaf, FaDrumstickBite, FaFire, FaClock, FaBolt } from 'react-icons/fa';
import api from '../api/axios';
import { getFoodImage, getCategoryImage } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import HeroSection from '../components/HeroSection';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    api.get('food/categories/')
      .then(res => {
        setCategories(res.data.results || res.data);
        setLoadingCategories(false);
      })
      .catch(() => {
        setLoadingCategories(false);
      });

    api.get('food/foods/?is_popular=True')
      .then(res => {
        const all = res.data.results || res.data;
        setFoods(all.slice(0, 12));
        setLoadingFoods(false);
      })
      .catch(() => setLoadingFoods(false));
  }, []);

  return (
    <div>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* ── TOP CATEGORIES ── */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Top <span style={{ background: 'linear-gradient(90deg,#f97316,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Categories</span>
          </h2>
          <p className="text-gray-500 text-lg">Choose from our wide variety of cuisines</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-20 justify-items-center max-w-5xl mx-auto">
          {loadingCategories ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse w-full max-w-[140px]">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          ) : (
            categories.slice(0, 5).map(cat => (
              <Link to={`/menu?category=${cat.slug}`} key={cat.id}
                className="group flex flex-col items-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 w-full max-w-[140px]">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-orange-50 group-hover:border-orange-200 transition-colors">
                  <img
                    src={getCategoryImage(cat)}
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80'; }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-sm text-center leading-tight">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.food_count || 0} items</p>
              </Link>
            ))
          )}
        </div>

        {/* ── POPULAR DISHES ── */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Popular <span style={{ background: 'linear-gradient(90deg,#f97316,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dishes</span>
          </h2>
          <p className="text-gray-500 text-lg">Loved by thousands of customers</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-items-center">
          {loadingFoods
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse h-[380px]">
                  <div className="h-52 bg-gray-200 rounded-t-2xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-7 bg-gray-200 rounded w-1/3" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-10 bg-gray-200 rounded-xl flex-1" />
                      <div className="h-10 bg-gray-200 rounded-xl flex-1" />
                    </div>
                  </div>
                </div>
              ))
            : foods.map(food => <FoodCard key={food.id} food={food} />)
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
