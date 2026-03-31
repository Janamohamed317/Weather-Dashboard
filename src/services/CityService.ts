import { CityModel } from "../models/CityModel";
import { City } from "../types/City";
import { BadRequestError, ConflictError, NotFoundError, isMongoError } from "../utils/error";
import { validateCityAdd } from "../utils/validations/cityValidation";

export const markCityAsFavoriteService = async (city: City, userId: string) => {
    const { error } = validateCityAdd(city);
    if (error) {
        throw new BadRequestError(error.details[0].message);
    }
    try {
        const newCity = new CityModel({
            name: city.name,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude,
            userId
        });
        await newCity.save();
        return newCity;
    } catch (error: unknown) {
        if (isMongoError(error) && error.code === 11000) {
            throw new ConflictError("City is already in your favorites");
        }
        throw error;
    }
};

export const getUserFavoritesService = async (userId: string, page: number = 1) => {
    const limit = 10;
    const skip = (page - 1) * limit;

    const [cities, total] = await Promise.all([
        CityModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip),
        CityModel.countDocuments({ userId })
    ]);

    return {
        cities,
        totalPages: Math.ceil(total / limit)
    };
};

export const unmarkFavoriteCityService = async (cityId: string, userId: string) => {
    const city = await CityModel.findOne({ _id: cityId, userId });
    if (!city) {
        throw new NotFoundError("City not found in your favorites");
    }
    await city.deleteOne();
};