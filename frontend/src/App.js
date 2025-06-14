import React, { useState } from "react";
import DocumentManager from "./components/DocumentManager";
import "./App.css";
import logo from "./assets/logo.svg";

function App() {
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePromptSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Failed to generate content");
      const data = await response.json();
      setContent(data.content);

      // Automatically generate preview
      const previewResponse = await fetch(
        `/preview?content=${encodeURIComponent(data.content)}`
      );
      if (!previewResponse.ok) throw new Error("Failed to generate preview");
      const previewData = await previewResponse.text();
      setPreview(previewData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/preview?content=${encodeURIComponent(content)}`
      );
      if (!response.ok) throw new Error("Failed to generate preview");
      const data = await response.text();
      setPreview(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/export?content=${encodeURIComponent(content)}`
      );
      if (!response.ok) throw new Error("Failed to export PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDocument = (loadedContent) => {
    setContent(loadedContent);
    setPreview(""); // Clear preview when loading new content
  };

  return (
    <div className="App">
      <h1>AetherPress Prototype</h1>
      <div className="main-content">
        <div className="left-panel">
          <h2>Submit Prompt</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here"
            rows={4}
            cols={50}
          />
          <br />
          <button onClick={handlePromptSubmit} disabled={loading || !prompt}>
            {loading ? "Generating..." : "Submit"}
          </button>

          <h2>Preview Content</h2>
          <button onClick={handlePreview} disabled={loading || !content}>
            {loading ? "Loading Preview..." : "Generate Preview"}
          </button>
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: preview }}
          />

          <button
            onClick={handleExportPDF}
            disabled={loading || !content}
            className="export-button"
          >
            {loading ? "Exporting..." : "Download PDF"}
          </button>
        </div>

        <div className="right-panel">
          <DocumentManager content={content} onLoad={handleLoadDocument} />
        </div>
      </div>
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
}

export default App;
