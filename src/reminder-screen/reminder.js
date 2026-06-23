import "./reminder.css";

const root = document.getElementById("reminder-root");

const params = new URLSearchParams(window.location.search);
const reminderId = params.get("id") || "";
const text = params.get("text") || "Reminder!";
const sound = params.get("sound") || "alarm1.mp3";

root.innerHTML = `
  <div class="reminder-overlay">
    <div class="reminder-card">
      <div class="reminder-badge">⏰ Reminder Alert</div>
      <h1 class="reminder-title">${escapeHtml(text)}</h1>
      <p class="reminder-subtitle">Your scheduled reminder is ringing now.</p>

      <div class="reminder-actions">
        <button id="dismissBtn" class="dismiss-btn">Dismiss</button>
        <button id="snoozeBtn" class="snooze-btn">Snooze 5 min</button>
      </div>

      <audio id="reminderAudio" autoplay loop>
        <source src="${chrome.runtime.getURL(`sounds/${sound}`)}" type="audio/mpeg" />
      </audio>
    </div>
  </div>
`;

const audio = document.getElementById("reminderAudio");
const dismissBtn = document.getElementById("dismissBtn");
const snoozeBtn = document.getElementById("snoozeBtn");

dismissBtn.addEventListener("click", () => {
  if (audio) audio.pause();
  window.close();
});

snoozeBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({
    type: "SNOOZE_REMINDER",
    payload: {
      reminderId,
      text,
      sound,
      minutes: 5
    }
  });

  if (audio) audio.pause();
  window.close();
});

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}