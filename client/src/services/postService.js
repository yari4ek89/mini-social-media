import {api} from "./api.js";
import {notify} from "@/utils/notify.js";

export const createPost = async (payload) => {
    const {data} = await api.post("/api/post/create-post", payload);
    if (data.status === "success") {
        notify("success", "Post successfully created");
        return data;
    }
};

export const postsGet = async (page) => {
    const {data} = await api.get(`/api/post/get-post?page=${page}&limit=10`);
    return data;
};

export const likePost = async (payload, liked) => {
    const {data} = await api.post("/api/post/like-post", payload);
    if ((data.status) === "success") {
        liked(true);
    } else if ((data.status) === "success1") {
        liked(false);
    }
    return await data;
};

export const getLiked = async (payload, liked) => {
    const {data} = await api.post("/api/post/get-like", payload);
    liked(data.result);
    return data;
};

export const commentPost = async (payload) => {
    const {data} = await api.post("/api/post/comment-post", payload);
    return data;
};

export const getComments = async () => {
    const {data} = await api.get(`/api/post/get-comments`);
    return data;
};

export const updateComment = async (payload) => {
    const {data} = await api.put("/api/post/update-comment", payload);
    if (data.status === "success") {
        notify("success", "Comment successfully updated");
        return data;
    }
};

export const deleteComment = async (payload) => {
    const {data} = await api.delete(
        `/api/post/delete-comment?postId=${payload.postId}&commentId=${payload.commentId}`
    );
    if (data.status === "success") {
        notify("success", "Comment successfully deleted");
        return data;
    }
};
