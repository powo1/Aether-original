import React, { useState, useEffect } from "react";

function DocumentManager({ content, onLoad }) {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadDocuments = async () => {
    try {
      const response = await fetch("/documents");
      if (!response.ok) throw new Error("Failed to load documents");
      const docs = await response.json();
      setDocuments(docs);
    } catch (err) {
      setError(err.message);
    }
  };

  const saveDocument = async () => {
    if (!title.trim()) {
      setError("Please enter a document title");
      return;
    }
    if (!content.trim()) {
      setError("Cannot save empty content");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save document");
      }

      const saved = await response.json();
      setDocuments([saved, ...documents]);
      setTitle("");
      setSuccessMessage("Document saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDocument = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/documents/${id}`);
      if (!response.ok) throw new Error("Failed to load document");
      const doc = await response.json();
      onLoad(doc.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/documents/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete document");
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="document-manager">
      <div className="save-form">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          placeholder="Document title"
          disabled={loading || !content}
          className={error && !title.trim() ? "error" : ""}
        />
        <button
          onClick={saveDocument}
          disabled={loading || !title || !content}
          className="save-button"
        >
          {loading ? "Saving..." : "Save Document"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="documents-list">
        <h3>Saved Documents</h3>
        {documents.length === 0 ? (
          <p className="no-documents">No documents saved yet</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <span className="document-title">{doc.title}</span>
              <div className="document-actions">
                <button onClick={() => loadDocument(doc.id)}>Load</button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
              <span className="document-date">
                {new Date(doc.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DocumentManager;
