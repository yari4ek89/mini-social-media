import { api } from "./api.js"; // import api
//import { toast } from "react-toastify";

export const uploadAva = async (payload) => {
  const { data } = await api.post("/api/users/me/avatar", payload);
  return data;
};

export const deleteAva = async () => {
  const { data } = await api.delete("/api/users/me/avatar");
  return data;
};
