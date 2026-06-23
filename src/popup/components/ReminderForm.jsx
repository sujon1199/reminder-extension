import React, { useState } from "react";

export default function ReminderForm({ onSave }) {
  const [text, setText] = useState("");
  const [time, setTime] = useState("");
  const [sound, setSound] = useState("alarm1.mp3");

  function handleSubmit(e) {
    e.preventDefault();

    if (!text.trim() || !time) {
      alert("Reminder text এবং time দুটোই লাগবে");
      return;
    }

    const reminderTime = new Date(time).getTime();
    if (reminderTime <= Date.now()) {
      alert("Future time select করো");
      return;
    }

    onSave({
      text: text.trim(),
      time,
      sound
    });

    setText("");
    setTime("");
    setSound("alarm1.mp3");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="form-label">Reminder text</label>
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Meeting with client"
        />
      </div>

      <div className="form-row">
        <label className="form-label">Date & Time</label>
        <input
          className="input"
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label className="form-label">Sound</label>
        <select
          className="select"
          value={sound}
          onChange={(e) => setSound(e.target.value)}
        >
          <option value="alarm1.mp3">Alarm 1</option>
          <option value="alarm2.mp3">Alarm 2</option>
        </select>
      </div>

      <button className="primary-btn" type="submit">
        Set Reminder
      </button>
    </form>
  );
}