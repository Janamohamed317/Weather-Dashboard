import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/models/UserModel";
import { CityModel } from "../../src/models/CityModel";

describe("Favorites Integration Tests", () => {
    let token: string;

    const testUser = {
        email: "favtest@example.com",
        username: "favuser",
        password: "Password123!"
    };

    const testCity = {
        name: "Cairo",
        country: "Egypt",
        latitude: 30.0626,
        longitude: 31.2497
    };

    beforeEach(async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send(testUser);
        token = response.body.token;
    });

    afterEach(async () => {
        await User.deleteMany({ email: testUser.email });
        await CityModel.deleteMany({ name: testCity.name });
    });

    it("should mark a city as favorite successfully", async () => {
        const response = await request(app)
            .post("/api/favorites/mark/city")
            .set("Authorization", `Bearer ${token}`)
            .send(testCity);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("City added to favorites");
        expect(response.body.data.name).toBe(testCity.name);
    });

    it("should fetch user favorite cities", async () => {
        await request(app)
            .post("/api/favorites/mark/city")
            .set("Authorization", `Bearer ${token}`)
            .send(testCity);

        const response = await request(app)
            .get("/api/favorites")
            .set("Authorization", `Bearer ${token}`)
            .query({ page: 1 });

        expect(response.status).toBe(200);
        expect(response.body.data.cities).toBeDefined();
        expect(response.body.data.cities.length).toBeGreaterThan(0);
        expect(response.body.data.cities[0].name).toBe(testCity.name);
    });

    it("should remove a city from favorites", async () => {
        const markResponse = await request(app)
            .post("/api/favorites/mark/city")
            .set("Authorization", `Bearer ${token}`)
            .send(testCity);
        
        const cityId = markResponse.body.data._id;

        const response = await request(app)
            .delete(`/api/favorites/remove/${cityId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("City removed from favorites");
    });

    it("should return 401 if token is missing", async () => {
        const response = await request(app)
            .get("/api/favorites");

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/No token provided/i);
    });
});
