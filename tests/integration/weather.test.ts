import request from "supertest";
import app from "../../src/app";
import redis from "../../src/config/redisClient";

describe("Weather Integration Tests", () => {
    afterEach(async () => {
        const keys = await redis.keys('weather:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    });
    it("should get weather data by city name (search)", async () => {
        const cityName = "London";
        const response = await request(app)
            .get("/api/weather/city-weather/search")
            .query({ name: cityName });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.city.name.toLowerCase()).toContain(cityName.toLowerCase());
        expect(response.body.data.current).toHaveProperty("temperature");
    }, 10000);

    it("should get weather data by coordinates", async () => {
        const coords = { lat: "51.5074", lng: "-0.1278" };
        const response = await request(app)
            .get("/api/weather/city-weather/coordinates")
            .query(coords);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.city.latitude).toBeCloseTo(Number(coords.lat), 1);
        expect(response.body.data.city.longitude).toBeCloseTo(Number(coords.lng), 1);
    }, 10000);

    it("should return 400 for missing search name", async () => {
        const response = await request(app)
            .get("/api/weather/city-weather/search")
            .query({ name: "" });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/Query parameter 'name' is required/i);
    });

    it("should return 400 for invalid coordinates", async () => {
        const response = await request(app)
            .get("/api/weather/city-weather/coordinates")
            .query({ lat: "95", lng: "200" });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/'lat' must be between -90 and 90|'lng' must be between -180 and 180/i);
    });
});
