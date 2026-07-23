import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaEye, FaShareAlt, FaLeaf, FaDrumstickBite, FaFire, FaClock, FaBolt } from 'react-icons/fa';
import { getFoodImage } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FoodCard = ({ food }) => {
  const { addToCart, buyNow } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (action) => {
    if (!user) {
      toast('Please login or create an account to continue.', {
        icon: '🔒',
        id: 'auth-required',
        duration: 3000
      });
      navigate('/login');
      return true;
    }
    return false;
  };
  
  return (
    <div className="group relative bg-white/80 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col w-full max-w-[300px] mx-auto h-full">
      {/* Image Container */}
      <div className="relative h-[180px] bg-gray-50 overflow-hidden rounded-t-2xl">
        <img
          src={food.resolved_image || food.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'}
          alt={food.name}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'; }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {food.discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
              {parseInt(food.discount)}% OFF
            </span>
          )}
          {food.is_popular && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
              BEST SELLER
            </span>
          )}
          {!food.is_available && (
            <span className="bg-gray-800 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Veg / Non-Veg Icon */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur p-1 rounded-full shadow-sm z-10">
          {food.food_type === 'veg' ? (
            <FaLeaf className="text-green-500 text-[10px]" title="Vegetarian" />
          ) : (
            <FaDrumstickBite className="text-red-500 text-[10px]" title="Non-Vegetarian" />
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button className="bg-white text-orange-600 p-2 rounded-full hover:bg-orange-600 hover:text-white transition transform translate-y-2 group-hover:translate-y-0 duration-300 shadow-md">
            <FaEye size={14} />
          </button>
          <button className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75 shadow-md">
            <FaHeart size={14} />
          </button>
          <button className="bg-white text-blue-500 p-2 rounded-full hover:bg-blue-500 hover:text-white transition transform translate-y-2 group-hover:translate-y-0 duration-300 delay-150 shadow-md">
            <FaShareAlt size={14} />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        {/* Top Info */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] uppercase font-bold text-orange-500 tracking-wider">
              {food.category?.name || food.category_name || "Food"}
            </span>
            <div className="flex items-center text-[11px]">
              <FaStar className="text-yellow-400 mr-1 text-[10px]" />
              <span className="font-bold text-gray-700">{food.average_rating > 0 ? Number(food.average_rating).toFixed(1) : "5.0"}</span>
              <span className="text-gray-400 ml-0.5 tracking-tighter">({food.review_count || 12})</span>
            </div>
          </div>
          
          <h3 className="text-[16px] leading-snug font-bold text-gray-900 mb-2 line-clamp-1" title={food.name}>
            {food.name}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mb-3">
            <div className="flex items-center gap-1">
              <FaClock className="text-gray-400" /> {food.preparation_time || 20}m
            </div>
            {food.calories && (
              <div className="flex items-center gap-1">
                <FaBolt className="text-yellow-500" /> {food.calories} kcal
              </div>
            )}
            {food.spicy_level > 0 && (
              <div className="flex items-center gap-[1px]">
                {[...Array(Math.min(food.spicy_level, 3))].map((_, i) => (
                  <FaFire key={i} className="text-red-400 text-[10px]" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-end gap-1.5 mb-2.5">
            <span className="text-xl font-extrabold text-gray-900 leading-none tracking-tight">
              NPR {food.price}
            </span>
            {food.discount > 0 && food.original_price && (
              <span className="text-xs font-medium text-gray-400 line-through mb-0.5">
                Rs. {food.original_price}
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center gap-2">
            <button 
              disabled={!food.is_available}
              onClick={(e) => { e.preventDefault(); if (!requireAuth()) addToCart(food); }}
              className={`h-[42px] w-[40%] rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-sm ${food.is_available ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              <FaShoppingCart size={14} />
            </button>
            <button 
              disabled={!food.is_available}
              onClick={(e) => { e.preventDefault(); if (!requireAuth()) buyNow(food); }}
              className={`h-[42px] w-[55%] rounded-xl font-bold transition text-white text-sm ${food.is_available ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 shadow-md' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
