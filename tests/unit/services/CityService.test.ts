import { markCityAsFavoriteService, getUserFavoritesService, unmarkFavoriteCityService } from "../../../src/services/CityService";
import { CityModel } from "../../../src/models/CityModel";
import { validateCityAdd } from "../../../src/utils/validations/cityValidation";
import { BadRequestError, ConflictError, NotFoundError } from "../../../src/utils/error";

jest.mock("../../../src/models/CityModel");
jest.mock("../../../src/utils/validations/cityValidation");

describe("CityService", () => {
    const mockUserId = "test-user-id";
    const mockCity = {
        name: "London",
        country: "United Kingdom",
        latitude: 51.5,
        longitude: -0.1
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("markCityAsFavoriteService", () => {
        it("should successfully add a city to favorites", async () => {
            (validateCityAdd as jest.Mock).mockReturnValue({ error: null });
            
            const mockSave = jest.fn().mockResolvedValue({ _id: "city-id" });
            (CityModel as unknown as jest.Mock).mockImplementation(() => ({
                save: mockSave
            }));

            await markCityAsFavoriteService(mockCity, mockUserId);

            expect(mockSave).toHaveBeenCalled();
        });

        it("should throw BadRequestError if validation fails", async () => {
            (validateCityAdd as jest.Mock).mockReturnValue({ 
                error: { details: [{ message: "Invalid city data" }] } 
            });

            await expect(markCityAsFavoriteService(mockCity, mockUserId)).rejects.toThrow(BadRequestError);
        });

        it("should throw ConflictError if city is already in favorites", async () => {
            (validateCityAdd as jest.Mock).mockReturnValue({ error: null });
            
            const mockSave = jest.fn().mockRejectedValue({ code: 11000 });
            (CityModel as unknown as jest.Mock).mockImplementation(() => ({
                save: mockSave
            }));

            await expect(markCityAsFavoriteService(mockCity, mockUserId)).rejects.toThrow(ConflictError);
        });
    });

    describe("getUserFavoritesService", () => {
        it("should return paginated cities", async () => {
            const mockCities = [{ name: "City 1" }, { name: "City 2" }];
            (CityModel.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue(mockCities)
            });
            (CityModel.countDocuments as jest.Mock).mockResolvedValue(2);

            const result = await getUserFavoritesService(mockUserId);

            expect(result.cities).toEqual(mockCities);
            expect(result.totalPages).toBe(1);
        });
    });

    describe("unmarkFavoriteCityService", () => {
        it("should successfully remove a city", async () => {
            const mockDeleteOne = jest.fn().mockResolvedValue({});
            (CityModel.findOne as jest.Mock).mockResolvedValue({
                deleteOne: mockDeleteOne
            });

            await unmarkFavoriteCityService("city-id", mockUserId);

            expect(mockDeleteOne).toHaveBeenCalled();
        });

        it("should throw NotFoundError if city does not exist", async () => {
            (CityModel.findOne as jest.Mock).mockResolvedValue(null);

            await expect(unmarkFavoriteCityService("city-id", mockUserId)).rejects.toThrow(NotFoundError);
        });
    });
});
