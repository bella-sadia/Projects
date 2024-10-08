import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    const { userId, itemId } = req.body;

    // Validate that userId and itemId are present
    if (!userId || !itemId) {
        return res.status(400).json({ success: false, message: "User ID and Item ID are required" });
    }

    try {
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    const { userId, itemId } = req.body;

    // Validate that userId and itemId are present
    if (!userId || !itemId) {
        return res.status(400).json({ success: false, message: "User ID and Item ID are required" });
    }

    try {
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId]; // Remove item from cart if quantity is zero
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    const { userId } = req.body;

    // Validate that userId is present
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { addToCart, removeFromCart, getCart };
