import { NextFunction, Response } from "express";
import { AuthRequest, JwtPayload } from "../types/AuthRequest";
import { UnauthorizedError } from "../utils/error";
import jwt from "jsonwebtoken";

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("No token provided, please login first");
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined");
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload
    if (!decodedToken.id) {
        throw new UnauthorizedError("Invalid token payload");
    }

    req.user = { id: decodedToken.id }

    next()
}