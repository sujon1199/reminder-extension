import { generateId } from "./id";

/**
 * Folder খুঁজে বের করা
 */
export function findFolderById(folders, folderId) {
  for (const folder of folders) {
    if (folder.id === folderId) return folder;

    if (folder.children?.length) {
      const found = findFolderById(folder.children, folderId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Folder add
 */
export function addFolder(folders, parentId, folderName) {
  return folders.map((folder) => {
    if (folder.id === parentId) {
      return {
        ...folder,
        children: [
          ...(folder.children || []),
          {
            id: generateId("folder"),
            name: folderName,
            type: "folder",
            notes: [],
            reminders: [],
            children: []
          }
        ]
      };
    }

    return {
      ...folder,
      children: folder.children?.length
        ? addFolder(folder.children, parentId, folderName)
        : []
    };
  });
}

/**
 * Folder rename
 */
export function renameFolder(folders, folderId, newName) {
  return folders.map((folder) => {
    if (folder.id === folderId) {
      return { ...folder, name: newName };
    }

    return {
      ...folder,
      children: folder.children?.length
        ? renameFolder(folder.children, folderId, newName)
        : []
    };
  });
}

/**
 * Folder delete
 * root delete allow করা হবে না
 */
export function deleteFolder(folders, folderId) {
  return folders
    .filter((folder) => folder.id !== folderId)
    .map((folder) => ({
      ...folder,
      children: folder.children?.length
        ? deleteFolder(folder.children, folderId)
        : []
    }));
}

/**
 * Note add
 */
export function addNoteToFolder(folders, folderId, note) {
  return folders.map((folder) => {
    if (folder.id === folderId) {
      return {
        ...folder,
        notes: [
          ...(folder.notes || []),
          {
            id: generateId("note"),
            title: note.title,
            content: note.content,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        ]
      };
    }

    return {
      ...folder,
      children: folder.children?.length
        ? addNoteToFolder(folder.children, folderId, note)
        : []
    };
  });
}

/**
 * Note update
 */
export function updateNoteInFolder(folders, folderId, noteId, updatedNote) {
  return folders.map((folder) => {
    if (folder.id === folderId) {
      return {
        ...folder,
        notes: (folder.notes || []).map((note) =>
          note.id === noteId
            ? {
                ...note,
                title: updatedNote.title,
                content: updatedNote.content,
                updatedAt: Date.now()
              }
            : note
        )
      };
    }

    return {
      ...folder,
      children: folder.children?.length
        ? updateNoteInFolder(folder.children, folderId, noteId, updatedNote)
        : []
    };
  });
}

/**
 * Note delete
 */
export function deleteNoteFromFolder(folders, folderId, noteId) {
  return folders.map((folder) => {
    if (folder.id === folderId) {
      return {
        ...folder,
        notes: (folder.notes || []).filter((note) => note.id !== noteId)
      };
    }

    return {
      ...folder,
      children: folder.children?.length
        ? deleteNoteFromFolder(folder.children, folderId, noteId)
        : []
    };
  });
}