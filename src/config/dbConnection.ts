import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

export async function dbConnection() {
    if (!process.env.MONGO_URI) {
        throw new Error("Mongo Connection String is required")
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected To MongoDB...");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("Error connection to MongoDB: ", error.message);
        } else {
            console.log("Error connection to MongoDB: ", String(error));
        }
        process.exit(1);
    }
};

