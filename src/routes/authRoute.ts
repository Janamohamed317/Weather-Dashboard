import express from "express"
import { signup, signin, deleteAccount } from "../controllers/authController"
import { verifyToken } from "../middlewares/authMiddleware"


const router = express.Router()

router.post("/signup", signup)

router.post("/signin", signin)

router.delete("/me", verifyToken, deleteAccount);

export default router;