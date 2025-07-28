import mongoose from "mongoose";
import CafeLayout from "../models/CafeLayout.js";
import dotenv from "dotenv";

dotenv.config();

const createMobileTemplate = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create mobile template
    const mobileLayout = new CafeLayout({
      templateName: "Template 1",
      chairs: [
        { id: "c1", x: 120, y: 120, width: 28, height: 28, color: "#A0522D" },
        { id: "c2", x: 160, y: 120, width: 28, height: 28, color: "#A0522D" },
        { id: "c3", x: 120, y: 160, width: 28, height: 28, color: "#A0522D" },
        { id: "c4", x: 160, y: 160, width: 28, height: 28, color: "#A0522D" },
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
        {
          id: "t2",
          type: "round-table",
          x: 240,
          y: 200,
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
      isActiveForBooking: true,
    });

    await mobileLayout.save();
    console.log("Created mobile Template 1 and set as active for booking");

    console.log("Mobile template created successfully!");
  } catch (error) {
    console.error("Error creating mobile template:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
createMobileTemplate();
