import axios from "axios";
import { searchCityByNameService } from "./geoService";
import { normalizeWeather } from "../utils/normalizeWeather";
import { AppError } from "../utils/error";
import { getCityFromCacheService, setCityInCacheService } from "./cacheService";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export const getWeatherUpdatesService = async (name: string) => {
    const cached = await getCityFromCacheService(name);
    if (cached) {
        return cached;
    }

    const city = await searchCityByNameService(name);

    try {
        const response = await axios.get(FORECAST_URL, {
            params: {
                latitude: city.latitude,
                longitude: city.longitude,
                current: "temperature_2m,weathercode,windspeed_10m,relative_humidity_2m",
                hourly: "temperature_2m,precipitation_probability,weathercode",
                daily: "temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum",
                timezone: "auto",
                forecast_days: 7,
            },
        });

        const weather = normalizeWeather(response.data, city);
        await setCityInCacheService(name, weather);
        return weather;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Weather service is currently unavailable", 503);
    }
};