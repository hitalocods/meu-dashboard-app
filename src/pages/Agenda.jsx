import { useState } from "react";

export default function Agenda() {
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { text: input.trim(), date, time, done: false }]);
    setInput("");
    setDate("");
    setTime("");
  };

  const toggleTask = (index) => {
    setTasks(tasks.map((task, i) => i === index ? { ...task, done: !task.done } : task));
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // Alinha no topo
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          padding: "2rem",
          maxWidth: 600,
          width: "100%",
          marginTop: "2rem", // Espaço do topo
        }}
      >
        <h2 style={{ marginBottom: 24 }}>📅 Agenda</h2>
        <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              flex: 2,
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
            placeholder="Nova tarefa"
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 6,
              border: "none",
              background: "#2c3e50",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Adicionar
          </button>
        </form>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                background: "#f5f6fa",
                borderRadius: 6,
                padding: "0.5rem 1rem",
                textDecoration: task.done ? "line-through" : "none",
                color: task.done ? "#888" : "#000",
              }}
            >
              <span style={{ flex: 1 }}>{task.text}</span>
              {task.date && <span style={{ marginLeft: 8, color: "#888", fontSize: 13 }}>{task.date}</span>}
              {task.time && <span style={{ marginLeft: 8, color: "#888", fontSize: 13 }}>{task.time}</span>}
              <button
                onClick={() => toggleTask(i)}
                style={{
                  marginRight: 6,
                  background: "#27ae60",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "0.3rem 0.7rem",
                  cursor: "pointer",
                }}
              >
                ✅
              </button>
              <button
                onClick={() => removeTask(i)}
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "0.3rem 0.7rem",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
