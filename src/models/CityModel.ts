import mongoose from "mongoose";

const CitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
}, { timestamps: true });

CitySchema.index({ userId: 1, name: 1 }, { unique: true });

export const CityModel = mongoose.model("City", CitySchema);