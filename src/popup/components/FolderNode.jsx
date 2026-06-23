import React, { useState } from "react";

export default function FolderNode({
  folder,
  selectedFolderId,
  onSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  level = 0
}) {
  const [expanded, setExpanded] = useState(true);
  const [childName, setChildName] = useState("");

  const isSelected = selectedFolderId === folder.id;

  function handleCreateChild() {
    if (!childName.trim()) return;
    onCreateFolder(folder.id, childName.trim());
    setChildName("");
    setExpanded(true);
  }

  function handleRename() {
    const newName = prompt("New folder name:", folder.name);
    if (newName && newName.trim()) {
      onRenameFolder(folder.id, newName.trim());
    }
  }

  return (
    <div style={{ marginLeft: level * 14, marginBottom: 10 }}>
      <div
        style={{
          border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
          borderRadius: 10,
          padding: 10,
          background: isSelected ? "#eff6ff" : "#fff"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            alignItems: "center"
          }}
        >
          <div
            style={{ cursor: "pointer", fontWeight: 600 }}
            onClick={() => onSelect(folder.id)}
          >
            📁 {folder.name}
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              className="secondary-btn"
              style={{ padding: "6px 8px" }}
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "-" : "+"}
            </button>

            <button
              className="secondary-btn"
              style={{ padding: "6px 8px" }}
              onClick={handleRename}
            >
              Rename
            </button>

            {folder.id !== "root" && (
              <button
                className="danger-btn"
                style={{ padding: "6px 8px" }}
                onClick={() => onDeleteFolder(folder.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <input
            className="input"
            placeholder={`Create folder inside ${folder.name}`}
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
          />
          <button
            className="primary-btn"
            style={{ width: "100%", marginTop: 8 }}
            onClick={handleCreateChild}
          >
            Add Child Folder
          </button>
        </div>
      </div>

      {expanded && folder.children?.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {folder.children.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              onCreateFolder={onCreateFolder}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}