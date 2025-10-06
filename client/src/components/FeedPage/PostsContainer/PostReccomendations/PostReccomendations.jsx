import "./PostReccomendations.css";
import PostContainer from "./PostContainer/PostContainer";
import { usePost } from "../../../../context/PostContext";
import noAvatar from "@/assets/no-avatar.png";

export default function PostReccomendations() {
  const { allPosts } = usePost();

  if (Array.isArray(allPosts.posts) && allPosts.posts.length > 0) {
    return (
      <div>
        {allPosts.posts && allPosts.posts.length > 0 ? (
          allPosts.posts.map((post) => (
            <div key={post._id} className="post-reccomendations">
              <PostContainer
                profAvatar={noAvatar}
                postText={post.content}
                commentCount={post.commentCount}
                likeCount={post.likesCount}
                postId={post._id}
              />
            </div>
          ))
        ) : (
          <p className="no-posts">There is no posts for this time :(</p>
        )}
      </div>
    );
  }
}
