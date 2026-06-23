const APP_DATA_KEY = "reminder_extension_data";

const defaultData = {
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
};

export async function getAppData() {
  return new Promise((resolve) => {
    chrome.storage.local.get([APP_DATA_KEY], (result) => {
      resolve(result[APP_DATA_KEY] || defaultData);
    });
  });
}

export async function saveAppData(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [APP_DATA_KEY]: data }, () => {
      resolve(true);
    });
  });
}