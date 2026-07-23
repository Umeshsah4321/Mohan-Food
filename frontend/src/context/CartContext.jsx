import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('mafood_cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('mafood_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (food, showToast = true) => {
        if (!user) {
            toast.error("Please login or create an account to continue.");
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
            return;
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === food.id);
            if (existingItem) {
                if (showToast) toast.success(`Increased quantity of ${food.name}`, { id: `cart-${food.id}` });
                return prevItems.map(item => 
                    item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            if (showToast) toast.success(`Added ${food.name} to cart!`, { id: `cart-${food.id}` });
            return [...prevItems, { ...food, quantity: 1 }];
        });
    };


    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        toast.error('Item removed from cart', { id: 'cart-remove' });
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setCartItems(prevItems => 
            prevItems.map(item => item.id === id ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => {
        setCartItems([]);
        toast.success('Cart cleared!', { id: 'cart-clear' });
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    
    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const buyNow = (food) => {
        addToCart(food, false);
        toast.success(`Redirecting to checkout for ${food.name}...`, { icon: '🚀', id: 'checkout' });
        setTimeout(() => {
            window.location.href = '/checkout';
        }, 500);
    };

    const value = {
        cart: cartItems,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        buyNow
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
