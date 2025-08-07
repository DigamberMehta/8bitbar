import express from "express";
import authenticateAdmin from "../middlewares/authenticateAdmin.js";

// Import sub-routes
import adminKaraokeRoutes from "./admin/karaoke.route.js";
import adminN64Routes from "./admin/n64.route.js";
import adminCafeRoutes from "./admin/cafe.route.js";
import adminUserRoutes from "./admin/user.route.js";
import adminBookingRoutes from "./admin/booking.route.js";
import adminFinanceRoutes from "./admin/finance.route.js";
import adminAllBookingsRoutes from "./admin/all-bookings.route.js";

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Mount service-specific admin routes at unique paths
router.use("/karaoke", adminKaraokeRoutes);
router.use("/n64", adminN64Routes);
router.use("/cafe", adminCafeRoutes);
router.use("/users", adminUserRoutes);
router.use("/bookings", adminBookingRoutes);
router.use("/finance", adminFinanceRoutes);
router.use("/all-bookings", adminAllBookingsRoutes);

export default router;
