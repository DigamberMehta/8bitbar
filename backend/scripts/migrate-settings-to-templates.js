import mongoose from "mongoose";
import CafeSettings from "../models/CafeSettings.js";
import CafeLayout from "../models/CafeLayout.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/8bitbar";

async function migrateSettingsToTemplates() {
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

    // Get existing settings (old single settings)
    const existingSettings = await CafeSettings.findOne({
      templateName: { $exists: false },
    });

    if (existingSettings) {
      console.log(
        "Found existing single settings, migrating to template-specific settings..."
      );

      // Create settings for each template using the existing settings as base
      for (const templateName of templateNames) {
        const templateSettings = await CafeSettings.findOne({ templateName });

        if (!templateSettings) {
          await CafeSettings.create({
            templateName,
            timeSlots: existingSettings.timeSlots,
            pricePerChairPerHour: existingSettings.pricePerChairPerHour,
            maxDuration: existingSettings.maxDuration,
            openingTime: existingSettings.openingTime,
            closingTime: existingSettings.closingTime,
            updatedBy: existingSettings.updatedBy,
          });
          console.log(`Created settings for template: ${templateName}`);
        } else {
          console.log(`Settings already exist for template: ${templateName}`);
        }
      }

      // Remove the old single settings
      await CafeSettings.deleteOne({ templateName: { $exists: false } });
      console.log("Removed old single settings");
    } else {
      console.log(
        "No existing single settings found, creating default settings for each template..."
      );

      // Create default settings for each template
      for (const templateName of templateNames) {
        const templateSettings = await CafeSettings.findOne({ templateName });

        if (!templateSettings) {
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
          console.log(`Created default settings for template: ${templateName}`);
        } else {
          console.log(`Settings already exist for template: ${templateName}`);
        }
      }
    }

    console.log("Migration completed successfully!");

    // Display final state
    const allSettings = await CafeSettings.find().sort({ templateName: 1 });
    console.log("\nFinal settings state:");
    allSettings.forEach((setting) => {
      console.log(
        `- ${setting.templateName}: $${setting.pricePerChairPerHour}/hour, ${setting.timeSlots.length} time slots`
      );
    });
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

migrateSettingsToTemplates();
