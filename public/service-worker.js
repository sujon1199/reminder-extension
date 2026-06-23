const APP_DATA_KEY = "reminder_extension_data";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Reminder extension installed");
});

/**
 * Helper: app data load
 */
async function getAppData() {
  const result = await chrome.storage.local.get([APP_DATA_KEY]);
  return (
    result[APP_DATA_KEY] || {
      folders: [
        {
          id: "root",
          name: "Root",
          type: "folder",
          notes: [],
          reminders: [],
          children: []
        }
      ]
    }
  );
}

/**
 * Recursively search reminder by ID
 */
function findReminderByIdInFolders(folders, reminderId) {
  for (const folder of folders) {
    const found = (folder.reminders || []).find((r) => r.id === reminderId);
    if (found) return found;

    if (folder.children?.length) {
      const childFound = findReminderByIdInFolders(folder.children, reminderId);
      if (childFound) return childFound;
    }
  }
  return null;
}

/**
 * Create reminder alarm
 */
async function createReminderAlarm(reminder) {
  const when = new Date(reminder.time).getTime();

  if (Number.isNaN(when) || when <= Date.now()) {
    console.warn("Invalid reminder time");
    return;
  }

  await chrome.alarms.create(`reminder_${reminder.id}`, {
    when
  });
}

/**
 * Snooze reminder
 */
async function createSnoozeReminder({ reminderId, text, sound, minutes = 5 }) {
  const when = Date.now() + minutes * 60 * 1000;
  await chrome.alarms.create(`snooze_${reminderId}_${Date.now()}`, { when });

  await chrome.storage.local.set({
    [`snooze_${reminderId}`]: {
      reminderId,
      text,
      sound,
      time: when
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.type === "CREATE_REMINDER_ALARM") {
        await createReminderAlarm(message.payload);
        sendResponse({ success: true });
        return;
      }

      if (message.type === "SNOOZE_REMINDER") {
        await createSnoozeReminder(message.payload);
        sendResponse({ success: true });
        return;
      }

      sendResponse({ success: false, message: "Unknown message type" });
    } catch (error) {
      console.error(error);
      sendResponse({ success: false, error: error.message });
    }
  })();

  return true;
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  try {
    // normal reminder
    if (alarm.name.startsWith("reminder_")) {
      const reminderId = alarm.name.replace("reminder_", "");
      const data = await getAppData();
      const reminder = findReminderByIdInFolders(data.folders, reminderId);

      if (!reminder || !reminder.enabled) return;

      const reminderUrl =
        chrome.runtime.getURL("reminder.html") +
        `?id=${encodeURIComponent(reminder.id)}` +
        `&text=${encodeURIComponent(reminder.text)}` +
        `&sound=${encodeURIComponent(reminder.sound || "alarm1.mp3")}`;

      await chrome.windows.create({
        url: reminderUrl,
        type: "popup",
        width: 1280,
        height: 900,
        focused: true
      });

      return;
    }

    // snooze reminder
    if (alarm.name.startsWith("snooze_")) {
      const parts = alarm.name.split("_");
      const reminderId = parts[1];
      const snoozeKey = `snooze_${reminderId}`;

      const res = await chrome.storage.local.get([snoozeKey]);
      const snoozeData = res[snoozeKey];

      if (!snoozeData) return;

      const reminderUrl =
        chrome.runtime.getURL("reminder.html") +
        `?id=${encodeURIComponent(snoozeData.reminderId)}` +
        `&text=${encodeURIComponent(snoozeData.text)}` +
        `&sound=${encodeURIComponent(snoozeData.sound || "alarm1.mp3")}`;

      await chrome.windows.create({
        url: reminderUrl,
        type: "popup",
        width: 1280,
        height: 900,
        focused: true
      });
    }
  } catch (error) {
    console.error("Alarm error:", error);
  }
});