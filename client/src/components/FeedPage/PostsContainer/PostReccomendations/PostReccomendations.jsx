import "./PostReccomendations.css";
import PostContainer from "./PostContainer/PostContainer.jsx";
import {usePost} from "@/context/PostContext.jsx";
import noAvatar from "@/assets/no-avatar.png";

export default function PostReccomendations() {
    const {allPosts, hasMore, getPosts} = usePost();

    console.log(allPosts);

    if (Array.isArray(allPosts) && allPosts.length > 0) {
        return (
            <div>
                {allPosts && allPosts.length > 0 ? (
                    allPosts.map((post) => (
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
                {hasMore && (
                    <button onClick={async (e) => {
                        await getPosts();
                    }}>Show More</button>
                )}
            </div>
        );
    }
}
