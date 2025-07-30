import mongoose from "mongoose";
import CafeSettings from "../models/CafeSettings.js";

const updateCafeWeekDays = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/8bitbar");
    console.log("Connected to MongoDB");

    // Find all cafe settings that don't have weekDays field
    const settings = await CafeSettings.find({ weekDays: { $exists: false } });
    console.log(`Found ${settings.length} cafe settings to update`);

    if (settings.length === 0) {
      console.log(
        "No settings need updating. All cafe settings already have weekDays field."
      );
      return;
    }

    // Update each setting with default weekDays
    const defaultWeekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    for (const setting of settings) {
      await CafeSettings.findByIdAndUpdate(
        setting._id,
        { weekDays: defaultWeekDays },
        { new: true }
      );
      console.log(`Updated cafe setting: ${setting.templateName}`);
    }

    console.log("Successfully updated all cafe settings with weekDays field");

    // Verify the updates
    const updatedSettings = await CafeSettings.find();
    console.log("\nUpdated cafe settings:");
    updatedSettings.forEach((setting) => {
      console.log(
        `- ${setting.templateName}: ${
          setting.weekDays?.length || 0
        } days available`
      );
    });
  } catch (error) {
    console.error("Error updating cafe settings:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
updateCafeWeekDays();
