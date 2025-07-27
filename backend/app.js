import express from "express";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import karaokeRoutes from "./routes/karaoke.route.js";
import n64Routes from "./routes/n64.route.js";
import adminRoutes from "./routes/admin.route.js";
import cafeRoutes from "./routes/cafe.route.js";
import paymentRoutes from "./routes/payment.route.js";
import cookieParser from "cookie-parser";
dotenv.config({});

const app = express();

// Get environment-specific configuration
const getConfig = () => {
  const environment = process.env.SQUARE_ENVIRONMENT || "sandbox";
  const isProduction = environment === "production";

  return {
    corsOrigins: isProduction
      ? ["https://8bitbar.com.au", "https://www.8bitbar.com.au"] // Production origins
      : ["http://localhost:5173", "http://192.168.31.163:5173"], // Development origins
    port: process.env.PORT || 3000,
  };
};

const config = getConfig();

// Default middlewares
app.use(express.json());
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);

app.use(cookieParser());

//apis
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/karaoke-rooms", karaokeRoutes);
app.use("/api/v1/n64-rooms", n64Routes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/cafe", cafeRoutes);
app.use("/api/v1/payments", paymentRoutes);

// call the connectDB function
connectDB();
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Environment: ${process.env.SQUARE_ENVIRONMENT || "sandbox"}`);
  console.log(`CORS Origins: ${config.corsOrigins.join(", ")}`);
});
