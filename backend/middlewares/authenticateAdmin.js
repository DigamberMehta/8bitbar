import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authenticateAdmin = async (req, res, next) => {
  try {
    const cookieToken = req.cookies.token;
    const headerToken = req.header("Authorization")?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    // Debug logging for production issues
    console.log("Admin auth debug:", {
      hasCookieToken: !!cookieToken,
      hasHeaderToken: !!headerToken,
      userAgent: req.get("User-Agent"),
      origin: req.get("Origin"),
    });

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    req.userId = decoded.id;
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

export default authenticateAdmin;
