import mongoose from "mongoose";

const n64BookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "N64Room",
      required: true,
    },
    roomType: {
      type: String,
      enum: ["mickey", "minnie"],
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    durationHours: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Duration must be an integer (in hours)",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Price must be non-negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("N64Booking", n64BookingSchema);
