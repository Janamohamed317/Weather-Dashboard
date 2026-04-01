import { searchCityByNameService } from "../../../src/services/geoService";
import axios from "axios";
import { NotFoundError, AppError } from "../../../src/utils/error";

jest.mock("axios");

describe("geoService", () => {
    const mockCityName = "London";
    const mockGeoResponse = {
        data: {
            results: [
                {
                    name: "London",
                    country: "United Kingdom",
                    latitude: 51.5074,
                    longitude: -0.1278
                }
            ]
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("searchCityByNameService", () => {
        it("should return city data if city is found", async () => {
            (axios.get as jest.Mock).mockResolvedValue(mockGeoResponse);

            const result = await searchCityByNameService(mockCityName);

            expect(result).toEqual({
                name: "London",
                country: "United Kingdom",
                latitude: 51.5074,
                longitude: -0.1278
            });
            expect(axios.get).toHaveBeenCalled();
        });

        it("should throw NotFoundError if no city results are returned", async () => {
            (axios.get as jest.Mock).mockResolvedValue({ data: { results: [] } });

            await expect(searchCityByNameService(mockCityName)).rejects.toThrow(NotFoundError);
        });

        it("should throw AppError if axios request fails", async () => {
            (axios.get as jest.Mock).mockRejectedValue(new Error("Axios error"));

            await expect(searchCityByNameService(mockCityName)).rejects.toThrow(AppError);
        });
    });
});
