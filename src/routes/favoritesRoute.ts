import express from "express"
import { getFavCities, markFavCity, unmarkFavCity } from "../controllers/favCityController";
import { verifyToken } from "../middlewares/authMiddleware";


const router = express.Router()

router.get("/", verifyToken, getFavCities)

router.post("/mark/city", verifyToken, markFavCity)

router.delete("/remove/:id", verifyToken, unmarkFavCity)

export default router;