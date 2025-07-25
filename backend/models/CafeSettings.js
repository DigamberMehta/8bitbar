import mongoose from "mongoose";

const cafeSettingsSchema = new mongoose.Schema(
  {
    timeSlots: {
      type: [String],
      default: [
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
      required: true,
    },
    pricePerChairPerHour: {
      type: Number,
      default: 10,
      required: true,
    },
    maxDuration: {
      type: Number,
      default: 8,
      required: true,
    },
    openingTime: {
      type: String,
      default: "14:00",
      required: true,
    },
    closingTime: {
      type: String,
      default: "23:00",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
cafeSettingsSchema.index({}, { unique: true });

export default mongoose.model("CafeSettings", cafeSettingsSchema);
