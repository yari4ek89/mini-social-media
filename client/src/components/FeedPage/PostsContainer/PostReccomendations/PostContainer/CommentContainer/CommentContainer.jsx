import "./CommentContainer.css";
import { useState, useRef, useEffect } from "react";
import ModalMore from "./ModalMore";
import { usePost } from "../../../../../../context/PostContext";
import { useAuth } from "../../../../../../context/AuthContext";

export default function CommentContainer(props) {
  const { comments, postComment, commentUpdate, commentDelete } = usePost();
  const { user } = useAuth();
  const [isMore, setIsMore] = useState(false);
  const [action, setAction] = useState("none");
  const [editText, setEditText] = useState("");
  const textComment = useRef(null);

  const commentPost = async (input) => {
    if (input.length > 0 && input.length <= 20000) {
      const payload = {
        postId: props.postId,
        text: input,
      };
      await postComment(payload);
    }
    textComment.current = "";
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
      <hr />
      <div className="create-comment-container">
        <img
          src={user?.avatar?.url || "@/assets/no-avatar.png"}
          alt="avatar"
        />
        <input
          type="text"
          placeholder="Comment something"
          minLength={1}
          maxLength={20000}
          required={true}
          ref={textComment}
        />
        <button
          onClick={(e) => {
            commentPost(textComment.current.value);
          }}
        >
          Send
        </button>
      </div>
      <hr />
      {comments.result
        .filter((comment) => comment.postId === props.postId)
        .map((comment) => (
          <>
            <div key={comment._id} className="comment-container">
              <img
                src={
                  comment?.author?.avatarUrl ||
                  "@/assets/no-avatar.png"
                }
                alt="avatar"
                id="avatar"
              />
              {action === "edit" ? (
                <textarea
                  className="edit-textarea"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <p>{comment.content}</p>
              )}
              <img
                src="@/assets/more-options.png"
                alt="more options"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMore(!isMore);
                }}
              />
              {isMore && user.username === comment.author.name ? (
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
            <hr />
          </>
        ))}
    </div>
  );
}

/*{
  allPosts.posts.map((post) => (
    <div key={post._id} className="post-reccomendations">
      <PostContainer
        profAvatar="/client/src/assets/no-avatar.png"
        postText={post.content}
        commentCount={post.commentCount}
        likeCount={post.likesCount}
        postId={post._id}
      />
    </div>
  ));
}*/
