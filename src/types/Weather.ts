import { City } from "./City";

export type RawCurrent = {
    time: string;
    interval: number;
    temperature_2m: number;
    windspeed_10m: number;
    relative_humidity_2m: number;
    weathercode: number;
}

export type RawHourly = {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weathercode: number[];
}

export type RawDaily = {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    precipitation_sum: number[];
}

export type RawWeatherResponse = {
    current: RawCurrent;
    hourly: RawHourly;
    daily: RawDaily;
}

export type NormalizedCurrent = {
    time: string;
    temperature: number;
    windspeed: number;
    humidity: number;
    weathercode: number;
    description: string;
}

export type NormalizedHourly = {
    time: string;
    temperature: number;
    precipitation_probability: number;
    weathercode: number;
    description: string;
}

export type NormalizedDaily = {
    date: string;
    max_temperature: number;
    min_temperature: number;
    precipitation_sum: number;
    weathercode: number;
    description: string;
}

export type NormalizedWeatherResponse = {
    city: City
    current: NormalizedCurrent;
    hourly: NormalizedHourly[];
    daily: NormalizedDaily[];
}