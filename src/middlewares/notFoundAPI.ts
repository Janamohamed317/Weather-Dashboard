import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../utils/error";

export const notFoundURL = ((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`${req.originalUrl} not found`));
});