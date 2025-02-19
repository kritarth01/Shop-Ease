import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

const cartContext = createContext();

const CartState = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        return storedCart || [];
    });

    
    return (
        <cartContext.Provider value={[cart, setCart]}>
            {children}
        </cartContext.Provider>
    );
};

const useCart = () => useContext(cartContext);

export { useCart, CartState };
