import { City } from "../types/City";
import { NormalizedWeatherResponse, RawWeatherResponse } from "../types/Weather";

const mapWeatherCode = (code: number): string => {
    if (code === 0) return "Clear sky";
    if (code <= 3) return "Partly cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Showers";
    if (code <= 95) return "Thunderstorm";
    return "Unknown";
};

export const normalizeWeather = (data: RawWeatherResponse, city: City): NormalizedWeatherResponse => {
    return {
        city: {
            name: city.name,
            country: city.country
        },
        current: {
            time: data.current.time,
            temperature: data.current.temperature_2m,
            windspeed: data.current.windspeed_10m,
            humidity: data.current.relative_humidity_2m,
            weathercode: data.current.weathercode,
            description: mapWeatherCode(data.current.weathercode)
        },
        hourly: data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
            time,
            temperature: data.hourly.temperature_2m[i],
            precipitation_probability: data.hourly.precipitation_probability[i],
            weathercode: data.hourly.weathercode[i],
            description: mapWeatherCode(data.hourly.weathercode[i])
        })),
        daily: data.daily.time.map((date: string, i: number) => ({
            date,
            precipitation_sum: data.daily.precipitation_sum[i],
            max_temperature: data.daily.temperature_2m_max[i],
            min_temperature: data.daily.temperature_2m_min[i],
            weathercode: data.daily.weathercode[i],
            description: mapWeatherCode(data.daily.weathercode[i])
        }))
    };
};