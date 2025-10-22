import axios from "axios";
import {notify} from "@/utils/notify.js";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (r) => r,
    (err) => {
        console.log(err);
        notify('error', err?.response?.data?.message);
        return Promise.reject(err);
    }
);
