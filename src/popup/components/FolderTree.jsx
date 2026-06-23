import React, { useState } from "react";
import FolderNode from "./FolderNode";

export default function FolderTree({
  folders,
  selectedFolderId,
  onSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder
}) {
  const [rootFolderName, setRootFolderName] = useState("");

  function handleRootCreate() {
    if (!rootFolderName.trim()) return;
    onCreateFolder("root", rootFolderName.trim());
    setRootFolderName("");
  }

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Folders</h3>

      <div style={{ marginBottom: 14 }}>
        <input
          className="input"
          placeholder="New folder inside Root"
          value={rootFolderName}
          onChange={(e) => setRootFolderName(e.target.value)}
        />
        <button
          className="primary-btn"
          style={{ width: "100%", marginTop: 8 }}
          onClick={handleRootCreate}
        >
          Create Folder
        </button>
      </div>

      <div>
        {folders.map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            selectedFolderId={selectedFolderId}
            onSelect={onSelect}
            onCreateFolder={onCreateFolder}
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}