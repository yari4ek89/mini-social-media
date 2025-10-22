import "./PostsContainer.css";
import CreatePost from "./CreatePost/CreatePost.jsx";
import PostReccomendations from "./PostReccomendations/PostReccomendations.jsx";

export default function PostsContainer() {
    return (
        <div className="posts-container">
            <CreatePost/>
            <PostReccomendations/>
        </div>
    );
}
