import {api} from "./api.js";
import {notify} from "@/utils/notify.js"

export const registerUser = async (payload) => {
    const {data} = await api.post("/api/auth/register", payload);
    if (data.status === 'success') {
        notify('success', "You have been registered successfully!");
    }
    return data;
};

export const loginUser = async (payload) => {
    try {
        const {data} = await api.post("/api/auth/login", payload);
        if (data.status === "success") {
            notify('success', "You have been logined successfully!");
            return data;
        }
    } catch { /* empty */
    }
};

export const logoutUser = async () => {
    const {data} = await api.post("/api/auth/logout");
    if (data.status === "success") {
        notify('success', "You have been logout successfully!");
    }
    return data;
};

export const me = async () => {
    try {
        const {data} = await api.get("api/auth/me");
        return await data;
    } catch { /* empty */
    }
};

export const checkUsername = async (username) => {
    const {data} = await api.get(
        `/api/auth/check-username?u=${encodeURIComponent(username)}`
    );
    return data;
};

export const getUsers = async () => {
    const {data} = await api.get("/api/auth/get-users");
    return data;
}
