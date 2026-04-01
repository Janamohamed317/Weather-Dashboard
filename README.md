# Weather Dashboard Backend 🌦️

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

This is the backend service for the Weather Dashboard application. It enables users to create accounts, retrieve current weather conditions and forecasts for any location, and manage a personalized list of favorite cities. 

The application is built with Node.js and TypeScript. It utilizes MongoDB for secure data storage and Redis for caching weather data to optimize response times.

## Core Features
- **User Authentication:** Secure account creation and login processes using JWT.
- **Weather Search:** Retrieve current weather conditions and a 7-day forecast by searching for a city name.
- **Location Based Weather:** Receive precise weather data based on geographic coordinates.
- **Performance Optimization:** Weather API responses are temporarily cached in Redis to reduce latency and improve load times.
- **Favorites Management:** Authenticated users can build and maintain a list of favorite locations.

## Technology Stack
The project relies on the following technologies:
- **Node.js & Express** - Core server infrastructure
- **TypeScript** - Static typing for improved code quality and maintainability
- **MongoDB & Mongoose** - Document database for user and favorites storage
- **Redis** - In-memory data store for API caching
- **Jest & Supertest** - Testing framework for automated integration tests

## Local Development Setup

To run the application locally, follow the steps below.

### 1. Clone the repository
Clone this project to your local machine and navigate into the directory:
```bash
git clone https://github.com/Janamohamed317/Weather-Dashboard-Backend.git
cd Weather-Dashboard-Backend
```

### 2. Install dependencies
Install the required Node packages:
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory and add your configuration settings. Please use the following template:
```env
# Server settings
PORT=5000
NODE_ENV=development

# Database connection (MongoDB)
MONGO_URI=mongodb://localhost:27017/weather_dashboard
MONGO_TEST_URI=mongodb://localhost:27017/weather_dashboard_test

# Redis Connection
REDIS_URL=redis://localhost:6379

# Security Config 
JWT_SECRET=your_super_secret_jwt_string
JWT_EXPIRES_IN=1d
```
*(Note: Please ensure that MongoDB and Redis are actively running on your machine prior to starting the server.)*

### 4. Start the server
To start the server in development mode with automatic restarts on file changes:
```bash
npm run dev
```

To compile the TypeScript code and run the production build:
```bash
npm run build
npm start
```

## Running the Test Suite
Automated integration and unit tests are provided to verify the application's functionality. Ensure that your `MONGO_TEST_URI` and `REDIS_URL` are correctly configured in your `.env` file, then run:

```bash
# Run both unit and integration tests
npm run test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## API Routes

Below are the primary endpoints available in the API.

### Authentication
- **POST** `/api/auth/signup` - Register a new user account
- **POST** `/api/auth/signin` - Authenticate a user and receive a JWT

### Weather
- **GET** `/api/weather/city-weather/search?name={cityName}` - Retrieve weather data by city name
- **GET** `/api/weather/city-weather/coordinates?lat={lat}&lng={lng}` - Retrieve weather data using latitude and longitude

### Favorites (Protected 🔒)
*Include the user's JWT in the `Authorization: Bearer <token>` header.*
- **GET** `/api/favorites/` - Retrieve all saved cities
- **POST** `/api/favorites/mark/city` - Add a new city to the favorites list
- **DELETE** `/api/favorites/remove/:id` - Delete a city from the favorites list using its ID

## Project Structure
The source code is organized as follows:
```text
src/
├── config/        # Database and cache connection configurations
├── controllers/   # Request handling logic for API routes
├── middlewares/   # Authentication verification and error handling
├── models/        # Database schemas for Users and Cities
├── routes/        # API endpoint definitions
├── services/      # Business logic and external API integrations
├── types/         # TypeScript interface definitions
├── utils/         # Helper functions and utilities
├── app.ts         # Express application setup
└── server.ts      # Main server entry point

tests/
├── integration/   # Automated API integration tests
├── unit/          # Isolated unit tests for services and utils
└── setup.ts       # Test environment configuration
```
