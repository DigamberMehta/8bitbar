import mongoose from "mongoose";
import CafeLayout from "../models/CafeLayout.js";
import CafeSettings from "../models/CafeSettings.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/8bitbar";

async function setupCafeSettings() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get all unique template names from CafeLayout
    const layouts = await CafeLayout.find({ isActive: true });
    const templateNames = [
      ...new Set(layouts.map((layout) => layout.templateName)),
    ];

    console.log(`Found ${templateNames.length} templates:`, templateNames);

    // Create settings for each template
    for (const templateName of templateNames) {
      const existingSettings = await CafeSettings.findOne({ templateName });

      if (!existingSettings) {
        await CafeSettings.create({
          templateName,
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
        });
        console.log(`Created settings for template: ${templateName}`);
      } else {
        console.log(`Settings already exist for template: ${templateName}`);
      }
    }

    // Set the first template as active for booking if none is set
    const activeLayout = await CafeLayout.findOne({ isActiveForBooking: true });
    if (!activeLayout) {
      await CafeLayout.updateMany(
        { templateName: "Template 1", isActive: true },
        { isActiveForBooking: true }
      );
      console.log("Set Template 1 as active for booking");
    }

    console.log("Setup completed successfully!");

    // Display final state
    const allSettings = await CafeSettings.find().sort({ templateName: 1 });
    console.log("\nFinal settings state:");
    allSettings.forEach((setting) => {
      console.log(
        `- ${setting.templateName}: $${setting.pricePerChairPerHour}/hour, ${setting.timeSlots.length} time slots`
      );
    });
  } catch (error) {
    console.error("Setup failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

setupCafeSettings();
