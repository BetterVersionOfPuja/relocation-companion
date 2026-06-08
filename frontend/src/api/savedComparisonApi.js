import apiClient from "./axios";

export const fetchSavedComparisons = async () => {
  const response = await apiClient.get("/api/v1/saved-comparisons");
  return response.data.data;
};

export const saveComparison = async ({ originCity, destinationCity }) => {
  const response = await apiClient.post("/api/v1/saved-comparisons", {
    originCity,
    destinationCity,
  });
  return response.data.data;
};

export const deleteSavedComparison = async (id) => {
  const response = await apiClient.delete(`/api/v1/saved-comparisons/${id}`);
  return response.data.data;
};
