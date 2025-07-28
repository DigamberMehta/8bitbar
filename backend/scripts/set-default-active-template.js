import mongoose from "mongoose";
import CafeLayout from "../models/CafeLayout.js";
import dotenv from "dotenv";

dotenv.config();

const setDefaultActiveTemplate = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Set the first template as active for booking for each device type
    const deviceTypes = ["desktop", "mobile"];

    for (const deviceType of deviceTypes) {
      // Find the first active template for this device type
      const firstTemplate = await CafeLayout.findOne({
        deviceType,
        isActive: true,
      }).sort({ createdAt: 1 });

      if (firstTemplate) {
        // Deactivate all templates for booking first
        await CafeLayout.updateMany(
          { deviceType, isActive: true },
          { isActiveForBooking: false }
        );

        // Set the first template as active for booking
        await CafeLayout.findByIdAndUpdate(firstTemplate._id, {
          isActiveForBooking: true,
        });

        console.log(
          `Set ${firstTemplate.templateName} as active for booking for ${deviceType}`
        );
      } else {
        console.log(`No templates found for ${deviceType}`);
      }
    }

    console.log("Default active templates set successfully!");
  } catch (error) {
    console.error("Error setting default active template:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
setDefaultActiveTemplate();
