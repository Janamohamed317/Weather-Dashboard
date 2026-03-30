import { dbConnection } from "./config/dbConnection";
import express from "express";
import authPath from "./routes/authRoute";
import weatherPath from "./routes/weatherRoute";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import favoritesPath from "./routes/favoritesRoute";
import { authLimiter, globalLimiter } from "./middlewares/rateLimiter";
import { notFoundURL } from "./middlewares/notFoundAPI";

const app = express();

app.use(helmet());

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(globalLimiter);

app.use(express.json());

app.use('/api/favorites', favoritesPath);
app.use('/api/auth', authLimiter, authPath);
app.use('/api/weather', weatherPath);

app.use(notFoundURL)

app.use(errorHandler)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    dbConnection();
    console.log(`Server is running on port ${PORT}`);
});

export default app;