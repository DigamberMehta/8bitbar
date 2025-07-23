import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date }, // Added date of birth
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create the model
const User = mongoose.model("User", userSchema);

// Export the model
export default User;
