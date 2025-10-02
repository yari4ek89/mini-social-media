import ProfileCard from "../ProfileCard/ProfileCard";
import PostsContainer from "../PostsContainer/PostsContainer";
import RightReccomendations from "../RightReccomendations/RightReccomendations";
import "./MainContainer.css";

export default function MainContainer() {
  return (
    <main>
      <ProfileCard />
      <PostsContainer />
      <RightReccomendations />
    </main>
  );
}
