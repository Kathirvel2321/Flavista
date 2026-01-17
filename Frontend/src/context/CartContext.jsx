import React from 'react'
import { useContext, createContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({children}) => {
    // Load cart from localStorage on initial render
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('flavista_cart');
        return localData ? JSON.parse(localData) : [];
    });

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('flavista_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        // Check if item with same ID and Extras already exists
        const existingItemIndex = cart.findIndex(
            (cartItem) => cartItem.id === item.id && JSON.stringify(cartItem.selectedExtras) === JSON.stringify(item.selectedExtras)
        );

        if (existingItemIndex > -1) {
            const newCart = [...cart];
            newCart[existingItemIndex].quantity += item.quantity;
            setCart(newCart);
        } else {
            setCart([...cart, { ...item, cartId: Date.now() }]);
        }
    }

    const removeFromCart = (cartId) => {
        setCart(cart.filter(item => item.cartId !== cartId))
    }

    const updateQuantity = (cartId, delta) => {
        setCart(cart.map(item => {
            if (item.cartId === cartId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([])
    }

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const contextValue = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        clearCart
    }   

  return (
    <CartContext.Provider value={contextValue}>
        {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
    return useContext(CartContext)
}