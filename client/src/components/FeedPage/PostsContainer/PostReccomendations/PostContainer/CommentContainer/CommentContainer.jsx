import "./CommentContainer.css";
import { useState } from "react";
import ModalMore from "./ModalMore";

export default function CommentContainer() {
  const [isMore, setIsMore] = useState(false);

  return (
    <div>
      <hr />
      <div className="create-comment-container">
        <img src="client/src/assets/no-avatar.png" alt="avatar" />
        <input type="text" placeholder="Comment something" />
      </div>
      <hr />
      <div className="comment-container">
        <img src="client/src/assets/no-avatar.png" alt="avatar" id="avatar" />
        <p>Post text</p>
        <img
          src="client/src/assets/more-options.png"
          alt="more options"
          onClick={(e) => {
            e.preventDefault();
            setIsMore(!isMore);
          }}
        />
        {isMore && <ModalMore />}
      </div>
      <hr />
    </div>
  );
}
