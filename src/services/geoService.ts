import axios from "axios";
import { AppError, NotFoundError } from "../utils/error";
import { City, GeoResponse } from "../types/City";

const geoURL = "https://geocoding-api.open-meteo.com/v1";

export const searchCityByNameService = async (name: string): Promise<City> => {
    try {
        const response = await axios.get<GeoResponse>(`${geoURL}/search`, {
            params: {
                name,
                count: 1,
                language: "en",
                format: "json",
            },
        });

        const city = response.data.results?.[0];

        if (!city) {
            throw new NotFoundError(`City "${name}" not found`);
        }

        return {
            name: city.name,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude,
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error; 
        }
        throw new AppError("Search service unavailable", 503);
    }

};

