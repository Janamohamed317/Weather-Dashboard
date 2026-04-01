import { normalizeWeather } from "../../../src/utils/normalizeWeather";
import { City } from "../../../src/types/City";
import { RawWeatherResponse } from "../../../src/types/Weather";

describe("normalizeWeather utility", () => {
    const mockCity: City = {
        name: "London",
        country: "United Kingdom",
        latitude: 51.5074,
        longitude: -0.1278,
    };

    const mockRawData: RawWeatherResponse = {
        current: {
            interval: 5,
            time: "2024-03-20T12:00",
            temperature_2m: 15.4,
            windspeed_10m: 10.2,
            relative_humidity_2m: 65.8,
            weathercode: 0,
        },
        hourly: {
            time: Array(24).fill("2024-03-20T12:00"),
            temperature_2m: Array(24).fill(15.4),
            precipitation_probability: Array(24).fill(10),
            weathercode: Array(24).fill(0),
        },
        daily: {
            time: ["2024-03-20"],
            temperature_2m_max: [18.2],
            temperature_2m_min: [12.1],
            precipitation_sum: [0.5],
            weathercode: [0],
        },
    };

    it("should correctly normalize current weather data", () => {
        const result = normalizeWeather(mockRawData, mockCity);

        expect(result.city.name).toBe("London");
        expect(result.current.temperature).toBe(15);
        expect(result.current.description).toBe("Clear sky");
    });

    it("should correctly map weather codes", () => {
        const dataWithCloudy: RawWeatherResponse = {
            ...mockRawData,
            current: { ...mockRawData.current, weathercode: 3 }
        };
        const result = normalizeWeather(dataWithCloudy, mockCity);
        expect(result.current.description).toBe("Partly cloudy");
    });

    it("should handle rounding correctly", () => {
        const dataToRound: RawWeatherResponse = {
            ...mockRawData,
            current: {
                ...mockRawData.current,
                temperature_2m: 15.5,
                windspeed_10m: 10.6,
                relative_humidity_2m: 65.2
            }
        };
        const result = normalizeWeather(dataToRound, mockCity);
        expect(result.current.temperature).toBe(16);
        expect(result.current.windspeed).toBe(11);
        expect(result.current.humidity).toBe(65);
    });

    it("should slice hourly data to 24 hours", () => {
        const longHourlyData: RawWeatherResponse = {
            ...mockRawData,
            hourly: {
                time: Array(48).fill("time"),
                temperature_2m: Array(48).fill(10),
                precipitation_probability: Array(48).fill(0),
                weathercode: Array(48).fill(0),
            }
        };
        const result = normalizeWeather(longHourlyData, mockCity);
        expect(result.hourly.length).toBe(24);
    });
});
