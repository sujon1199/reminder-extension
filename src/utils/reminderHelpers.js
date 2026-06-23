import { generateId } from "./id";

export function addReminderToFolder(folders, folderId, reminder) {
  return folders.map((folder) => {
    if (folder.id === folderId) {
      return {
        ...folder,
        reminders: [
          ...(folder.reminders || []),
          {
            id: generateId("rem"),
            text: reminder.text,
            time: reminder.time,
            sound: reminder.sound || "alarm1.mp3",
            enabled: true,
            createdAt: Date.now()
          }
        ]
      };
    }

    return {
      ...folder,
      children: folder.children?.length
        ? addReminderToFolder(folder.children, folderId, reminder)
        : []
    };
  });
}

export function updateReminderInFolder(folders, folderId, reminderId, updated) {
  return folders.map((folder) => {
    if (folder.id === folderId) {
      return {
        ...folder,
        reminders: (folder.reminders || []).map((rem) =>
          rem.id === reminderId ? { ...rem, ...updated } : rem
        )
      };
    }

    return {
      ...folder,
      children: folder.children?.length
        ? updateReminderInFolder(folder.children, folderId, reminderId, updated)
        : []
    };
  });
}

export function deleteReminderFromFolder(folders, folderId, reminderId) {
  return folders.map((folder) => {
    if (folder.id === folderId) {
      return {
        ...folder,
        reminders: (folder.reminders || []).filter((r) => r.id !== reminderId)
      };
    }

    return {
      ...folder,
      children: folder.children?.length
        ? deleteReminderFromFolder(folder.children, folderId, reminderId)
        : []
    };
  });
}