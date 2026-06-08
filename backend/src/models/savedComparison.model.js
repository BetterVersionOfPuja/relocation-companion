import mongoose, { Schema } from "mongoose";

const savedComparisonSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  originCity: {
    type: String,
    required: true,
    trim: true,
  },
  destinationCity: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

savedComparisonSchema.index(
  { userId: 1, originCity: 1, destinationCity: 1 },
  { unique: true }
);

export const SavedComparison = mongoose.model("SavedComparison", savedComparisonSchema);
