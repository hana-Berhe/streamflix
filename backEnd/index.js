// Loads .env before anything else.
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { db } from "./schema/db.config.js";
import { mainRouter } from "./src/mainRoutes.js";
import { errorHandler, notFound } from "./src/middleware/error-handler.js";
import { parseCorsOrigins } from "./src/utility/corsOrigins.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

const app = express();

// The app runs behind Render's proxy. This makes req.ip the visitor's
// real IP, which the login rate limit depends on.
app.set("trust proxy", 1);

// middleware
app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: parseCorsOrigins(process.env.CLIENT_ORIGIN || "http://localhost:5173"),
    credentials: true,
  }),
);

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Main api
app.use("/api", mainRouter);

// error handler middleware should be after all api calls
app.use(notFound);
app.use(errorHandler);

// connection and server configuration
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log("Connected to database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      if (!process.env.GEMINI_API_KEY) {
        console.log("No GEMINI_API_KEY, AI picks will use the fallback");
      }
    });
  } catch (error) {
    console.error("Database connection failed. Server not started:", error.message);
    process.exit(1);
  }
}

startServer();
