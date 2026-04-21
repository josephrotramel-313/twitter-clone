import mongoose from "mongoose";
import dotenv from "dotenv/config"
export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected")
    } catch (error) {
        console.error(error)
    }

}

