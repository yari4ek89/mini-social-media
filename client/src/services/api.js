// Import neccessary library
import axios from "axios"; // axios
import { toast } from "react-toastify";

// Export api
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// To make requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// To make responses
api.interceptors.response.use(
  (r) => r,
  (err) => {
    return Promise.reject(err);
  }
);
