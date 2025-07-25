import express from "express";
import authenticateAdmin from "../middlewares/authenticateAdmin.js";

// Import sub-routes
import adminKaraokeRoutes from "./admin/karaoke.route.js";
import adminN64Routes from "./admin/n64.route.js";
import adminCafeRoutes from "./admin/cafe.route.js";

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Mount service-specific admin routes
router.use("/karaoke", adminKaraokeRoutes);
router.use("/n64", adminN64Routes);
router.use("/cafe", adminCafeRoutes);

export default router;
