import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/models/UserModel";

describe("Auth Integration Tests", () => {
    const testUser = {
        email: "test@example.com",
        username: "testuser",
        password: "Password123!"
    };

    afterEach(async () => {
        await User.deleteMany({ email: testUser.email });
    });

    it("should signup a new user successfully", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("userId");
        expect(response.body.message).toBe("Signed Up Successfully");

        const user = await User.findOne({ email: testUser.email });
        expect(user).toBeTruthy();
        expect(user?.username).toBe(testUser.username);
    });

    it("should not signup with existing email", async () => {
        await request(app).post("/api/auth/signup").send(testUser);

        const response = await request(app)
            .post("/api/auth/signup")
            .send(testUser);

        expect(response.status).toBe(409);
        expect(response.body.message).toMatch(/Email is already registered/i);
    });

    it("should signin successfully with valid credentials", async () => {
        await request(app).post("/api/auth/signup").send(testUser);

        const response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body.message).toBe("Logged In Successfully");
    });

    it("should not signin with invalid credentials", async () => {
        await request(app).post("/api/auth/signup").send(testUser);

        const response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: testUser.email,
                password: "WrongPassword123!"
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Invalid email or password/i);
    });
});
