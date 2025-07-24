import express from "express";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import karaokeRoutes from "./routes/karaoke.route.js";
import n64Routes from "./routes/n64.route.js";
import adminRoutes from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
dotenv.config({});

const app = express();

// Default middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.31.163:5173"],
    credentials: true,
  })
);

app.use(cookieParser());

//apis
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/karaoke-rooms", karaokeRoutes);
app.use("/api/v1/n64-rooms", n64Routes);
app.use("/api/v1/admin", adminRoutes);

// call the connectDB function
connectDB();
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
