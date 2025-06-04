import React, { useState, useEffect } from "react";
// AJUSTE AQUI: O caminho é "../firebase" se o Planejamento.jsx estiver na pasta 'pages'
import { db } from "../firebase"; 
import { useAuth } from "../context/AuthContext"; 
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp // Para adicionar um timestamp de criação
} from "firebase/firestore";

export default function Planejamento() {
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [plans, setPlans] = useState([]); // Renomeado de 'tasks' para 'plans' para clareza
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  // ============== 1. CARREGAR PLANOS DO FIRESTORE (TEMPO REAL) ==============
  useEffect(() => {
    if (!user) {
      setPlans([]);
      setLoading(false);
      return;
    }

    // Monta o caminho para a coleção de planos do usuário
    // users -> UID_do_usuário -> planejamento
    const userPlansCollectionRef = collection(db, "users", user.uid, "planejamento");
    
    // Query para pegar os planos e ordená-los pela data e hora
    const q = query(userPlansCollectionRef, orderBy("date", "asc"), orderBy("time", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlans(plansData);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Erro ao carregar planos:", err);
      setError("Erro ao carregar planos. Tente novamente.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // ============== 2. ADICIONAR NOVO PLANO AO FIRESTORE ==============
  const addPlan = async (e) => {
    e.preventDefault();
    if (!input.trim() || !date) {
      setError("Por favor, preencha o plano e a data.");
      return;
    }
    if (!user) {
      setError("Você precisa estar logado para adicionar planos.");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "planejamento"), {
        text: input.trim(),
        date: date,
        time: time,
        done: false,
        createdAt: serverTimestamp() // Adiciona um timestamp do servidor
      });
      setInput("");
      setDate("");
      setTime("");
      setError(null);
    } catch (err) {
      console.error("Erro ao adicionar plano:", err);
      setError("Erro ao adicionar plano. Tente novamente.");
    }
  };

  // ============== 3. MARCAR/DESMARCAR PLANO NO FIRESTORE ==============
  const togglePlan = async (planId, currentDoneStatus) => {
    if (!user) {
      setError("Você precisa estar logado para atualizar planos.");
      return;
    }
    try {
      const planDocRef = doc(db, "users", user.uid, "planejamento", planId);
      await updateDoc(planDocRef, {
        done: !currentDoneStatus
      });
      setError(null);
    } catch (err) {
      console.error("Erro ao atualizar plano:", err);
      setError("Erro ao atualizar plano. Tente novamente.");
    }
  };

  // ============== 4. REMOVER PLANO DO FIRESTORE ==============
  const removePlan = async (planId) => {
    if (!user) {
      setError("Você precisa estar logado para remover planos.");
      return;
    }
    try {
      const planDocRef = doc(db, "users", user.uid, "planejamento", planId);
      await deleteDoc(planDocRef);
      setError(null);
    } catch (err) {
      console.error("Erro ao remover plano:", err);
      setError("Erro ao remover plano. Tente novamente.");
    }
  };

  // ========================== RENDERIZAÇÃO ==========================
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#2c3e50' }}>Carregando Planejamento...</div>;
  }

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>Por favor, faça login para ver seu Planejamento.</div>;
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
        <h2 style={{ marginBottom: 24, fontSize: "1.8rem", color: "#2c3e50" }}>🗓️ Planejamento</h2>
        
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={addPlan} style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
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
            placeholder="Novo plano"
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
          {plans.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#555' }}>Nenhum plano na agenda ainda.</p>
          )}
          {plans.map((plan) => (
            <li
              key={plan.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                background: plan.done ? "#e0ffe0" : "#f5f6fa",
                borderRadius: 6,
                padding: "0.5rem 1rem",
                textDecoration: plan.done ? "line-through" : "none",
                color: plan.done ? "#888" : "#000",
                flexWrap: "wrap",
              }}
            >
              <span style={{ flex: 1, minWidth: "100px" }}>{plan.text}</span>
              {plan.date && <span style={{ marginLeft: 8, color: "#888", fontSize: 13 }}>{plan.date}</span>}
              {plan.time && <span style={{ marginLeft: 8, color: "#888", fontSize: 13 }}>{plan.time}</span>}
              <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
                <button
                  onClick={() => togglePlan(plan.id, plan.done)}
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
                  onClick={() => removePlan(plan.id)}
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