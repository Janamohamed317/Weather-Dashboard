import express from "express"
import { getWeatherByCoordinates, getWeatherBySearch } from "../controllers/weatherController";

const router = express.Router()

router.get("/city-weather/search", getWeatherBySearch)

router.get("/city-weather/coordinates", getWeatherByCoordinates)


export default router;