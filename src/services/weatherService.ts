import axios from "axios";
import { searchCityByNameService } from "./geoService";
import { normalizeWeather } from "../utils/normalizeWeather";
import { AppError, BadRequestError } from "../utils/error";
import { getCityFromCacheService, setCityInCacheService } from "./cacheService";
import { ReverseGeoResponse } from "../types/City";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export const getWeatherBySearchService = async (name: string) => {
    const cached = await getCityFromCacheService(name);
    if (cached) {
        return cached;
    }

    const city = await searchCityByNameService(name);
    const data = await fetchForecast(city.latitude, city.longitude)
    const weather = normalizeWeather(data, city);
    await setCityInCacheService(name, weather);
    return weather;

}

export const getWeatherByCoordinatesService = async (lat: number, lng: number) => {
    const cached = await getCityFromCacheService(`${lat.toFixed(4)},${lng.toFixed(4)}`);
    if (cached) return cached;

    const geoResponse = await getCityByCoordinatesService(lat, lng)    
    const city = {
        name: geoResponse.city,
        country: geoResponse.countryName,
        latitude: lat,
        longitude: lng
    };

    const data = await fetchForecast(city.latitude, city.longitude)
    const weather = normalizeWeather(data, city)
    await setCityInCacheService(`${lat.toFixed(4)},${lng.toFixed(4)}`, weather)
    return weather;

}

const fetchForecast = async (lat: number, lng: number) => {
    try {
        const response = await axios.get(FORECAST_URL, {
            params: {
                latitude: lat,
                longitude: lng,
                current: "temperature_2m,weathercode,windspeed_10m,relative_humidity_2m",
                hourly: "temperature_2m,precipitation_probability,weathercode",
                daily: "temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum",
                timezone: "auto",
                forecast_days: 7,
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Weather service is currently unavailable", 503);
    }
};

const getCityByCoordinatesService = async (lat: number, lng: number) => {
    try {
        const response = await axios.get<ReverseGeoResponse>(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Weather service is currently unavailable", 503);
    }
}

export const validateCoordinatesService = (lat: unknown, lng: unknown) => {
    if (typeof lat !== "string" || typeof lng !== "string") {
        throw new BadRequestError("Query parameters 'lat' and 'lng' are required");
    }

    const latitude = Number(lat)
    const longitude = Number(lng)

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        throw new BadRequestError("'lat' and 'lng' must be valid numbers")
    }

    if (latitude < -90 || latitude > 90) {
        throw new BadRequestError("'lat' must be between -90 and 90")
    }

    if (longitude < -180 || longitude > 180) {
        throw new BadRequestError("'lng' must be between -180 and 180")
    }

    return { latitude, longitude }
};