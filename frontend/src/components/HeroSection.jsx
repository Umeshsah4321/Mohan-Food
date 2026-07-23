import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTruck, FaTag, FaShoppingCart, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getHeroImage } from '../utils/imageUtils';

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch images from backend
  useEffect(() => {
    api.get('food/hero/').then(res => {
      const apiSlides = (res.data.results || res.data);
      if (apiSlides.length > 0) {
        setSlides(apiSlides);
      }
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, []);

  // Preload images for smooth transition
  useEffect(() => {
    slides.forEach(slide => {
      const img = new Image();
      img.src = getHeroImage(slide);
    });
  }, [slides]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Automatic slideshow loop every 3 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [slides.length, nextSlide]);

  // Swipe handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
      setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
      setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;
      if (isLeftSwipe) {
          nextSlide();
      }
      if (isRightSwipe) {
          prevSlide();
      }
      setTouchStart(0);
      setTouchEnd(0);
  };

  const current = slides[currentIndex];

  // Framer Motion animation variants
  const imageVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: [0, -15, 0], // Floating animation
      transition: {
        opacity: { duration: 0.8, ease: "easeOut" },
        scale: { duration: 0.8, ease: "easeOut" },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeIn"
      }
    }
  };

  // Particle variations for background effect
  const particles = Array.from({ length: 6 }).map((_, i) => ({
    size: Math.random() * 15 + 10,
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 3
  }));

  if (loading) {
      return (
          <section className="w-full bg-white min-h-[85vh] flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                  <div className="w-64 h-64 bg-gray-200 rounded-full mb-8"></div>
                  <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
          </section>
      );
  }

  return (
    <section 
        className="relative w-full overflow-hidden bg-white min-h-[85vh] flex items-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
      {/* Background Glow & Blur Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-400 rounded-full opacity-[0.08] blur-[120px] pointer-events-none translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-400 rounded-full opacity-[0.05] blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

      {/* Decorative Circles */}
      <div className="absolute top-20 right-[40%] w-4 h-4 rounded-full border-2 border-orange-300 opacity-50" />
      <div className="absolute bottom-32 left-[10%] w-6 h-6 rounded-full border-2 border-red-300 opacity-40" />

      {/* Navigation Arrows */}
      {slides.length > 1 && (
          <>
            <button 
                onClick={prevSlide}
                className="absolute left-2 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 border border-gray-100 hidden sm:flex"
                aria-label="Previous slide"
            >
                <FaChevronLeft className="text-xl" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-2 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 border border-gray-100 hidden sm:flex"
                aria-label="Next slide"
            >
                <FaChevronRight className="text-xl" />
            </button>
          </>
      )}

      {/* Navigation Dots */}
      {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {slides.map((_, idx) => (
                  <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-gray-300 hover:bg-orange-300'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                  />
              ))}
          </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full z-10 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-16">
          
          {/* LEFT SIDE: Text & CTA */}
          <div className="flex-1 flex flex-col space-y-8 max-w-xl text-center lg:text-left z-20">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="flex items-center gap-1.5 bg-white border border-gray-100 text-gray-800 font-bold px-4 py-2 rounded-full text-sm shadow-sm backdrop-blur-md">
                <FaStar className="text-yellow-500 text-base" /> {current?.rating || '4.9'} Rated
              </span>
              <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 font-bold px-4 py-2 rounded-full text-sm shadow-sm">
                <FaTruck /> {current?.delivery_time || 'Fast Delivery'}
              </span>
              <span className="flex items-center gap-1.5 bg-red-50 text-red-600 font-bold px-4 py-2 rounded-full text-sm shadow-sm">
                <FaTag /> Up to 40% OFF
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4 min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                    {current?.title ? current.title.split(' ')[0] : 'Fresh Food'} <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                      {current?.title ? current.title.split(' ').slice(1).join(' ') : 'Delivered to'}
                    </span>
                    <br className="hidden sm:block" /> Your Door
                  </h1>
                </motion.div>
              </AnimatePresence>
              <p className="text-lg sm:text-xl text-gray-500 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Experience the finest culinary delights delivered fast and fresh. Perfect taste, zero waiting time.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link 
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
              >
                <FaShoppingCart /> Order Now
              </Link>
              <Link 
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-2xl shadow-sm hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
              >
                Explore Menu <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Animated Food Image Showcase */}
          <div className="flex-1 relative flex items-center justify-center w-full lg:min-h-[650px] z-10 perspective-1000">
            
            {/* Ambient Background Glow for Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-gradient-to-tr from-orange-400 to-red-300 rounded-full blur-[80px] opacity-20 pointer-events-none" />

            {/* Floating Particles */}
            {particles.map((p, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute bg-orange-400 rounded-full opacity-30"
                style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.4, 0.1]
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* The Animated Image Container */}
            <div className="relative w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] lg:w-[650px] lg:h-[650px] flex items-center justify-center drop-shadow-2xl z-20">
              <AnimatePresence mode="wait">
                {current && (
                  <motion.img
                    key={current.id}
                    src={getHeroImage(current)}
                    alt={current.food_name || "Food"}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80'; }}
                    style={{ willChange: 'transform, opacity' }} // Performance optimization
                  />
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
