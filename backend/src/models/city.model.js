import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    // --- Identity Fields ---
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // --- Cost Fields (USD) ---
    rentMonthly: {
      type: Number,
      default: 0,
    },
    mealCheap: {
      type: Number,
      default: 0,
    },
    groceriesMonthly: {
      type: Number,
      default: 0,
    },
    transport: {
      type: Number,
      default: 0,
    },

    // --- Quality Fields ---
    qualityOfLife: {
      type: Number,
      default: 0,
    },
    safetyIndex: {
      type: Number,
      default: 0,
    },
    healthcareIndex: {
      type: Number,
      default: 0,
    },
    pollutionIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const City = mongoose.model("City", citySchema);