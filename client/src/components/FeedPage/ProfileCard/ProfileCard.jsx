import "./ProfileCard.css";
import { useAuth } from "../../../context/AuthContext";
import { onFileInputChange } from "../../AvatarUploader";

export default function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="profile-card">
      <div className="start"></div>
      <img
        src="/client/src/assets/background-image.png"
        alt="background-image"
        id="background-img"
      />
      <img
        src="/client/src/assets/avatar-circle.png"
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
        src={user.avatar?.url || "/client/src/assets/no-avatar.png"}
        alt="no-avatar"
        id="no-avatar"
      />
      <p id="nickname">{user.username}</p>
      <p id="status">{user.bio}</p>
      <img src="/client/src/assets/profile-shadow.png" alt="profile-shadow" />
      <div className="profile-button">
        <img src="/client/src/assets/profile-button.png" alt="profile-button" />
        <p>Profile</p>
      </div>
      <div className="settings-button">
        <img
          src="/client/src/assets/settings-button.png"
          alt="settings-button"
        />
        <p>Settings</p>
      </div>
    </div>
  );
}
