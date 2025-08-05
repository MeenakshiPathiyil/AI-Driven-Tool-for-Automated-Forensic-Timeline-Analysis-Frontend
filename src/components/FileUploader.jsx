import React from "react";
import axios from "axios";

const FileUploader = ({ onUploadSuccess }) => {
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <label style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", background: "#e5e7eb", borderRadius: "50%", width: 36, height: 36, justifyContent: "center" }} title="Upload file">
      <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        <polyline points="7 9 12 4 17 9" />
        <line x1="12" y1="4" x2="12" y2="16" />
      </svg>
    </label>
  );
};

export default FileUploader;
