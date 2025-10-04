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
  const [comments, setComments] = useState(null);
  const [ready, setReady] = useState(null);
  let data;

  useEffect(() => {
    postsGet()
      .then((res) => {
        setAllPosts(res.posts || []);
        setCurrentPosts(res.result || []);
      })
      .catch((error) => {
        setAllPosts([]);
        setCurrentPosts([]);
      })
      .finally(() => {
        setReady(true);
      });
  }, []);

  useEffect(() => {
    getComments()
      .then((res) => {
        setComments(res.result);
      })
      .catch((error) => {
        setComments([]);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [postsRes, commentsRes] = await Promise.all([
          postsGet(),
          getComments(),
        ]);
        if (cancelled) return;

        setCurrentPosts(postsRes?.result || []);
        setAllPosts(postsRes?.posts || []);
        setComments(commentsRes?.result || []);
      } catch {
        if (cancelled) return;
        setCurrentPosts([]);
        setAllPosts([]);
        setComments([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Neccessary requests
  const postCreate = async (form) => {
    data = await createPost(form);
    setPost(data);
  };
  const getPosts = async () => {
    data = await postsGet();
    setAllPosts(data.posts || []);
    setCurrentPosts(data.result || []);
    return data;
  };
  const postLike = async (form, liked) => {
    data = await likePost(form, liked);
    setAllPosts(data.posts);
    setCurrentPosts(data.result || []);
    return data.posts;
  };
  const likeGet = async (form, liked) => {
    data = await getLiked(form, liked);
    return data;
  };
  const postComment = async (form) => {
    data = await commentPost(form);
    setAllPosts(data.posts);
    setCurrentPosts(data.result || []);
    return data.posts;
  };
  const commentsGet = async (form) => {
    data = await getComments(form);
    setComments(data || []);
    return data;
  };
  const commentUpdate = async (form) => {
    data = await updateComment(form);
    return data;
  };
  const commentDelete = async (form) => {
    data = await deleteComment(form);
    return data;
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
