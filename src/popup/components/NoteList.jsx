import React, { useState } from "react";

export default function NoteEditor({ onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    onSave({
      title: title.trim() || "Untitled Note",
      content: content.trim()
    });

    setTitle("");
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="form-label">Note title</label>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write note title"
        />
      </div>

      <div className="form-row">
        <label className="form-label">Note content</label>
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note"
        />
      </div>

      <button className="primary-btn" type="submit">
        Save Note
      </button>
    </form>
  );
}