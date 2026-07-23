import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTruck, FaClock, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaStickyNote, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// Fix Leaflet default icon — use local copies from node_modules (avoids CDN tracking blocks)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}
const PROVINCES = ['Province 1', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, getCartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Confirmed
    const [orderId, setOrderId] = useState(null);
    const [position, setPosition] = useState({ lat: 27.662, lng: 85.337 }); // Default: Imadol

    const [form, setForm] = useState({
        full_name: user ? `${user.first_name} ${user.last_name}` : '',
        phone: user?.phone || '',
        email: user?.email || '',
        province: 'Bagmati',
        district: 'Lalitpur',
        city: 'Imadol',
        area: '',
        street: '',
        house_number: '',
        landmark: '',
        delivery_type: 'normal',
        delivery_time: 'asap',
        special_instructions: '',
        payment_method: 'cod'
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (!user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 px-4">
                <div className="text-center bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md">
                    <FaUser className="text-orange-400 text-5xl mx-auto mb-4" />
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Login Required</h2>
                    <p className="text-gray-500 mb-6">Please login or create an account to checkout.</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => navigate('/login')}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition">
                            Login
                        </button>
                        <button onClick={() => navigate('/register')}
                            className="px-6 py-3 bg-white border-2 border-orange-400 text-orange-500 font-bold rounded-xl hover:bg-orange-50 transition">
                            Register
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0 && step !== 3) {
        navigate('/menu');
        return null;
    }

    const subtotal = getCartTotal();
    const deliveryCharge = form.delivery_type === 'express' ? 150 : 80;
    const tax = Math.round(subtotal * 0.13);
    const grandTotal = subtotal + deliveryCharge + tax;

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const shippingAddress = `${form.house_number} ${form.street}, ${form.area}, ${form.city}, ${form.district}, ${form.province}${form.landmark ? ` (Near ${form.landmark})` : ''}`;

            const orderData = {
                payment_method: form.payment_method,
                subtotal: subtotal.toFixed(2),
                delivery_charge: deliveryCharge.toFixed(2),
                tax: tax.toFixed(2),
                grand_total: grandTotal.toFixed(2),
                shipping_address: shippingAddress,
                delivery_instructions: form.special_instructions || '',
                latitude: position.lat,
                longitude: position.lng,
                items: cart.map(item => ({
                    food: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const res = await api.post('orders/', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrderId(res.data.id);
            clearCart();
            setStep(3);
            toast.success('Order placed successfully! 🎉');
        } catch (err) {
            const errData = err.response?.data;
            let errorMsg = 'Failed to place order. Please try again.';

            if (errData) {
                if (errData.detail) {
                    errorMsg = errData.detail;
                } else if (errData.error) {
                    errorMsg = errData.error;
                } else {
                    // Check if items no longer exist in the database (Invalid pk)
                    const hasInvalidPk = errData.items && Array.isArray(errData.items) && errData.items.some(itemErr => 
                        itemErr && itemErr.food && Array.isArray(itemErr.food) && itemErr.food[0]?.includes('Invalid pk')
                    );

                    if (hasInvalidPk) {
                        toast.error("Some items in your cart are no longer available. Your cart has been cleared.", { duration: 5000 });
                        clearCart();
                        setLoading(false);
                        navigate('/menu');
                        return;
                    }

                    // Format DRF validation errors into a readable string
                    const errors = [];
                    for (const [key, value] of Object.entries(errData)) {
                        if (Array.isArray(value) && typeof value[0] === 'string') {
                            errors.push(`${key}: ${value[0]}`);
                        } else if (typeof value === 'string') {
                            errors.push(value);
                        }
                    }
                    if (errors.length > 0) {
                        errorMsg = errors.join(' | ');
                    } else {
                        errorMsg = JSON.stringify(errData);
                    }
                }
            }
            toast.error(errorMsg);
        }
        setLoading(false);
    };

    const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-gray-50 hover:bg-white";

    // Step 3: Order Confirmed
    if (step === 3) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-10">
                <div className="text-center bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md w-full">
                    <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-5" />
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
                    <p className="text-gray-500 mb-1">Your order has been placed successfully.</p>
                    <p className="text-lg font-bold text-orange-500 mb-6">Order #{orderId}</p>

                    <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Payment Method</span><span className="font-bold text-gray-800">{form.payment_method === 'cod' ? 'Cash on Delivery' : form.payment_method === 'esewa' ? 'eSewa' : 'Khalti'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="font-bold text-gray-800">{form.delivery_type === 'express' ? 'Express (30 min)' : 'Normal (45-60 min)'}</span></div>
                        <div className="flex justify-between border-t pt-2 mt-2"><span className="text-gray-700 font-bold">Total Paid</span><span className="font-extrabold text-green-600">NPR {grandTotal}</span></div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => navigate('/profile')}
                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition">
                            Track Order
                        </button>
                        <button onClick={() => navigate('/menu')}
                            className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[90vh] bg-gradient-to-br from-orange-50 via-white to-red-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back button */}
                <button onClick={() => step === 1 ? navigate('/cart') : setStep(1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition font-medium text-sm mb-6">
                    <FaArrowLeft /> {step === 1 ? 'Back to Cart' : 'Back to Details'}
                </button>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    {[{ n: 1, label: 'Delivery Details' }, { n: 2, label: 'Payment' }].map(s => (
                        <div key={s.n} className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition ${
                                step >= s.n ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                            }`}>{s.n}</div>
                            <span className={`text-sm font-medium ${step >= s.n ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</span>
                            {s.n < 2 && <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-orange-400' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Form */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaUser className="text-orange-500" /> Customer Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="relative sm:col-span-2">
                                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input name="full_name" value={form.full_name} onChange={handleChange} className={inputClass} placeholder="Full Name" required />
                                        </div>
                                        <div className="relative">
                                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="Mobile Number" required />
                                        </div>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="Email" required />
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaMapMarkerAlt className="text-orange-500" /> Delivery Address</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <select name="province" value={form.province} onChange={handleChange}
                                                className={inputClass + " appearance-none"}>
                                                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input name="district" value={form.district} onChange={handleChange} className={inputClass} placeholder="District" />
                                        </div>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="City" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input name="area" value={form.area} onChange={handleChange} className={inputClass} placeholder="Area / Tole" required />
                                        </div>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input name="street" value={form.street} onChange={handleChange} className={inputClass} placeholder="Street" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input name="house_number" value={form.house_number} onChange={handleChange} className={inputClass} placeholder="House Number (Optional)" />
                                        </div>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input name="landmark" value={form.landmark} onChange={handleChange} className={inputClass} placeholder="Landmark (Optional)" />
                                        </div>
                                    </div>
                                </div>

                                {/* Map Location Pinning */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaMapMarkerAlt className="text-orange-500" /> Pin Delivery Location</h3>
                                    <p className="text-sm text-gray-500 mb-2">Click on the map to accurately pin your location</p>
                                    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
                                        <MapContainer center={[position.lat, position.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <LocationMarker position={position} setPosition={setPosition} />
                                        </MapContainer>
                                    </div>
                                </div>

                                {/* Delivery Options */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaTruck className="text-orange-500" /> Delivery Options</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition ${form.delivery_type === 'normal' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" name="delivery_type" value="normal" checked={form.delivery_type === 'normal'} onChange={handleChange} className="accent-orange-500" />
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">Normal Delivery</p>
                                                <p className="text-xs text-gray-500">45–60 min • NPR 80</p>
                                            </div>
                                        </label>
                                        <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition ${form.delivery_type === 'express' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" name="delivery_type" value="express" checked={form.delivery_type === 'express'} onChange={handleChange} className="accent-orange-500" />
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">Express Delivery ⚡</p>
                                                <p className="text-xs text-gray-500">25–30 min • NPR 150</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaStickyNote className="text-orange-500" /> Special Instructions</h3>
                                    <textarea name="special_instructions" rows={3} value={form.special_instructions} onChange={handleChange}
                                        className="w-full p-4 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-gray-50 hover:bg-white resize-none"
                                        placeholder="E.g. Extra spicy, no onions, ring the doorbell..." />
                                </div>

                                <button onClick={() => {
                                    if (!form.area || !form.street) {
                                        toast.error('Please fill in your delivery area and street.');
                                        return;
                                    }
                                    setStep(2);
                                }}
                                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-orange-200">
                                    Continue to Payment
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaCreditCard className="text-orange-500" /> Payment Method</h3>

                                <div className="space-y-3">
                                    {[
                                        { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your food arrives', icon: <FaMoneyBillWave className="text-green-500 text-xl" /> },
                                        { id: 'esewa', label: 'eSewa', desc: 'Pay with eSewa digital wallet', icon: <FaMobileAlt className="text-green-600 text-xl" /> },
                                        { id: 'khalti', label: 'Khalti', desc: 'Pay with Khalti digital wallet', icon: <FaMobileAlt className="text-purple-600 text-xl" /> },
                                    ].map(pm => (
                                        <label key={pm.id} className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition ${form.payment_method === pm.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" name="payment_method" value={pm.id} checked={form.payment_method === pm.id} onChange={handleChange} className="accent-orange-500 w-5 h-5" />
                                            {pm.icon}
                                            <div>
                                                <p className="font-bold text-gray-800">{pm.label}</p>
                                                <p className="text-xs text-gray-500">{pm.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <button onClick={handlePlaceOrder} disabled={loading}
                                    className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-green-200 disabled:opacity-50 text-lg">
                                    {loading ? 'Placing Order...' : `Place Order • NPR ${grandTotal}`}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400">x{item.quantity}</p>
                                        </div>
                                        <span className="font-bold text-gray-700 ml-4">NPR {item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>NPR {subtotal}</span></div>
                                <div className="flex justify-between text-gray-500"><span>Delivery</span><span>NPR {deliveryCharge}</span></div>
                                <div className="flex justify-between text-gray-500"><span>Tax (13%)</span><span>NPR {tax}</span></div>
                                <div className="flex justify-between text-lg font-extrabold text-gray-900 border-t pt-3 mt-2">
                                    <span>Total</span>
                                    <span className="text-orange-500">NPR {grandTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
