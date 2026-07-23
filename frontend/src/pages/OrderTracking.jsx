import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaUtensils, FaBoxOpen, FaMotorcycle, FaHome, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Fix Leaflet icons
const riderIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2983/2983804.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});
const homeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});
const restaurantIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3170/3170733.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const STATUS_STAGES = [
    { id: 'received', label: 'Order Placed', icon: <FaCheckCircle /> },
    { id: 'preparing', label: 'Preparing', icon: <FaUtensils /> },
    { id: 'cooking', label: 'Cooking', icon: <FaUtensils /> },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: <FaMotorcycle /> },
    { id: 'delivered', label: 'Delivered', icon: <FaHome /> }
];

const OrderTracking = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [liveData, setLiveData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`orders/${id}/`);
                setOrder(res.data);
            } catch (error) {
                toast.error("Failed to load order details.");
            }
        };

        const fetchLiveTracking = async () => {
            try {
                const res = await api.get(`orders/${id}/live-tracking/`);
                setLiveData(res.data);
            } catch (error) {
                console.error("Live tracking failed");
            }
        };

        fetchOrder();
        fetchLiveTracking();
        
        // Poll every 10 seconds for live updates
        const interval = setInterval(() => {
            fetchLiveTracking();
        }, 10000);

        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        if (order && liveData) {
            setOrder(prev => ({ ...prev, status: liveData.status, payment_status: liveData.payment_status }));
        }
    }, [liveData]);

    if (!order) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;

    const currentStageIndex = STATUS_STAGES.findIndex(s => s.id === order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 font-medium transition">
                    <FaArrowLeft /> Back to Profile
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-extrabold mb-1">Order #{order.id}</h1>
                                <p className="text-orange-100">Placed on {new Date(order.created_at).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-orange-100 mb-1">Total Amount</p>
                                <p className="text-2xl font-black">NPR {order.grand_total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-8">Order Status</h2>
                        
                        {isCancelled ? (
                            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold text-lg">
                                This order has been cancelled.
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Progress Bar Background */}
                                <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full z-0 hidden sm:block"></div>
                                {/* Active Progress Bar */}
                                <div className="absolute top-6 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full z-0 hidden sm:block transition-all duration-500"
                                     style={{ width: `${(Math.max(0, currentStageIndex) / (STATUS_STAGES.length - 1)) * 100}%` }}></div>

                                <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                                    {STATUS_STAGES.map((stage, index) => {
                                        const isActive = index <= currentStageIndex;
                                        return (
                                            <div key={stage.id} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md transition-colors duration-300 ${
                                                    isActive ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'
                                                }`}>
                                                    {stage.icon}
                                                </div>
                                                <div className="text-left sm:text-center">
                                                    <p className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{stage.label}</p>
                                                    {index === currentStageIndex && <p className="text-xs text-orange-500 font-medium animate-pulse">Current Status</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {liveData && !isCancelled && order.latitude && order.longitude && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FaMapMarkerAlt className="text-orange-500" /> Live Delivery Map</h2>
                            {order.status === 'out_for_delivery' && (
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">Rider on the way</span>
                            )}
                        </div>
                        <div className="h-[400px] w-full z-0 relative">
                            <MapContainer 
                                center={[liveData.restaurant_location.lat, liveData.restaurant_location.lng]} 
                                zoom={14} 
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                
                                <Marker position={[liveData.restaurant_location.lat, liveData.restaurant_location.lng]} icon={restaurantIcon}>
                                    <Popup><b>Mohan Food</b><br/>Preparing your order!</Popup>
                                </Marker>

                                <Marker position={[order.latitude, order.longitude]} icon={homeIcon}>
                                    <Popup><b>Delivery Location</b><br/>{order.shipping_address}</Popup>
                                </Marker>

                                {(order.status === 'out_for_delivery' || order.status === 'delivered') && (
                                    <>
                                        <Marker position={[liveData.rider_location.lat, liveData.rider_location.lng]} icon={riderIcon}>
                                            <Popup>Your Rider is here</Popup>
                                        </Marker>
                                        {/* Simple line between rider and home */}
                                        <Polyline positions={[
                                            [liveData.rider_location.lat, liveData.rider_location.lng],
                                            [order.latitude, order.longitude]
                                        ]} color="#f97316" dashArray="5, 10" />
                                    </>
                                )}
                            </MapContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
