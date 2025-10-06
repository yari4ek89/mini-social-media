// Import neccessary libraries
import { createContext, useContext, useState, useEffect } from "react";
import {
  createPost,
  postsGet,
  likePost,
  getLiked,
  commentPost,
  getComments,
  updateComment,
  deleteComment,
} from "../services/postService";

const PostContext = createContext(undefined);

export const usePost = () => useContext(PostContext);

export default function PostProvider({ children }) {
  // Defining var and states
  const [allPosts, setAllPosts] = useState([]);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [ready, setReady] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [postsRes, commentRes] = await Promise.all([
          postsGet(),
          getComments(),
        ]);
        if (cancelled) return;

        setAllPosts(postsRes?.posts || []);
        setCurrentPosts(postsRes?.posts || []);
        setComments(commentRes?.result || []);
      } catch (error) {
        if (cancelled) return;
        setAllPosts([]);
        setCurrentPosts([]);
        setComments([]);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const refetchAll = async () => {
    const [postsRes, commentRes] = await Promise.all([
      postsGet(),
      getComments(),
    ]);
    setAllPosts(postsRes?.posts || []);
    setCurrentPosts(postsRes?.posts || []);
    setComments(commentRes?.result || []);
    return { postsRes, commentRes };
  };

  // Neccessary requests
  const postCreate = async (form) => {
    const created = await createPost(form);
    setPost(created);
    await refetchAll();
    return created;
  };
  const getPosts = async () => {
    const res = await postsGet();
    setAllPosts(res?.posts || []);
    setCurrentPosts(res?.result || []);
    return res;
  };
  const postLike = async (form, liked) => {
    await likePost(form, liked);
    await refetchAll();
  };
  const likeGet = async (form, liked) => {
    return await getLiked(form, liked);
  };
  const postComment = async (form) => {
    const res = await commentPost(form);
    await refetchAll();
    return res;
  };
  const commentsGet = async (form) => {
    const res = await getComments(form);
    setComments(res?.result || []);
    return res;
  };
  const commentUpdate = async (form) => {
    const res = await updateComment(form);
    await commentsGet();
    return res;
  };
  const commentDelete = async (form) => {
    const res = await deleteComment(form);
    await refetchAll();
    await commentsGet();
    return res;
  };

  // Return component
  return (
    <PostContext.Provider
      value={{
        post,
        allPosts,
        currentPosts,
        ready,
        postCreate,
        postLike,
        likeGet,
        getPosts,
        postComment,
        commentsGet,
        comments,
        commentUpdate,
        commentDelete,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
