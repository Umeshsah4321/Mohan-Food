import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBell, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { getCartCount } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Close search on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setIsSearchOpen(false); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleBellClick = () => {
        toast('No new notifications at the moment.', { icon: '🔔', id: 'bell-toast' });
    };

    return (
        <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[60px] md:h-[64px]">

                {/* ── LOGO (hidden when search is open on mobile) ── */}
                <Link
                    to="/"
                    className={`text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 tracking-tight shrink-0 whitespace-nowrap transition-all duration-300 ${isSearchOpen ? 'hidden sm:block' : 'block'}`}
                >
                    Mohan Food
                </Link>

                {/* ── CENTER MENU (hidden when search open) ── */}
                {!isSearchOpen && (
                    <div className="hidden md:flex flex-1 justify-center items-center">
                        <div className="flex items-center space-x-6 lg:space-x-8 text-gray-700 text-sm lg:text-base font-semibold">
                            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
                            <Link to="/menu" className="hover:text-orange-500 transition-colors">Menu</Link>
                            <Link to="/categories" className="hover:text-orange-500 transition-colors">Categories</Link>
                            <Link to="/offers" className="hover:text-orange-500 transition-colors">Offers</Link>
                        </div>
                    </div>
                )}

                {/* ── INLINE SEARCH BAR (expands in place) ── */}
                {isSearchOpen && (
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex-1 flex items-center mx-3 sm:mx-6 bg-gray-100 rounded-xl px-3 py-1.5 gap-2"
                    >
                        <FaSearch className="text-gray-400 shrink-0 text-sm" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search food..."
                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                        />
                        {searchQuery && (
                            <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                                <FaTimes className="text-xs" />
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:opacity-90 transition shrink-0"
                        >
                            Search
                        </button>
                    </form>
                )}

                {/* ── RIGHT ICONS ── */}
                <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600 shrink-0">

                    {/* Search toggle */}
                    <button
                        onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchQuery(''); }}
                        className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'text-orange-500 bg-orange-50' : 'hover:text-orange-500 hover:bg-orange-50'}`}
                        title={isSearchOpen ? 'Close search' : 'Search'}
                    >
                        {isSearchOpen ? <FaTimes className="text-base" /> : <FaSearch className="text-base" />}
                    </button>

                    {/* Notifications */}
                    <button
                        onClick={handleBellClick}
                        className="hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-orange-50 relative"
                    >
                        <FaBell className="text-base" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                    </button>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-orange-50 relative"
                    >
                        <FaShoppingCart className="text-base" />
                        {getCartCount() > 0 && (
                            <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm border border-white">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>

                    {/* Profile */}
                    {user ? (
                        <Link to="/profile" className="hover:text-orange-500 transition-colors p-0.5 rounded-full hover:ring-2 hover:ring-orange-300">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white text-xs font-bold">
                                {user.first_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                            </div>
                        </Link>
                    ) : (
                        <Link to="/login" className="hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-gray-100 bg-gray-50 border border-gray-100">
                            <FaUser className="text-sm" />
                        </Link>
                    )}
                </div>

            </div>

            {/* ── MOBILE NAV LINKS (always visible below, below search bar) ── */}
            <div className="md:hidden flex items-center justify-center space-x-4 text-xs font-semibold text-gray-600 pb-1.5 border-t border-gray-50 pt-1">
                <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
                <Link to="/menu" className="hover:text-orange-500 transition-colors">Menu</Link>
                <Link to="/categories" className="hover:text-orange-500 transition-colors">Categories</Link>
                <Link to="/offers" className="hover:text-orange-500 transition-colors">Offers</Link>
            </div>
        </nav>
    );
};

export default Navbar;
