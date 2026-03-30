import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getWeatherByCoordinatesService, getWeatherBySearchService, validateCoordinatesService } from "../services/weatherService";
import { BadRequestError } from "../utils/error";

export const getWeatherBySearch = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.query;
    if (typeof name !== "string" || !name.trim()) {
        throw new BadRequestError("Query parameter 'name' is required and must be a non-empty string.")
    }
    const weatherInfo = await getWeatherBySearchService(name);
    res.status(200).json({ data: weatherInfo })
});


export const getWeatherByCoordinates = asyncHandler(async (req: Request, res: Response) => {
    const { lat, lng } = req.query;
    const data = validateCoordinatesService(lat, lng)
    const weatherInfo = await getWeatherByCoordinatesService(data?.latitude, data?.longitude);
    res.status(200).json({ data: weatherInfo })
});

