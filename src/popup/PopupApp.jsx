import React, { useEffect, useMemo, useState } from "react";
import "./popup.css";

import { getAppData, saveAppData } from "../utils/storage";
import {
  addFolder,
  findFolderById,
  renameFolder,
  deleteFolder,
  addNoteToFolder,
  updateNoteInFolder,
  deleteNoteFromFolder
} from "../utils/folderHelpers";
import {
  addReminderToFolder,
  deleteReminderFromFolder
} from "../utils/reminderHelpers";

import FolderTree from "./components/FolderTree";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import ReminderForm from "./components/ReminderForm";

export default function PopupApp() {
  const [data, setData] = useState({ folders: [] });
  const [selectedFolderId, setSelectedFolderId] = useState("root");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const saved = await getAppData();
    setData(saved);
    setLoading(false);
  }

  const selectedFolder = useMemo(() => {
    return findFolderById(data.folders, selectedFolderId);
  }, [data, selectedFolderId]);

  async function persist(updatedFolders) {
    const updatedData = { ...data, folders: updatedFolders };
    setData(updatedData);
    await saveAppData(updatedData);
  }

  // Folder actions
  async function handleCreateFolder(parentId, folderName) {
    if (!folderName.trim()) return;
    const updated = addFolder(data.folders, parentId, folderName.trim());
    await persist(updated);
  }

  async function handleRenameFolder(folderId, newName) {
    if (!newName.trim()) return;
    const updated = renameFolder(data.folders, folderId, newName.trim());
    await persist(updated);
  }

  async function handleDeleteFolder(folderId) {
    if (folderId === "root") {
      alert("Root folder delete করা যাবে না");
      return;
    }
    const ok = confirm("এই folder delete করতে চাও?");
    if (!ok) return;

    const updated = deleteFolder(data.folders, folderId);

    if (selectedFolderId === folderId) {
      setSelectedFolderId("root");
    }

    await persist(updated);
  }

  // Notes
  async function handleAddNote(note) {
    const updated = addNoteToFolder(data.folders, selectedFolderId, note);
    await persist(updated);
  }

  async function handleUpdateNote(noteId, updatedNote) {
    const updated = updateNoteInFolder(
      data.folders,
      selectedFolderId,
      noteId,
      updatedNote
    );
    await persist(updated);
  }

  async function handleDeleteNote(noteId) {
    const ok = confirm("এই note delete করতে চাও?");
    if (!ok) return;

    const updated = deleteNoteFromFolder(data.folders, selectedFolderId, noteId);
    await persist(updated);
  }

  // Reminder
  async function handleAddReminder(reminder) {
    const updated = addReminderToFolder(data.folders, selectedFolderId, reminder);

    // reminder object save হওয়ার পর id লাগবে alarm create করতে
    const updatedFolder = findFolderById(updated, selectedFolderId);
    const createdReminder =
      updatedFolder?.reminders?.[updatedFolder.reminders.length - 1];

    await persist(updated);

    if (createdReminder) {
      chrome.runtime.sendMessage({
        type: "CREATE_REMINDER_ALARM",
        payload: createdReminder
      });
    }
  }

  async function handleDeleteReminder(reminderId) {
    const ok = confirm("এই reminder delete করতে চাও?");
    if (!ok) return;

    const updated = deleteReminderFromFolder(
      data.folders,
      selectedFolderId,
      reminderId
    );
    await persist(updated);
  }

  if (loading) {
    return <div className="popup-loading">Loading...</div>;
  }

  return (
    <div className="popup-wrapper">
      <header className="popup-header">
        <h1>Reminder Notes</h1>
        <p>Folders, notes & reminders</p>
      </header>

      <div className="popup-body">
        {/* LEFT: Folder tree */}
        <aside className="left-panel">
          <FolderTree
            folders={data.folders}
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </aside>

        {/* RIGHT: details */}
        <main className="right-panel">
          {!selectedFolder ? (
            <div className="empty-box">No folder selected</div>
          ) : (
            <>
              <section className="folder-info-card">
                <h2>{selectedFolder.name}</h2>
                <div className="folder-meta">
                  <span>Notes: {selectedFolder.notes?.length || 0}</span>
                  <span>Reminders: {selectedFolder.reminders?.length || 0}</span>
                </div>
              </section>

              <section className="card">
                <h3>Add Note</h3>
                <NoteEditor onSave={handleAddNote} />
              </section>

              <section className="card">
                <h3>Notes</h3>
                <NoteList
                  notes={selectedFolder.notes || []}
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                />
              </section>

              <section className="card">
                <h3>Set Reminder</h3>
                <ReminderForm onSave={handleAddReminder} />
              </section>

              <section className="card">
                <h3>Reminder List</h3>
                <div className="reminder-list">
                  {(selectedFolder.reminders || []).length === 0 ? (
                    <div className="empty-small">No reminders yet</div>
                  ) : (
                    selectedFolder.reminders.map((rem) => (
                      <div className="reminder-item" key={rem.id}>
                        <div>
                          <div className="reminder-text">{rem.text}</div>
                          <div className="reminder-time">
                            {new Date(rem.time).toLocaleString()}
                          </div>
                          <div className="reminder-sound">
                            Sound: {rem.sound}
                          </div>
                        </div>
                        <button
                          className="danger-btn"
                          onClick={() => handleDeleteReminder(rem.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}