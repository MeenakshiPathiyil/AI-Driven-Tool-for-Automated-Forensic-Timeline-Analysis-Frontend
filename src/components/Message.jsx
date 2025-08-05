import React from "react";

const Message = ({ text, sender }) => {
  const isUser = sender === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      margin: "0.5rem 0"
    }}>
      <div style={{
        background: isUser ? "#007bff" : "#e5e7eb",
        color: isUser ? "#fff" : "#222",
        padding: "0.7rem 1.2rem",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        maxWidth: "75%",
        boxShadow: "0 2px 8px #0001",
        fontSize: "1rem",
        wordBreak: "break-word"
      }}>
        {text}
      </div>
    </div>
  );
};

export default Message;
