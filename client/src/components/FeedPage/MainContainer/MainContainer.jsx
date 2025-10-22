import ProfileCard from "../ProfileCard/ProfileCard.jsx";
import PostsContainer from "../PostsContainer/PostsContainer.jsx";
import RightReccomendations from "../RightReccomendations/RightReccomendations.jsx";
import "./MainContainer.css";

export default function MainContainer() {
    return (
        <main>
            <ProfileCard/>
            <PostsContainer/>
            <RightReccomendations/>
        </main>
    );
}
