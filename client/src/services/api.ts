import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("avh_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 -> clear session
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("avh_token");
      localStorage.removeItem("avh_user");
    }
    return Promise.reject(error);
  }
);

export default api;
