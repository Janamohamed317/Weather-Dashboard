import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: {
        status: 429,
        message: "Too many requests, please wait 60 seconds before trying again."
    },
});

export const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    },
});