import React, { useState } from "react";

export default function Supermercado() {
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [itens, setItens] = useState([]);

  function addItem(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setItens([...itens, { text: input.trim(), date, time }]);
    setInput("");
    setDate("");
    setTime("");
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        padding: "2rem",
        maxWidth: 600,
        margin: "2rem auto",
      }}
    >
      <h2 style={{ marginBottom: 24 }}>Planejamento</h2>
      <form
        onSubmit={addItem}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Novo item"
          style={{
            flex: 2,
            padding: "0.5rem",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
          onChange={(e) => setTime(e.target.value)}
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
        {itens.map((item, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
              background: "#f5f6fa",
              borderRadius: 6,
              padding: "0.5rem 1rem",
            }}
          >
            <span style={{ flex: 1 }}>{item.text}</span>
            {item.date && (
              <span style={{ marginLeft: 8, color: "#888", fontSize: 13 }}>
                {item.date}
              </span>
            )}
            {item.time && (
              <span style={{ marginLeft: 8, color: "#888", fontSize: 13 }}>
                {item.time}
              </span>
            )}
            <button
              onClick={() => removerItem(idx)}
              style={{
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "0.3rem 0.7rem",
                cursor: "pointer",
              }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}