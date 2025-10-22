import "./CommentContainer.css";
import {useEffect, useState} from "react";
import ModalMore from "./ModalMore.jsx";
import {usePost} from "@/context/PostContext.jsx";
import {useAuth} from "@/context/AuthContext.jsx";
import noAvatar from "@/assets/no-avatar.png";
import moreOptions from "@/assets/more-options.png";
import {notify} from "@/utils/notify.js";

export default function CommentContainer(props) {
    const {comments, postComment, commentUpdate, commentDelete, commentsGet} = usePost();
    const {user, getAllUsers, users} = useAuth();
    const [isMore, setIsMore] = useState(false);
    const [action, setAction] = useState("none");
    const [editText, setEditText] = useState("");
    const [commentText, setCommentText] = useState("");
    const [moreId, setMoreId] = useState(0);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            await getAllUsers();
            await commentsGet();
            if (cancelled) return;
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const list = Array.isArray(comments.result)
        ? comments.result
        : [];

    const ver = (comments.author?.authorId === user?.user?._id) ? (user?.user?.avatarVersion || Date.now()) : "";

    const commentPost = async (input) => {
        if (input.length > 0 && input.length <= 20000) {
            const payload = {
                postId: props.postId,
                text: input,
            };
            await postComment(payload);
            setCommentText("");
        } else {
            notify("error", "Comment must be more then 0 and less than 20001 characters!")
        }
    };

    const saveComment = async (commentId, commentText) => {
        if (commentText.length > 0 && commentText.length <= 20000) {
            const payload = {
                commentId: commentId,
                text: commentText,
            };
            await commentUpdate(payload);
        }
    };

    const deleteComment = async (commentId) => {
        const payload = {
            commentId: commentId,
            postId: props.postId,
        };
        await commentDelete(payload);
    };

    return (
        <div>
            <hr/>
            <div className="create-comment-container">
                <img
                    src={user?.user?.avatar?.url.length > 0 ? user?.user?.avatar?.url : noAvatar}
                    alt="avatar"
                />
                <input
                    type="text"
                    placeholder="Comment something"
                    value={commentText}
                    onChange={(e) => {
                        setCommentText(e.target.value)
                    }}
                />
                <button
                    onClick={async (e) => {
                        await commentPost(commentText);
                    }}
                >
                    Send
                </button>
            </div>
            <hr/>
            {list
                .filter((comment) => comment.postId === props.postId)
                .map((comment) => (
                    <>
                        <div key={comment._id} className="comment-container">
                            <img
                                src={
                                    `${(users?.users?.find(u => u._id === comment?.author?.authorId)?.avatar.url) || noAvatar}${ver ? `?v=${ver}` : ""}`
                                }
                                alt="avatar"
                                id="avatar"
                            />
                            {action === "edit" && moreId === comment?._id ? (
                                <textarea
                                    className="edit-textarea"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                            ) : (
                                <p>{comment.content}</p>
                            )}
                            <img
                                src={moreOptions}
                                alt="more options"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsMore(!isMore);
                                    setMoreId(comment?._id);
                                }}
                            />
                            {isMore && user?.user?.username === comment.author.name && moreId === comment?._id ? (
                                <ModalMore
                                    setAction={setAction}
                                    action={action}
                                    commentId={comment._id}
                                    editText={editText}
                                    saveComment={saveComment}
                                    deleteComment={deleteComment}
                                />
                            ) : null}
                        </div>
                        <hr/>
                    </>
                ))}
        </div>
    );
}
