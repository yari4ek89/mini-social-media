import { useState } from "react";
import { uploadAva, deleteAva } from "../services/userService";

export const onFileInputChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    handleFile(file);
  }
};

export const handleFile = async (file) => {
  if (!file) return;
  try {
    const form = new FormData();
    form.append("avatar", file);
    const data = await uploadAva(form);
    if (data.status != "success") throw new Error("Upload failed");
  } catch (error) {
    alert(error.message);
  }
};

export default function AvatarUploader({ initialUrl, token, onChanged }) {
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
    <div style={{ display: "grid", gap: 12, maxWidth: 260 }}>
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
      <label style={{ display: "inline-block" }}>
        <input
          type="file"
          accept="image/*"
          onChange={onFileInputChange}
          style={{ display: "none" }}
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
          style={{ padding: "8px 12px", borderRadius: 8 }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
