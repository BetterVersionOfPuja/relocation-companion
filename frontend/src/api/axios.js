import axios from "axios";

const localApiOrigin =
  typeof window !== "undefined" ? `http://${window.location.hostname}:8000` : "http://localhost:8000";

const API_BASE_URL = import.meta.env.VITE_API_URL || localApiOrigin;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default apiClient;
