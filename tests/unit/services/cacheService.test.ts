import { getCityFromCacheService, setCityInCacheService } from "../../../src/services/cacheService";
import redis from "../../../src/config/redisClient";

jest.mock("../../../src/config/redisClient", () => ({
    get: jest.fn(),
    setex: jest.fn(),
}));

describe("cacheService", () => {
    const mockCityName = "London";
    const mockWeatherData = {
        city: { name: "London", country: "UK", latitude: 51.5, longitude: -0.1 },
        current: { time: "2024-03-20T12:00", temperature: 15, windspeed: 10, humidity: 65, description: "Clear" },
        hourly: [],
        daily: []
    } as Parameters<typeof setCityInCacheService>[1];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getCityFromCacheService", () => {
        it("should return cached data if it exists", async () => {
            (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(mockWeatherData));

            const result = await getCityFromCacheService(mockCityName);

            expect(result).toEqual(mockWeatherData);
            expect(redis.get).toHaveBeenCalledWith(`weather:${mockCityName.toLowerCase()}`);
        });

        it("should return null if data is not in cache", async () => {
            (redis.get as jest.Mock).mockResolvedValue(null);

            const result = await getCityFromCacheService(mockCityName);

            expect(result).toBeNull();
        });
    });

    describe("setCityInCacheService", () => {
        it("should correctly set data in cache", async () => {
            await setCityInCacheService(mockCityName, mockWeatherData);

            expect(redis.setex).toHaveBeenCalledWith(`weather:${mockCityName.toLowerCase()}`, 900, JSON.stringify(mockWeatherData));
        });
    });
});
