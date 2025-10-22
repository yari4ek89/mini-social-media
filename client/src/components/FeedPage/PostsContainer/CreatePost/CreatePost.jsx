import "./CreatePost.css";
import {useRef, useState} from "react";
import {usePost} from "@/context/PostContext.jsx";
import {useAuth} from "@/context/AuthContext.jsx";
import noAvatar from "@/assets/no-avatar.png";
import imageAction from "@/assets/image-action.png";
import gifAction from "@/assets/gif-action.png";
import emojiAction from "@/assets/emoji-action.png";
import positionAction from "@/assets/position-action.png";

export default function CreatePost() {
    const postInput = useRef("");
    const {postCreate} = usePost();
    const {user} = useAuth();

    const [data, setData] = useState({
        authorId: user?.user?._id,
        content: ""
    });

    return (
        <div className="create-post">
            <div className="create">
                <img
                    src={user?.user?.avatar?.url.length > 0 ? user?.user?.avatar?.url : noAvatar}
                    alt="no-avatar"
                    id="no-avatar-create"
                />
                <input
                    type="text"
                    placeholder="What's going on"
                    value={postInput.current}
                    onChange={(e) => {
                        postInput.current = e.target.value;
                        setData({...data, content: e.target.value})
                    }
                    }
                />
            </div>
            <div className="additional-action">
                <img src={imageAction} alt="image-action"/>
                <img src={gifAction} alt="gif-action"/>
                <img src={emojiAction} alt="emoji-action"/>
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
