import orderModel from '../models/orderModel.js';
import SSLCommerzPayment from 'sslcommerz-lts';
import dotenv from 'dotenv';
import { check, validationResult } from 'express-validator';

dotenv.config();

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWD;
const is_live = process.env.SSL_IS_LIVE === 'true';

const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);

const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

// Helper function to initialize payment
const initializePayment = async (paymentData) => {
    try {
        console.log('Initializing payment with data:', paymentData); // Log the payment data
        const data = await sslcommerz.init(paymentData);
        if (data.GatewayPageURL) {
            console.log('Payment initialization successful:', data.GatewayPageURL); // Log success response
            return { success: true, session_url: data.GatewayPageURL };
        } else {
            console.error('Payment initialization failed data:', data); // Log the failed response
            return { success: false, message: 'Payment initialization failed', data };
        }
    } catch (error) {
        console.error('SSLCommerz init error:', error.response?.data || error.message); // Log any initialization errors with detailed error info
        throw new Error('SSLCommerz init error');
    }
};

const placeOrder = [
    // Validation middleware
    check('userId').notEmpty().withMessage('User ID is required'),
    check('items').isArray({ min: 1 }).withMessage('Items should be an array with at least one item'),
    check('amount').isNumeric().withMessage('Amount must be a number'),
    check('address.firstName').notEmpty().withMessage('First name is required'),
    check('address.lastName').notEmpty().withMessage('Last name is required'),
    check('address.email').isEmail().withMessage('Valid email is required'),
    check('address.phone').notEmpty().withMessage('Phone number is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
        }

        try {
            const newOrder = new orderModel({
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
            });
            await newOrder.save();

            // Dynamically generate product_name from the items in the order
            const productNames = req.body.items.map(item => item.name).join(',');

            const paymentData = {
                total_amount: req.body.amount,
                currency: 'BDT',
                tran_id: newOrder._id.toString(),
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                fail_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/cancel`,
                cus_name: `${req.body.address.firstName} ${req.body.address.lastName}`,
                cus_email: req.body.address.email,
                cus_add1: `${req.body.address.street}, ${req.body.address.city}, ${req.body.address.country}`,
                cus_phone: req.body.address.phone,
                shipping_method: 'YES', // Indicates that physical delivery is involved
                product_name: productNames, // Dynamically generated product names based on the order
                product_category: 'Food', // Adding product_category field
                product_profile: 'physical-goods', // Adding product_profile field
                ship_name: `${req.body.address.firstName} ${req.body.address.lastName}`, // Adding ship_name field
                ship_add1: `${req.body.address.street}, ${req.body.address.city}, ${req.body.address.country}`, // Adding ship_add1 field
                ship_city: req.body.address.city, // Adding ship_city field
                ship_postcode: req.body.address.zipCode, // Adding ship_postcode field
                ship_country: req.body.address.country, // Adding ship_country field
            };

            console.log('Order Data:', newOrder); // Log the order data before proceeding

            const paymentResponse = await initializePayment(paymentData);
            if (paymentResponse.success) {
                res.json(paymentResponse);
            } else {
                console.error('Payment initialization failed:', paymentResponse.message); // Log specific failure reason
                res.status(400).json(paymentResponse);
            }
        } catch (error) {
            console.error('Order placement error:', error); // Log the full error for server errors
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
];

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    console.log('Verifying order:', { orderId, success });
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            console.log('Order verified and updated to paid:', orderId);
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            console.log('Order deleted due to payment failure:', orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error('Error during order verification:', error);
        res.json({ success: false, message: "Error" });
    }
};
const userOrders = async(req, res) => {
    try {
        const { userId } = req.body; // Destructure userId from the request body
        console.log("Received User ID:", userId); // Log the received userId
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        
        const orders = await orderModel.find({ userId });
        console.log("Orders found:", orders); // Log the orders found
        
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("Error fetching user orders:", error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

//Listing orders for admin pannel
const listOrders= async (req,res)=>{
    try{
        const orders= await orderModel.find({});
        res.json({success:true,data:orders})
    } catch(error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }


}

//api for updating order status
const updateStatus = async(req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    }catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}


export { placeOrder, verifyOrder, userOrders,listOrders,updateStatus };
