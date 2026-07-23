import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 bg-clip-text text-transparent bg-orange-gradient">Mohan Food</h2>
                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                            Delivering the best and freshest food to your doorstep. Experience premium dining from the comfort of your home.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors text-gray-400">
                                <FaFacebook />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors text-gray-400">
                                <FaTwitter />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors text-gray-400">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                            <li><Link to="/menu" className="hover:text-orange-500 transition-colors">Menu</Link></li>
                            <li><Link to="/categories" className="hover:text-orange-500 transition-colors">Categories</Link></li>
                            <li><Link to="/offers" className="hover:text-orange-500 transition-colors">Special Offers</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-3 text-orange-500" />
                                <span>Imadol, Lalitpur, Nepal</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhoneAlt className="mr-3 text-orange-500" />
                                <span>9876533525 / +977 543134</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3 text-orange-500" />
                                <span>support@mohanfood.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Newsletter</h3>
                        <p className="text-sm text-gray-400 mb-4">Subscribe to get special offers and updates!</p>
                        <form className="flex flex-col space-y-2">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700"
                            />
                            <button className="bg-orange-gradient text-white px-4 py-3 rounded-lg font-bold hover:opacity-90 transition">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2026 Mohan Food Ordering System. All Rights Reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
