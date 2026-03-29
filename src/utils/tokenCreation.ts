import jwt from "jsonwebtoken"

export const tokenCreation = (id: string) => {
    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined in environment variables");
    }
    const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "7d" })
    return token
}