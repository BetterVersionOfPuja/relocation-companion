import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { SavedComparison } from "../models/savedComparison.model.js";

const cleanCityName = (value) => String(value || "").trim();

const createSavedComparison = asyncHandler(async (req, res) => {
  const originCity = cleanCityName(req.body.originCity);
  const destinationCity = cleanCityName(req.body.destinationCity);

  if (!originCity || !destinationCity) {
    throw new ApiError(400, "Origin city and destination city are required");
  }

  if (originCity.toLowerCase() === destinationCity.toLowerCase()) {
    throw new ApiError(400, "Please save two different cities");
  }

  const savedComparison = await SavedComparison.findOneAndUpdate(
    {
      userId: req.user._id,
      originCity,
      destinationCity,
    },
    {
      $setOnInsert: {
        userId: req.user._id,
        originCity,
        destinationCity,
        createdAt: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, savedComparison, "Saved comparison stored successfully"));
});

const getSavedComparisons = asyncHandler(async (req, res) => {
  const savedComparisons = await SavedComparison.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, savedComparisons, "Saved comparisons fetched successfully"));
});

const deleteSavedComparison = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(400, "Invalid saved comparison ID");
  }

  const savedComparison = await SavedComparison.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!savedComparison) {
    throw new ApiError(404, "Saved comparison not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, savedComparison, "Saved comparison deleted successfully"));
});

export { createSavedComparison, getSavedComparisons, deleteSavedComparison };
