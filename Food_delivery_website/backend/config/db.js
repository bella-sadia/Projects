import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://maishahaque3454:34542020@cluster0.erblmrn.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}