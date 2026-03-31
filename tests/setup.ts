import mongoose from "mongoose";
import redis from "../src/config/redisClient";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
    const mongoUri = process.env.MONGO_TEST_URI;
    if (!mongoUri) {
        throw new Error("MONGO_TEST_URI is not defined in .env");
    }
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await redis.quit();
});

afterEach(async () => {
    const keys = await redis.keys('weather:*');
    if (keys.length > 0) {
        await redis.del(...keys);
    }

    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
