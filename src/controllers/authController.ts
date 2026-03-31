import { Request, Response } from "express";
import { UserLogin, UserRegister } from "../types/User";
import { loginService, signupService } from "../services/authServices";
import asyncHandler from "express-async-handler";

export const signup = asyncHandler(async (req: Request<Record<string, never>, Record<string, never>, UserRegister>, res: Response) => {
    const newUser = await signupService(req.body);
    res.status(201).json({ token: newUser.token, userId: newUser.id, message: "Signed Up Successfully" })
});

export const signin = asyncHandler(async (req: Request<Record<string, never>, Record<string, never>, UserLogin>, res: Response) => {
    const user = await loginService(req.body);
    res.status(200).json({ token: user.token, userId: user.id, message: "Logged In Successfully" });
});