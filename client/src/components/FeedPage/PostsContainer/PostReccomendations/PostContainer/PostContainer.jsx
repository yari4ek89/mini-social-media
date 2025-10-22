import "./PostContainer.css";
import ActionContainer from "./ActionContainer/ActionContainer.jsx";
import CommentContainer from "./CommentContainer/CommentContainer.jsx";
import {usePost} from "@/context/PostContext.jsx";
import React, {useEffect, useState} from "react";
import moreOptions from "@/assets/more-options.png";
import commentIcon from "@/assets/comment-icon.png";
import likeIcon from "@/assets/like-icon.png";
import shareIcon from "@/assets/share-icon.png";
import {useAuth} from "@/context/AuthContext.jsx";

export default function PostContainer(props) {
    const {postLike, likeGet, allPosts, commentsGet} = usePost();
    const {users} = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [isComment, setIsComment] = useState(false);

    const RED_FILTER =
        "invert(27%) sepia(100%) saturate(1400%) hue-rotate(350deg) brightness(85%) contrast(100%)";
    const BASE_FILTER = "none";

    async function getLike(id) {
        const payload = {postId: id};
        await likeGet(payload, setIsLiked);
    }

    useEffect(() => {
        getLike(props.postId);
        (async () => {
            await commentsGet();
        });
    }, []);

    const buttonStyle = {
        filter: isLiked ? RED_FILTER : BASE_FILTER,
        transition: "filter 0.3s ease-in-out",
    };

    const likePost = async (id) => {
        const payload = {postId: id};
        await postLike(payload, setIsLiked);
    };

    const postsArray = Array.isArray(allPosts)
        ? allPosts
        : Array.isArray(allPosts)
            ? allPosts
            : [];

    const post = React.useMemo(
        () => postsArray.find((p) => String(p._id) === String(props.postId)),
        [postsArray, props.postId]
    );

    const avatarSrc = users?.users?.find(u => u._id === post?.author?.authorId)?.avatar.url || props.profAvatar;

    return (
        <div className="post-container">
            <div className="upper-container">
                <img src={avatarSrc} alt="Avatar" id="avatar"/>
                <p id="post-text">{props.postText}</p>
                <img
                    src={moreOptions}
                    alt="more-options"
                    id="more-options"
                />
            </div>
            <div className="lower-container">
                <ActionContainer
                    actionIcon={commentIcon}
                    count={props.commentCount || 0}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsComment(!isComment);
                    }}
                />
                <ActionContainer
                    actionIcon={likeIcon}
                    count={props.likeCount || 0}
                    _class={"like"}
                    onClick={(e) => {
                        e.preventDefault();
                        likePost(props.postId);
                    }}
                    buttonStyle={buttonStyle}
                />
                <img
                    src={shareIcon}
                    alt="share-icon"
                    id="share-icon"
                />
            </div>
            {isComment && (
                <CommentContainer postId={props.postId} avatarSrc={avatarSrc}/>
            )}
        </div>
    );
}
