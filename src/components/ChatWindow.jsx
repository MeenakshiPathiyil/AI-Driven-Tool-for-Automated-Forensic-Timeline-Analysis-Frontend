import React, { useRef, useEffect } from "react";
import Message from "./Message";

const ChatWindow = ({ messages }) => {
  const bottomRef = useRef(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem", marginBottom: 0, background: "#f4f6fb" }}>
      {messages.map((msg, index) => (
        <Message key={index} text={msg.text} sender={msg.sender} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
