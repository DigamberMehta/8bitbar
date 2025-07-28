import mongoose from "mongoose";
import CafeLayout from "../models/CafeLayout.js";
import dotenv from "dotenv";

dotenv.config();

const migrateToTemplates = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all existing layouts without templateName
    const existingLayouts = await CafeLayout.find({
      templateName: { $exists: false },
    });

    console.log(`Found ${existingLayouts.length} layouts to migrate`);

    for (const layout of existingLayouts) {
      // Update the layout to have "Template 1" as the default template name
      await CafeLayout.findByIdAndUpdate(layout._id, {
        templateName: "Template 1",
        isActive: true,
      });

      console.log(`Migrated layout ${layout._id} to Template 1`);
    }

    // Create a default template if no layouts exist
    const templateCount = await CafeLayout.countDocuments();
    if (templateCount === 0) {
      console.log("No layouts found, creating default template...");

      const defaultLayout = new CafeLayout({
        templateName: "Template 1",
        chairs: [
          { id: "c1", x: 170, y: 170, width: 32, height: 32, color: "#A0522D" },
          { id: "c2", x: 230, y: 170, width: 32, height: 32, color: "#A0522D" },
          { id: "c3", x: 170, y: 230, width: 32, height: 32, color: "#A0522D" },
          { id: "c4", x: 230, y: 230, width: 32, height: 32, color: "#A0522D" },
        ],
        tables: [
          {
            id: "t1",
            type: "round-table",
            x: 200,
            y: 200,
            radius: 40,
            color: "#228B22",
          },
          {
            id: "t2",
            type: "round-table",
            x: 400,
            y: 300,
            radius: 40,
            color: "#228B22",
          },
        ],
        bgImageUrl:
          "https://8bitbar.com.au/wp-content/uploads/2025/06/map-layout-0-resturant-scaled.jpg",
        canvasWidth: 1000,
        canvasHeight: 2400,
        deviceType: "desktop",
        changeType: "added",
        isActive: true,
      });

      await defaultLayout.save();
      console.log("Created default Template 1 for desktop");

      // Create mobile template
      const mobileLayout = new CafeLayout({
        templateName: "Template 1",
        chairs: [
          { id: "c1", x: 120, y: 120, width: 28, height: 28, color: "#A0522D" },
          { id: "c2", x: 160, y: 120, width: 28, height: 28, color: "#A0522D" },
        ],
        tables: [
          {
            id: "t1",
            type: "round-table",
            x: 140,
            y: 140,
            radius: 36,
            color: "#228B22",
          },
        ],
        bgImageUrl:
          "https://8bitbar.com.au/wp-content/uploads/2025/06/map-layout-0-resturant-scaled.jpg",
        canvasWidth: 450,
        canvasHeight: 2400,
        deviceType: "mobile",
        changeType: "added",
        isActive: true,
      });

      await mobileLayout.save();
      console.log("Created default Template 1 for mobile");
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the migration
migrateToTemplates();
