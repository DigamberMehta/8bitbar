import mongoose from "mongoose";
import CafeSettings from "../models/CafeSettings.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/8bitbar";

async function addTemplate2() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create Template 2 settings with different pricing
    await CafeSettings.create({
      templateName: "Template 2",
      timeSlots: [
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
      ],
      pricePerChairPerHour: 15,
      maxDuration: 6,
      openingTime: "15:00",
      closingTime: "22:00",
    });
    console.log("Created Template 2 settings with $15/hour pricing");

    // Display all settings
    const settings = await CafeSettings.find().sort({ templateName: 1 });
    console.log("\nAll settings:");
    settings.forEach((setting) => {
      console.log(
        `- ${setting.templateName}: $${setting.pricePerChairPerHour}/hour, ${setting.timeSlots.length} time slots, ${setting.openingTime}-${setting.closingTime}`
      );
    });
  } catch (error) {
    console.error("Failed to add Template 2:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

addTemplate2();
