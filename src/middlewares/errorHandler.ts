import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/error"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        })
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: err.message,
        })
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format",
        })
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    console.error("Unexpected error:", err)
    return res.status(500).json({
        message: "Internal server error",
    })
}