import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import FileUploader from "./components/FileUploader";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! Please upload your log file (CSV) to begin.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (text, sender = "user") => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    sendMessage(trimmed, "user");
    setInput("");

    // Default reply when no special context
    sendMessage(`You said: ${trimmed}`, "bot");
  };

  const analyzeLogs = async () => {
    try {
      const response = await axios.post("http://localhost:8000/analyze", {});
      sendMessage("Analysis complete. Download your results below!", "bot");
      setAnalysisResult(response.data);
      setOutputFile(response.data.output_file);
    } catch (error) {
      sendMessage("There was an error running the analysis.", "bot");
      console.error(error);
    }
  };

  const handleDownload = async () => {
    if (!outputFile) return;
    try {
      const response = await axios.get(
        `http://localhost:8000/download/${encodeURIComponent(outputFile)}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = outputFile.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      sendMessage("Failed to download analysis result.", "bot");
      console.error(error);
    }
  };

  const handleUploadSuccess = (data) => {
    setFileUploaded(true);
    sendMessage(`File uploaded: ${data.filename || "(see server response)"}`, "user");
    sendMessage("Starting analysis...", "bot");
    analyzeLogs();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div
      className="App"
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #0001",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
      }}
    >
      <h1 style={{ textAlign: "center", margin: "1rem 0 0.5rem 0" }}>
        Log Analyzer Chat
      </h1>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <ChatWindow messages={messages} />
        <div ref={chatEndRef} />
        {analysisResult && (
          <div style={{ textAlign: "center", margin: "1rem 0" }}>
            <button
              onClick={handleDownload}
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: 20,
                border: "none",
                background: "#28a745",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Download Analysis Result (JSON)
            </button>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          borderTop: "1px solid #eee",
          background: "#fafbfc",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={!fileUploaded}
          placeholder={fileUploaded ? "Type your message..." : "Please upload a CSV file first..."}
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            borderRadius: 20,
            border: "1px solid #ccc",
            marginRight: 8,
          }}
        />
        <button
          onClick={handleSend}
          disabled={!fileUploaded}
          style={{
            marginRight: 8,
            padding: "0.5rem 1rem",
            borderRadius: 20,
            border: "none",
            background: fileUploaded ? "#007bff" : "#ccc",
            color: "#fff",
          }}
        >
          Send
        </button>
        <FileUploader onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}

export default App;