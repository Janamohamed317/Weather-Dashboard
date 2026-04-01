import { signupService, loginService } from "../../../src/services/authServices";
import { User } from "../../../src/models/UserModel";
import { tokenCreation } from "../../../src/utils/tokenCreation";
import { validateRegister, validateLogin } from "../../../src/utils/validations/userValidation";
import bcrypt from "bcryptjs";
import { BadRequestError, ConflictError, UnauthorizedError } from "../../../src/utils/error";

jest.mock("../../../src/models/UserModel");
jest.mock("../../../src/utils/tokenCreation");
jest.mock("../../../src/utils/validations/userValidation");
jest.mock("bcryptjs");

describe("authServices", () => {
    const mockUserRegister = {
        email: "test@example.com",
        username: "testuser",
        password: "Password123"
    };

    const mockUserLogin = {
        email: "test@example.com",
        password: "Password123"
    };

    const mockId = "mock-user-id";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("signupService", () => {
        it("should successfully signup a new user", async () => {
            (validateRegister as jest.Mock).mockReturnValue({ error: null });
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
            
            const mockSave = jest.fn().mockResolvedValue({ _id: mockId });
            (User as unknown as jest.Mock).mockImplementation(() => ({
                save: mockSave,
                _id: mockId
            }));

            (tokenCreation as jest.Mock).mockReturnValue("mock-token");

            const result = await signupService(mockUserRegister);

            expect(result).toEqual({ token: "mock-token", id: mockId });
            expect(mockSave).toHaveBeenCalled();
            expect(tokenCreation).toHaveBeenCalledWith(mockId);
        });

        it("should throw BadRequestError if validation fails", async () => {
            (validateRegister as jest.Mock).mockReturnValue({ 
                error: { details: [{ message: "Invalid email" }] } 
            });

            await expect(signupService(mockUserRegister)).rejects.toThrow(BadRequestError);
        });

        it("should throw ConflictError if email already exists", async () => {
            (validateRegister as jest.Mock).mockReturnValue({ error: null });
            (User.findOne as jest.Mock).mockResolvedValue({ email: mockUserRegister.email });

            await expect(signupService(mockUserRegister)).rejects.toThrow(ConflictError);
        });
    });

    describe("loginService", () => {
        it("should successfully login a user", async () => {
            (validateLogin as jest.Mock).mockReturnValue({ error: null });
            (User.findOne as jest.Mock).mockResolvedValue({ 
                _id: mockId,
                password: "hashed-password"
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (tokenCreation as jest.Mock).mockReturnValue("mock-token");

            const result = await loginService(mockUserLogin);

            expect(result).toEqual({ token: "mock-token", id: mockId });
            expect(tokenCreation).toHaveBeenCalledWith(mockId);
        });

        it("should throw UnauthorizedError if user not found", async () => {
            (validateLogin as jest.Mock).mockReturnValue({ error: null });
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(loginService(mockUserLogin)).rejects.toThrow(UnauthorizedError);
        });

        it("should throw UnauthorizedError if password does not match", async () => {
            (validateLogin as jest.Mock).mockReturnValue({ error: null });
            (User.findOne as jest.Mock).mockResolvedValue({ 
                password: "hashed-password"
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(loginService(mockUserLogin)).rejects.toThrow(UnauthorizedError);
        });
    });
});
