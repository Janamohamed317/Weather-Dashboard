import { Request } from "express";

export interface AuthRequest<P = Record<string, string>, ResBody = unknown, ReqBody = unknown, ReqQuery = Record<string, string | undefined>> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: {
        id: string,
    }
}

export interface JwtPayload {
    id: string;
}