import axios from "axios";
import { createContext, useEffect, useState, useMemo } from "react";
import {jwtDecode} from "jwt-decode";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState("");
    const [user, setUser] = useState(null);
    const url = "http://localhost:4000";

    const logToken = () => {
        console.log("Current token:", token);
    };

    const addToCart = async (itemId) => {
        console.log("Adding to cart:", itemId);
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));

        if (token && user && user._id) {
            try {
                await axios.post(
                    `${url}/api/cart/add`,
                    { userId: user._id, itemId },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Error adding item to cart:", error);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        console.log("Removing from cart:", itemId);
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[itemId] > 1) {
                updatedCart[itemId] -= 1;
            } else {
                delete updatedCart[itemId];
            }
            return updatedCart;
        });

        if (token && user && user._id) {
            try {
                await axios.post(
                    `${url}/api/cart/remove`,
                    { userId: user._id, itemId },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Error removing item from cart:", error);
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                } else {
                    console.warn(`Item with ID ${item} not found in food_list`);
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    const validateCartData = (cartData) => {
        for (const key in cartData) {
            if (cartData.hasOwnProperty(key)) {
                const item = cartData[key];
                if (!item || typeof item !== "number") {
                    console.warn(`Invalid cart item detected:`, item);
                    return false;
                }
            }
        }
        return true;
    };

    const loadCartData = async () => {
        if (!user || !user._id) {
            console.warn("User is not logged in or user ID is missing");
            return;
        }

        try {
            const response = await axios.post(
                url + "/api/cart/get",
                { userId: user._id },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data && validateCartData(response.data.cartData)) {
                setCartItems(response.data.cartData);
            } else {
                console.warn("Invalid or missing cart data", response.data);
                setCartItems({});
            }
        } catch (error) {
            console.error("Error loading cart data:", error);
            setCartItems({});
        }
    };
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                console.log("Stored token from localStorage:", storedToken);
                setToken(storedToken);
    
                try {
                    const decodedUser = jwtDecode(storedToken);
                    console.log("Decoded user:", decodedUser);
                    if (decodedUser && decodedUser.id) {
                        setUser({ _id: decodedUser.id });
                        console.log("User ID:", decodedUser.id); // Log the user ID
                    } else {
                        console.error("Invalid token. Unable to decode user ID.");
                        localStorage.removeItem("token"); // Clear invalid token
                    }
                } catch (error) {
                    console.error("Error decoding token:", error);
                    localStorage.removeItem("token"); // Remove invalid or expired token
                }
    
                logToken();
            } else {
                console.warn("No stored token found");
            }
        }
        loadData();
    }, []);
    

    useEffect(() => {
        if (token && user && user._id) {
            loadCartData();
        }
    }, [user]);

    const contextValue = useMemo(() => ({
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        user,
        setUser,
    }), [food_list, cartItems, token, user]);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
