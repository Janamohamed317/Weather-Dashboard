import { validateRegister, validateLogin } from "../../../src/utils/validations/userValidation";
import { validateCityAdd } from "../../../src/utils/validations/cityValidation";

describe("Validation utilities", () => {
    describe("User Validations", () => {
        it("should validate a correct registration data", () => {
            const data = {
                email: "test@example.com",
                username: "testuser",
                password: "Password123"
            };
            const result = validateRegister(data);
            expect(result.error).toBeUndefined();
        });

        it("should fail registration with invalid email", () => {
            const data = {
                email: "invalid-email",
                username: "testuser",
                password: "Password123"
            };
            const result = validateRegister(data);
            expect(result.error).toBeDefined();
        });

        it("should validate a correct login data", () => {
            const data = {
                email: "test@example.com",
                password: "Password123"
            };
            const result = validateLogin(data);
            expect(result.error).toBeUndefined();
        });
    });

    describe("City Validations", () => {
        it("should validate a correct city data", () => {
            const data = {
                name: "London",
                country: "United Kingdom",
                latitude: 51.5,
                longitude: -0.1
            };
            const result = validateCityAdd(data);
            expect(result.error).toBeUndefined();
        });

        it("should fail city with missing name", () => {
             const data = {
                country: "United Kingdom",
                latitude: 51.5,
                longitude: -0.1
            } as Parameters<typeof validateCityAdd>[0];
            const result = validateCityAdd(data);
            expect(result.error).toBeDefined();
        });

        it("should fail city with invalid coordinates", () => {
             const data = {
                name: "London",
                country: "United Kingdom",
                latitude: 200,
                longitude: -0.1
            }
            const result = validateCityAdd(data);
            expect(result.error).toBeDefined();
        });
    });
});
