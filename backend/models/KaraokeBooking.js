import mongoose from "mongoose";

const karaokeBookingSchema = new mongoose.Schema({
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
  startDateTime: {
    type: Date, // full datetime (includes both date and time)
    required: true,
  },
  endDateTime: {
    type: Date, // full datetime (includes both date and time)
    required: true,
  },
  durationHours: {
    type: Number, // should be a whole number (e.g., 1, 2, 3)
    required: true,
    validate: {
      validator: Number.isInteger,
      message: 'Duration must be an integer (in hours)',
    },
  },
  totalPrice: {
    type: Number, // auto-calculated from duration & room price
    required: true,
    min: [0, 'Price must be non-negative'],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
}, {
  timestamps: true,
});

export default mongoose.model("KaraokeBooking", karaokeBookingSchema);
