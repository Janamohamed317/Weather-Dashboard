import { Response } from "express";
import asyncHandler from "express-async-handler";
import { City } from "../types/City";
import { AuthRequest } from "../types/AuthRequest";
import { getUserFavoritesService, markCityAsFavoriteService, unmarkFavoriteCityService } from "../services/CityService";

export const markFavCity = asyncHandler(async (req: AuthRequest<{}, {}, City>, res: Response) => {
    const city = await markCityAsFavoriteService(req.body, req.user!.id);
    res.status(201).json({ message: "City added to favorites", data: city });
});

export const getFavCities = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const result = await getUserFavoritesService(req.user!.id, page);
    res.status(200).json({ data: result });
});

export const unmarkFavCity = asyncHandler(async (req: AuthRequest<{ id: string }>, res: Response) => {
    await unmarkFavoriteCityService(req.params.id, req.user!.id);
    res.status(200).json({ message: "City removed from favorites" });
});