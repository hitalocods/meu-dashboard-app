import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // <-- CORRIGIDO AQUI!
import { useAuth } from "../context/AuthContext";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

export default function Agenda() {
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const userTasksCollectionRef = collection(db, "users", user.uid, "agenda");
    const q = query(userTasksCollectionRef, orderBy("date", "asc"), orderBy("time", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Erro ao carregar tarefas:", err);
      setError("Erro ao carregar tarefas. Tente novamente.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim() || !date) {
      setError("Por favor, preencha a tarefa e a data.");
      return;
    }
    if (!user) {
      setError("Você precisa estar logado para adicionar tarefas.");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "agenda"), {
        text: input.trim(),
        date: date,
        time: time,
        done: false,
        createdAt: new Date()
      });
      setInput("");
      setDate("");
      setTime("");
      setError(null);
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
      setError("Erro ao adicionar tarefa. Tente novamente.");
    }
  };

  const toggleTask = async (taskId, currentDoneStatus) => {
    if (!user) {
      setError("Você precisa estar logado para atualizar tarefas.");
      return;
    }
    try {
      const taskDocRef = doc(db, "users", user.uid, "agenda", taskId);
      await updateDoc(taskDocRef, {
        done: !currentDoneStatus
      });
      setError(null);
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
      setError("Erro ao atualizar tarefa. Tente novamente.");
    }
  };

  const removeTask = async (taskId) => {
    if (!user) {
      setError("Você precisa estar logado para remover tarefas.");
      return;
    }
    try {
      const taskDocRef = doc(db, "users", user.uid, "agenda", taskId);
      await deleteDoc(taskDocRef);
      setError(null);
    } catch (err) {
      console.error("Erro ao remover tarefa:", err);
      setError("Erro ao remover tarefa. Tente novamente.");
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#2c3e50' }}>Carregando Agenda...</div>;
  }

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>Por favor, faça login para ver sua Agenda.</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "calc(100vh - 4rem)",
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
          marginTop: "2rem",
        }}
      >
        <h2 style={{ marginBottom: 24, fontSize: "1.8rem", color: "#2c3e50" }}>📅 Agenda</h2>
        
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              flex: 2,
              minWidth: "150px",
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
            placeholder="Nova tarefa"
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              flex: 1,
              minWidth: "120px",
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
            required
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              flex: 1,
              minWidth: "100px",
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: "1rem",
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
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            Adicionar
          </button>
        </form>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#555' }}>Nenhuma tarefa na agenda ainda.</p>
          )}
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                background: task.done ? "#e0ffe0" : "#f5f6fa",
                borderRadius: 6,
                padding: "0.5rem 1rem",
                textDecoration: task.done ? "line-through" : "none",
                color: task.done ? "#888" : "#000",
                flexWrap: "wrap",
              }}
            >
              <span style={{ flex: 1, minWidth: "100px" }}>{task.text}</span>
              {task.date && <span style={{ marginLeft: 8, color: "#888", fontSize: 13 }}>{task.date}</span>}
              {task.time && <span style={{ marginLeft: 8, color: "#888", fontSize: 13 }}>{task.time}</span>}
              <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
                <button
                  onClick={() => toggleTask(task.id, task.done)}
                  style={{
                    background: "#27ae60",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "0.3rem 0.7rem",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  ✅
                </button>
                <button
                  onClick={() => removeTask(task.id)}
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "0.3rem 0.7rem",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}