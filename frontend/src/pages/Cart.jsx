import React from 'react';
import { useCart } from '../context/CartContext';
import { getFoodImage } from '../utils/imageUtils';
import { FaTrash, FaMinus, FaPlus, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCheckout = () => {
        if (!user) {
            toast.error('Please login to place your order!', { id: 'checkout-error' });
            navigate('/login');
            return;
        }

        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-gray-50">
                <div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" className="w-12 h-12 opacity-50" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any delicious food yet!</p>
                    <Link to="/menu" className="block w-full py-3 px-4 bg-orange-gradient text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                        Explore Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h1>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="font-bold text-gray-800 text-lg">Cart Items ({cartItems.length})</h2>
                                <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-700 transition">
                                    Clear All
                                </button>
                            </div>
                            
                            <ul className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 transition">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                            <img src={getFoodImage(item)} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-sm font-bold text-orange-dark mb-4">NPR {item.price}</p>
                                            
                                            <div className="flex items-center justify-center sm:justify-start gap-4">
                                                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-orange-dark transition">
                                                        <FaMinus className="text-xs" />
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-orange-dark transition">
                                                        <FaPlus className="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-center sm:items-end justify-between gap-4 h-full">
                                            <p className="text-lg font-black text-gray-900">NPR {item.price * item.quantity}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Remove Item">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="font-bold text-gray-800 text-lg mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 text-sm font-medium text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-bold">NPR {getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="text-gray-900 font-bold">Calculated at Checkout</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (13%)</span>
                                    <span className="text-gray-900 font-bold">NPR {Math.round(getCartTotal() * 0.13)}</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-6 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-800">Estimated Total</span>
                                    <span className="text-2xl font-black text-gray-900 leading-none">NPR {getCartTotal() + Math.round(getCartTotal() * 0.13)}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleCheckout}
                                className="w-full py-4 px-4 bg-orange-gradient text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
