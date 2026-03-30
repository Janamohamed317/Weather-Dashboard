export type City = {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

export type GeoResponse = {
    results?: City[];
};

export interface ReverseGeoResponse {
    city: string;
    countryName: string;
    latitude: number;
    longitude: number;
}