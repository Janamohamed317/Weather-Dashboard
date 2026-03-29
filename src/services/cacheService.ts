import redis from "../config/redisClient";
import { NormalizedWeatherResponse } from "../types/Weather";

const WEATHER_TTL = 900;

export const getCityFromCacheService = async (name: string): Promise<NormalizedWeatherResponse | null> => {
    const cached = await redis.get(`weather:${name.toLowerCase()}`);
    return cached ? JSON.parse(cached) : null;
};

export const setCityInCacheService = async (name: string, data: NormalizedWeatherResponse): Promise<void> => {
    await redis.setex(`weather:${name.toLowerCase()}`, WEATHER_TTL, JSON.stringify(data));
};