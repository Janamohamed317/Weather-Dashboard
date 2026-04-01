import { AppError, BadRequestError, ConflictError, NotFoundError, UnauthorizedError, ForbiddenError, isMongoError } from "../../../src/utils/error";

describe("Error utility", () => {
    it("should correctly handle AppError properties", () => {
        const error = new AppError("Message", 500);
        expect(error.message).toBe("Message");
        expect(error.statusCode).toBe(500);
        expect(error.isOperational).toBe(true);
    });

    it("should correctly handle BadRequestError", () => {
        const error = new BadRequestError("Bad Request");
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Bad Request");
    });

    it("should correctly handle ConflictError", () => {
        const error = new ConflictError("Conflict");
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe("Conflict");
    });

    it("should correctly handle NotFoundError", () => {
        const error = new NotFoundError("Not Found");
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Not Found");
    });

    it("should correctly handle UnauthorizedError", () => {
        const error = new UnauthorizedError("Unauthorized");
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Unauthorized");
    });

    it("should correctly handle ForbiddenError", () => {
        const error = new ForbiddenError("Forbidden");
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("Forbidden");
    });

    it("should correctly identify MongoError", () => {
        const mongoError = { message: "Error", code: 11000 };
        expect(isMongoError(mongoError)).toBe(true);

        const regularError = new Error("General Error");
        expect(isMongoError(regularError)).toBe(false);

        expect(isMongoError(null)).toBe(false);
        expect(isMongoError("Not an error")).toBe(false);
    });
});
