// Import neccessary libraries
import { createContext, useContext, useState, useEffect } from "react";
import {
  createPost,
  postsGet,
  likePost,
  getLiked,
} from "../services/postService";

const PostContext = createContext(undefined);

export const usePost = () => useContext(PostContext);

export default function PostProvider({ children }) {
  // Defining var and states
  const [allPosts, setAllPosts] = useState([]);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [post, setPost] = useState(null);
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

  postsGet()
    .then((res) => {
      setCurrentPosts(res.result || []);
      setAllPosts(res.posts || []);
    })
    .catch((e) => {
      setCurrentPosts([]);
      setAllPosts([]);
    });

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
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
