import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true,ref:'User' },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
    transactionId: { type: String, default: null },
    paymentStatus: { type: String, default: "Pending" },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
