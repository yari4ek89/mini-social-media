import {deleteAva, uploadAva} from "../services/userService.js";
import {useAuth} from "@/context/AuthContext.jsx";

export function useAvatarUpload() {
    const {setUser} = useAuth();

    return async function handleFile(file) {
        if (!file) return;

        const form = new FormData();
        form.append('avatar', file);

        const data = await uploadAva(form);
        if (data.status !== 'success') throw new Error('Upload failed');

        const url =
            data?.avatar?.secureUrl || data?.avatar?.secure_url ||
            (data?.avatar?.publicId
                ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD}/image/upload/${data.avatar.publicId}.jpg`
                : null);

        if (!url) throw new Error('Bad server response: no avatar URL');

        const v = Date.now();
        setUser(u => ({...u, avatarUrl: url, avatarVersion: v}));
    };
}

export default function AvatarUploader({initialUrl, token, onChanged}) {
    const remove = async () => {
        if (!window.confirm("Delete avatar?")) return;
        setLoading(true);
        try {
            const data = deleteAva();
            if (data.status != "success") throw new Error("Delete failed");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{display: "grid", gap: 12, maxWidth: 260}}>
            <img
                src={preview || "client/src/assets/no-avatar.png"}
                alt="avatar"
                style={{
                    width: 128,
                    height: 128,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                }}
            />
            <label style={{display: "inline-block"}}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileInputChange}
                    style={{display: "none"}}
                />
                <span
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                >
          {loading ? "Loading..." : "Load"}
        </span>
            </label>
            {preview && (
                <button
                    onClick={remove}
                    disabled={loading}
                    style={{padding: "8px 12px", borderRadius: 8}}
                >
                    Delete
                </button>
            )}
        </div>
    );
}
