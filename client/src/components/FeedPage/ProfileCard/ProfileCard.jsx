import "./ProfileCard.css";
import {useAuth} from "@/context/AuthContext.jsx";
import {useAvatarUpload} from "../../AvatarUploader.jsx";
import backgroundImage from "@/assets/background-image.png";
import avatarCircle from "@/assets/avatar-circle.png";
import noAvatar from "@/assets/no-avatar.png";
import profileShadow from "@/assets/profile-shadow.png";
import profileButton from "@/assets/profile-button.png";
import settingsButton from "@/assets/settings-button.png";
import {useRef} from "react";

export default function ProfileCard() {
    const fileRef = useRef(null);
    const {user} = useAuth();
    const handleFile = useAvatarUpload();

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
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={e => handleFile(e.target.files[0])}
            />
            <img
                src={user?.user?.avatar?.url.length > 0 ? user?.user?.avatar?.url : noAvatar}
                alt="no-avatar"
                id="no-avatar"
                onClick={(e) => fileRef.current?.click()}
            />
            <p id="nickname">{user?.user?.username}</p>
            <p id="status">{user?.user?.bio}</p>
            <img src={profileShadow} alt="profile-shadow"/>
            <div className="profile-button">
                <img src={profileButton} alt="profile-button"/>
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
