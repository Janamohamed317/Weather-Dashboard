import { getWeatherBySearchService, getWeatherByCoordinatesService, validateCoordinatesService } from "../../../src/services/weatherService";
import axios from "axios";
import { searchCityByNameService } from "../../../src/services/geoService";
import { normalizeWeather } from "../../../src/utils/normalizeWeather";
import { getCityFromCacheService, setCityInCacheService } from "../../../src/services/cacheService";
import { BadRequestError } from "../../../src/utils/error";

jest.mock("axios");
jest.mock("../../../src/services/geoService");
jest.mock("../../../src/utils/normalizeWeather");
jest.mock("../../../src/services/cacheService");

describe("weatherService", () => {
    const mockCityName = "London";
    const mockWeatherData = { city: "London", current: {} };
    const mockLat = 51.5;
    const mockLng = -0.1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getWeatherBySearchService", () => {
        it("should return cached data if available", async () => {
            (getCityFromCacheService as jest.Mock).mockResolvedValue(mockWeatherData);

            const result = await getWeatherBySearchService(mockCityName);

            expect(result).toEqual(mockWeatherData);
            expect(searchCityByNameService).not.toHaveBeenCalled();
        });

        it("should fetch, normalize, and cache data if not cached", async () => {
            (getCityFromCacheService as jest.Mock).mockResolvedValue(null);
            (searchCityByNameService as jest.Mock).mockResolvedValue({ name: mockCityName, latitude: mockLat, longitude: mockLng });
            (axios.get as jest.Mock).mockResolvedValue({ data: { hourly: {} } });
            (normalizeWeather as jest.Mock).mockReturnValue(mockWeatherData);

            const result = await getWeatherBySearchService(mockCityName);

            expect(result).toEqual(mockWeatherData);
            expect(setCityInCacheService).toHaveBeenCalled();
        });
    });

    describe("getWeatherByCoordinatesService", () => {
        it("should return cached data if available", async () => {
            (getCityFromCacheService as jest.Mock).mockResolvedValue(mockWeatherData);

            const result = await getWeatherByCoordinatesService(mockLat, mockLng);

            expect(result).toEqual(mockWeatherData);
            expect(axios.get).not.toHaveBeenCalled();
        });

        it("should fetch reversed geocode, forecast, and normalize and cache", async () => {
            (getCityFromCacheService as jest.Mock).mockResolvedValue(null);
            (axios.get as jest.Mock)
                .mockResolvedValueOnce({ data: { city: "London", countryName: "UK" } })
                .mockResolvedValueOnce({ data: { hourly: {} } });

            (normalizeWeather as jest.Mock).mockReturnValue(mockWeatherData);

            const result = await getWeatherByCoordinatesService(mockLat, mockLng);

            expect(result).toEqual(mockWeatherData);
            expect(setCityInCacheService).toHaveBeenCalled();
        });
    });

    describe("validateCoordinatesService", () => {
        it("should return valid coordinates for correct inputs", () => {
            const result = validateCoordinatesService("51.5", "-0.1");
            expect(result).toEqual({ latitude: 51.5, longitude: -0.1 });
        });

        it("should throw BadRequestError if inputs are not strings", () => {
            expect(() => validateCoordinatesService(51.5, true)).toThrow(BadRequestError);
        });

        it("should throw BadRequestError if inputs are not valid numbers", () => {
            expect(() => validateCoordinatesService("abc", "123")).toThrow(BadRequestError);
        });

        it("should throw BadRequestError if latitude is out of range", () => {
            expect(() => validateCoordinatesService("100", "0")).toThrow(BadRequestError);
        });

        it("should throw BadRequestError if longitude is out of range", () => {
            expect(() => validateCoordinatesService("0", "200")).toThrow(BadRequestError);
        });
    });
});
