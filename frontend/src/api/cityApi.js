import apiClient from "./axios";

// Fetches only name, country, slug — used to populate dropdowns
export const fetchCityList = async () => {
  const response = await apiClient.get("/api/v1/cities");
  return response.data.data; // the actual array lives inside .data.data
};

// Fetches full comparison data for two cities by their slugs
export const fetchComparison = async (slug1, slug2) => {
  const response = await apiClient.get("/api/v1/cities/compare", {
    params: {
      city1: slug1,
      city2: slug2,
    },
  });
  return response.data.data; // { cityOne, cityTwo, diff }
};
