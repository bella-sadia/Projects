import DeliveryPartner from '../models/DeliveryPartner.js'; 
import mongoose from 'mongoose';  // Add this line to import Mongoose
import { ObjectId } from 'mongodb';

export const getAvailablePartners = async (req, res) => {
    try {
        console.log("Fetching available partners...");
        const partners = await DeliveryPartner.find({});
        console.log("Query executed:", DeliveryPartner.find({}).getQuery());  // Log the actual query
        console.log("Partners found:", partners);  // This will show all the results from the query

        if (partners.length === 0) {
            console.log("No partners found at all!");
        } else {
            console.log("All partners found:", partners);
        }

        res.json({ success: true, data: partners });
    } catch (error) {
        console.error('Error fetching delivery partners:', error);
        res.status(500).json({ message: 'Error fetching delivery partners', error });
    }
};


// Assign delivery partner to an order
export const assignPartner = async (req, res) => {
    const { orderId, partnerId } = req.body;

    console.log("Assigning with Order ID:", orderId, "Partner ID:", partnerId);

    try {
        const orderObjectId = new ObjectId(orderId);  // Convert to ObjectId
        const partnerObjectId = new ObjectId(partnerId);

        // Update the order to assign the delivery partner
        const orderUpdateResult = await mongoose.connection.db.collection('orders').updateOne(
            { _id: orderObjectId },
            { $set: { delivery_partner_id: partnerObjectId, status: 'Out for delivery' } }
        );
        console.log("Order update result:", orderUpdateResult);

        // Mark the delivery partner as 'Busy'
        const partnerUpdateResult = await DeliveryPartner.updateOne(
            { _id: partnerObjectId },
            { $set: { status: 'Busy' } }
        );
        console.log("Partner update result:", partnerUpdateResult);

        res.json({ message: 'Delivery partner assigned successfully!' });
    } catch (error) {
        console.error('Error assigning delivery partner:', error);
        res.status(500).json({ message: 'Error assigning delivery partner', error });
    }
};

// Update order status and free the delivery partner
export const updateOrderStatus = async (req, res) => {
    const { orderId, partnerId } = req.body;

    console.log("Updating Order ID:", orderId, "Partner ID:", partnerId);

    try {
        const orderObjectId = new ObjectId(orderId);
        const partnerObjectId = new ObjectId(partnerId);

        // Update the order status to 'Delivered'
        const orderUpdateResult = await mongoose.connection.db.collection('orders').updateOne(
            { _id: orderObjectId },
            { $set: { status: 'Delivered' } }
        );
        console.log("Order status update result:", orderUpdateResult);

        // Mark the delivery partner as 'Available' again
        const partnerUpdateResult = await DeliveryPartner.updateOne(
            { _id: partnerObjectId },
            { $set: { status: 'Available' } }
        );
        console.log("Partner status update result:", partnerUpdateResult);

        res.json({ message: 'Order status updated and delivery partner is now available' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status', error });
    }
};