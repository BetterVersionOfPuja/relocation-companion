import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { City } from "../models/city.model.js";

// --- Controller 1: GET /api/cities ---
// Returns only name, country, slug for every city (for dropdown menus)
const getCityList = asyncHandler(async (req, res) => {
  const cities = await City.find()
    .select("name country slug")
    .sort({ name: 1 });

  if (!cities || cities.length === 0) {
    throw new ApiError(404, "No cities found in the database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cities, "City list fetched successfully"));
});

// --- Controller 2: GET /api/cities/compare?city1=bangalore-india&city2=berlin-germany ---
// Fetches both cities in parallel and returns them with cost differences
const compareCities = asyncHandler(async (req, res) => {
  const { city1, city2 } = req.query;

  // Guard 1: both slugs must be present
  if (!city1 || !city2) {
    throw new ApiError(400, "Both city1 and city2 query parameters are required");
  }

  // Guard 2: slugs must not be the same
  if (city1 === city2) {
    throw new ApiError(400, "Please select two different cities to compare");
  }

  // Fetch both cities simultaneously (not one after the other)
  const [cityOne, cityTwo] = await Promise.all([
    City.findOne({ slug: city1 }),
    City.findOne({ slug: city2 }),
  ]);

  // Guard 3: both cities must actually exist in the database
  if (!cityOne || !cityTwo) {
    throw new ApiError(404, "One or both cities were not found");
  }

  // Calculate cost differences (cityOne minus cityTwo)
  // Positive = cityOne is more expensive
  // Negative = cityOne is cheaper
  const diff = {
    rentMonthly:      +(cityOne.rentMonthly      - cityTwo.rentMonthly).toFixed(2),
    mealCheap:        +(cityOne.mealCheap        - cityTwo.mealCheap).toFixed(2),
    groceriesMonthly: +(cityOne.groceriesMonthly - cityTwo.groceriesMonthly).toFixed(2),
    transport:        +(cityOne.transport        - cityTwo.transport).toFixed(2),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { cityOne, cityTwo, diff },
        "Comparison fetched successfully"
      )
    );
});

export { getCityList, compareCities };