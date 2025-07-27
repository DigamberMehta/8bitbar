import express from "express";
import authenticateAdmin from "../../middlewares/authenticateAdmin.js";
import CafeBooking from "../../models/CafeBooking.js";
import CafeLayout from "../../models/CafeLayout.js";
import CafeSettings from "../../models/CafeSettings.js";

const router = express.Router();

router.use(authenticateAdmin);

// Dashboard stats endpoints
router.get("/cafe-bookings/count", async (req, res) => {
  try {
    const count = await CafeBooking.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cafe bookings count" });
  }
});

router.get("/cafe-bookings/revenue", async (req, res) => {
  try {
    const revenue = await CafeBooking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalCost" } } },
    ]);
    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;
    res.json({ revenue: totalRevenue });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cafe bookings revenue" });
  }
});

// Cafe Bookings Management
router.get("/cafe-bookings", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};

    const bookings = await CafeBooking.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching cafe bookings:", error);
    res.status(500).json({ message: "Error fetching cafe bookings" });
  }
});

router.patch("/cafe-bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await CafeBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "name email");
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status" });
  }
});

// Cafe Layout Management
router.get("/cafe-layout", async (req, res) => {
  try {
    const deviceType = req.query.deviceType || "desktop";
    const layout = await CafeLayout.findOne({ deviceType }).sort({
      updatedAt: -1,
    });
    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cafe layout" });
  }
});

router.put("/cafe-layout", async (req, res) => {
  try {
    const {
      chairs,
      tables,
      changeType,
      bgImageUrl,
      canvasWidth,
      canvasHeight,
      deviceType,
    } = req.body;
    // Find and update existing layout or create new one
    const layout = await CafeLayout.findOneAndUpdate(
      { deviceType: deviceType || "desktop" },
      {
        chairs,
        tables,
        bgImageUrl,
        canvasWidth,
        canvasHeight,
        updatedBy: req.userId,
        changeType: changeType || "updated",
      },
      {
        new: true,
        upsert: true, // Create if doesn't exist
        runValidators: true,
      }
    );
    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: "Error updating cafe layout" });
  }
});

// Add a chair or table
router.post("/cafe-layout/item", async (req, res) => {
  try {
    const { item, itemType } = req.body; // itemType: 'chair' or 'table'
    const lastLayout = await CafeLayout.findOne().sort({ updatedAt: -1 });
    let newChairs = lastLayout ? [...lastLayout.chairs] : [];
    let newTables = lastLayout ? [...lastLayout.tables] : [];
    if (itemType === "chair") newChairs.push(item);
    else if (itemType === "table") newTables.push(item);
    const layout = await CafeLayout.create({
      chairs: newChairs,
      tables: newTables,
      updatedBy: req.userId,
      changeType: "added",
    });
    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cafe layout" });
  }
});

// Remove a chair or table
router.delete("/cafe-layout/item/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { itemType } = req.query; // 'chair' or 'table'
    const lastLayout = await CafeLayout.findOne().sort({ updatedAt: -1 });
    let newChairs = lastLayout
      ? lastLayout.chairs.filter((c) => c.id !== itemId)
      : [];
    let newTables = lastLayout
      ? lastLayout.tables.filter((t) => t.id !== itemId)
      : [];
    const layout = await CafeLayout.create({
      chairs: itemType === "chair" ? newChairs : lastLayout.chairs,
      tables: itemType === "table" ? newTables : lastLayout.tables,
      updatedBy: req.userId,
      changeType: "removed",
    });
    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cafe layout" });
  }
});

// Cafe Settings Management
router.get("/cafe-settings", async (req, res) => {
  try {
    let settings = await CafeSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await CafeSettings.create({
        timeSlots: [
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
        ],
        pricePerChairPerHour: 10,
        maxDuration: 8,
        openingTime: "14:00",
        closingTime: "23:00",
        updatedBy: req.userId,
      });
    }

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cafe settings" });
  }
});

router.put("/cafe-settings", async (req, res) => {
  try {
    const {
      timeSlots,
      pricePerChairPerHour,
      maxDuration,
      openingTime,
      closingTime,
    } = req.body;

    const settings = await CafeSettings.findOneAndUpdate(
      {},
      {
        timeSlots,
        pricePerChairPerHour,
        maxDuration,
        openingTime,
        closingTime,
        updatedBy: req.userId,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Error updating cafe settings" });
  }
});

export default router;
