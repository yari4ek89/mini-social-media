import "./CreatePost.css";
import { useState, useRef } from "react";
import { usePost } from "../../../../context/PostContext";
import { useAuth } from "../../../../context/AuthContext";
import noAvatar from "@/assets/no-avatar.png";
import imageAction from "@/assets/image-action.png";
import gifAction from "@/assets/gif-action.png";
import emojiAction from "@/assets/emoji-action.png";
import positionAction from "@/assets/position-action.png";

export default function CreatePost() {
  const postInput = useRef(null);
  const currentDate = new Date();
  const { post, postCreate } = usePost();
  const { user } = useAuth();

  const [data, setData] = useState({
    authorId: user._id,
    content: "",
    createdAt: `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`,
    updatedAt: `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`,
  });

  return (
    <div className="create-post">
      <div className="create">
        <img
          src={user.avatar?.url || {noAvatar}}
          alt="no-avatar"
          id="no-avatar-create"
        />
        <input
          type="text"
          placeholder="What's going on"
          value={postInput.current}
          onChange={(e) => setData({ ...data, content: e.target.value })}
        />
      </div>
      <div className="additional-action">
        <img src={imageAction} alt="image-action" />
        <img src={gifAction} alt="gif-action" />
        <img src={emojiAction} alt="emoji-action" />
        <img
          src={positionAction}
          alt="position-action"
        />
        <button
          id="post-button"
          onClick={async () => {
            await postCreate(data);
            postInput.current = "";
          }}
        >
          Post it
        </button>
      </div>
    </div>
  );
}
