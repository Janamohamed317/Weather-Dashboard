import { tokenCreation } from "../../../src/utils/tokenCreation";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("tokenCreation utility", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("should correctly generate a token", async () => {
        process.env.SECRET_KEY = "test-secret";
        (jwt.sign as jest.Mock).mockReturnValue("test-token");

        const result = tokenCreation("test-id");
        expect(result).toBe("test-token");
        expect(jwt.sign).toHaveBeenCalledWith({ id: "test-id" }, "test-secret", { expiresIn: "7d" });
    });

    it("should throw error if SECRET_KEY is not defined", () => {
        delete process.env.SECRET_KEY;
        expect(() => tokenCreation("test-id")).toThrow("SECRET_KEY is not defined in environment variables");
    });
});
