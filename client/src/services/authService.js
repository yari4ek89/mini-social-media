// Import neccessary library
import { api } from "./api.js"; // import api
import { toast } from "react-toastify";

// Export arrow function registerUser with payload
export const registerUser = async (payload) => {
  const { data } = await api.post("/api/auth/register", payload); // make POST request with payload to register
  return data;
};

// Export arrow function loginUser with payload
export const loginUser = async (payload) => {
  try {
    const { data } = await api.post("/api/auth/login", payload); // make POST request with payload to login
    if (data.status === "success") {
      toast.success(data.status, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return await data;
    }
  } catch (err) {
    toast.error(err.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

// Export arrow function logoutUser
export const logoutUser = async () => {
  const { data } = await api.post("/api/auth/logout"); // make POST request to log out
  return data;
};

// Export arrow function me
export const me = async () => {
  try {
    const { data } = await api.get("api/auth/me"); // make GET request to check log in user or not
    return await data;
  } catch {}
};

// Export arrow function checkUsername with username param
export const checkUsername = async (username) => {
  const { data } = await api.get(
    `/api/auth/check-username?u=${encodeURIComponent(username)}`
  ); // make GET request to check busy username or not
  return data;
};
