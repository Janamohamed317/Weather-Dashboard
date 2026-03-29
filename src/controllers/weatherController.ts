import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getWeatherUpdatesService } from "../services/weatherService";
import { BadRequestError } from "../utils/error";

export const getWeatherData = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.query;
    if (typeof name !== "string" || !name.trim()) {
        throw new BadRequestError("Query parameter 'name' is required and must be a non-empty string.")
    }
    const weatherInfo = await getWeatherUpdatesService(name);
    res.status(200).json({ data: weatherInfo })
});

