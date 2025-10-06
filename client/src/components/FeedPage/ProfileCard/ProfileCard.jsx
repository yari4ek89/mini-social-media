import "./ProfileCard.css";
import { useAuth } from "../../../context/AuthContext";
import { onFileInputChange } from "../../AvatarUploader";
import backgroundImage from "@/assets/background-image.png";
import avatarCircle from "@/assets/avatar-circle.png";
import noAvatar from "@/assets/no-avatar.png";
import profileShadow from "@/assets/profile-shadow.png";
import profileButton from "@/assets/profile-button.png";
import settingsButton from "@/assets/settings-button.png";

export default function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="profile-card">
      <div className="start"></div>
      <img
        src={backgroundImage}
        alt="background-image"
        id="background-img"
      />
      <img
        src={avatarCircle}
        alt="avatar-circle"
        id="avatar-circle"
      />
      <input
        className="imageInput"
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
      />
      <img
        src={user.avatar?.url || {noAvatar}}
        alt="no-avatar"
        id="no-avatar"
      />
      <p id="nickname">{user.username}</p>
      <p id="status">{user.bio}</p>
      <img src={profileShadow} alt="profile-shadow" />
      <div className="profile-button">
        <img src={profileButton} alt="profile-button" />
        <p>Profile</p>
      </div>
      <div className="settings-button">
        <img
          src={settingsButton}
          alt="settings-button"
        />
        <p>Settings</p>
      </div>
    </div>
  );
}
