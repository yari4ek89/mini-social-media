import "./PostsContainer.css";
import CreatePost from "./CreatePost/CreatePost";
import PostReccomendations from "./PostReccomendations/PostReccomendations";

export default function PostsContainer() {
  return (
    <div className="posts-container">
      <CreatePost />
      <PostReccomendations />
    </div>
  );
}
