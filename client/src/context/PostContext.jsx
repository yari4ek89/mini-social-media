// Import neccessary libraries
import {createContext, useContext, useEffect, useState} from "react";
import {
    commentPost,
    createPost,
    deleteComment,
    getComments,
    getLiked,
    likePost,
    postsGet,
    updateComment,
} from "../services/postService.js";

const PostContext = createContext(undefined);

export const usePost = () => useContext(PostContext);

export default function PostProvider({children}) {
    // Defining var and states
    const [allPosts, setAllPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [currentPosts, setCurrentPosts] = useState([]);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [ready, setReady] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [postsRes, commentRes] = await Promise.all([
                    postsGet(page),
                    getComments(),
                ]);
                if (cancelled) return;

                setAllPosts([...allPosts, ...postsRes.posts.posts]);
                setCurrentPosts(postsRes?.result.posts || []);
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
        setPage(1);
        setHasMore(true);
        const [postsRes, commentRes] = await Promise.all([
            postsGet(page),
            getComments(),
        ]);
        for (const post of postsRes.posts.posts) {
            if (!allPosts.some(p => p._id === post._id)) {
                setAllPosts([post, ...allPosts]);
            } else {
                setAllPosts(prev => {
                    return prev.map(post1 => post1._id === post._id ? post : post1);
                })
            }
        }
        setComments(commentRes?.result || []);
        return {postsRes, commentRes};
    };

    // Neccessary requests
    const postCreate = async (form) => {
        const created = await createPost(form);
        setPost(created);
        setPage(1);
        setAllPosts([]);
        await refetchAll();
        return created;
    };
    const getPosts = async () => {
        const next = page + 1;
        setPage(next);
        const res = await postsGet(next);
        console.log(res.posts);
        setHasMore(next < res.totalPages);
        setAllPosts([...allPosts, ...res.posts.posts]);
        setCurrentPosts(res?.result.posts || []);
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
    const commentsGet = async () => {
        const res = await getComments();
        console.log(res);
        setComments(res?.result || []);
        await refetchAll();
        return res;
    };
    const commentUpdate = async (form) => {
        const res = await updateComment(form);
        await commentsGet();
        await refetchAll();
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
                page,
                hasMore,
                setPage,
                postCreate,
                postLike,
                likeGet,
                getPosts,
                postComment,
                commentsGet,
                comments,
                setComments,
                commentUpdate,
                commentDelete,
            }}
        >
            {children}
        </PostContext.Provider>
    );
}
