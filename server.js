import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dbConnect from "./db/dbConnect.js";
import Routes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.md.js";
import {apiLimiter} from './middlewares/rateLimiter.md.js'

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to Database
dbConnect();

// API Routes
app.use("/api/v1", Routes);

// Error Handling Middleware
app.use(errorHandler);
// Rate Limiting
app.use("/api", apiLimiter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



export default app
