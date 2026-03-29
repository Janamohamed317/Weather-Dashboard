import mongoose from "mongoose"
require('dotenv').config();

export async function dbConnection() {
    if (!process.env.MONGO_URI) {
        throw new Error("Mongo Connection String is required")
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected To MongoDB...");
    } catch (error: any) {
        console.log("Error connection to MongoDB: ", error.message);
        process.exit(1);
    }
};

