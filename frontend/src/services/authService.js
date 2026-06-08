import apiClient from "../api/axios";

const unwrap = (response) => response.data;

export const registerUser = async (payload) => {
  const response = await apiClient.post("/api/v1/users/register", payload);
  return unwrap(response);
};

export const loginUser = async (payload) => {
  const response = await apiClient.post("/api/v1/users/login", payload);
  return unwrap(response);
};

export const logoutUser = async () => {
  const response = await apiClient.post("/api/v1/users/logout");
  return unwrap(response);
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/api/v1/users/current-user");
  return unwrap(response);
};

export const updateCurrentUser = async (payload) => {
  const response = await apiClient.patch("/api/v1/users/current-user", payload);
  return unwrap(response);
};

export const deleteCurrentUser = async () => {
  const response = await apiClient.delete("/api/v1/users/current-user");
  return unwrap(response);
};

export const changePassword = async (payload) => {
  const response = await apiClient.post("/api/v1/users/change-password", payload);
  return unwrap(response);
};
