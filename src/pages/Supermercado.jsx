import React, { useState, useEffect } from "react";
// AJUSTE AQUI: Use "../firebase" para subir um nível de pasta e encontrar o firebase.js
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
  serverTimestamp
} from "firebase/firestore";

export default function Supermercado() {
  const [input, setInput] = useState("");
  const [listDate, setListDate] = useState(() => {
    const savedDate = localStorage.getItem('supermercadoListDate');
    if (savedDate) {
      return savedDate;
    } else {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    }
  });
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem('supermercadoListDate', listDate);
  }, [listDate]);

  // ============== 1. CARREGAR ITENS DO FIRESTORE (TEMPO REAL) ==============
  useEffect(() => {
    if (!user) {
      setItens([]);
      setLoading(false);
      return;
    }

    const userItensCollectionRef = collection(db, "users", user.uid, "supermercado");
    
    const q = query(userItensCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itensData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItens(itensData);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Erro ao carregar itens do supermercado:", err);
      setError("Erro ao carregar lista de compras. Tente novamente.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // ============== 2. ADICIONAR NOVO ITEM AO FIRESTORE ==============
  const addItem = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Por favor, digite o item.");
      return;
    }
    if (!user) {
      setError("Você precisa estar logado para adicionar itens.");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "supermercado"), {
        text: input.trim(),
        done: false,
        createdAt: serverTimestamp() // Adiciona um timestamp do servidor
      });
      setInput("");
      setError(null);
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      setError("Erro ao adicionar item. Tente novamente.");
    }
  };

  // ============== 3. MARCAR/DESMARCAR ITEM NO FIRESTORE ==============
  const toggleItem = async (itemId, currentDoneStatus) => {
    if (!user) {
      setError("Você precisa estar logado para atualizar itens.");
      return;
    }
    try {
      const itemDocRef = doc(db, "users", user.uid, "supermercado", itemId);
      await updateDoc(itemDocRef, {
        done: !currentDoneStatus
      });
      setError(null);
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      setError("Erro ao atualizar item. Tente novamente.");
    }
  };

  // ============== 4. REMOVER ITEM DO FIRESTORE ==============
  const removerItem = async (itemId) => {
    if (!user) {
      setError("Você precisa estar logado para remover itens.");
      return;
    }
    try {
      const itemDocRef = doc(db, "users", user.uid, "supermercado", itemId);
      await deleteDoc(itemDocRef);
      setError(null);
    } catch (err) {
      console.error("Erro ao remover item:", err);
      setError("Erro ao remover item. Tente novamente.");
    }
  };

  // ========================== RENDERIZAÇÃO ==========================
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#2c3e50' }}>Carregando Lista de Compras...</div>;
  }

  // CORREÇÃO AQUI: Note a chave extra '}' antes de '>'
  if (!user) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>Por favor, faça login para ver sua Lista de Compras.</div>;
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
        <h2 style={{ marginBottom: 24, fontSize: "1.8rem", color: "#2c3e50" }}>🛒 Lista de Compras Mensal</h2>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <label htmlFor="listMonth" style={{ color: "#555", fontWeight: "bold" }}>Mês da Lista:</label>
          <input
            type="month"
            id="listMonth"
            value={listDate}
            onChange={(e) => setListDate(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: "1rem",
              flex: 1,
              maxWidth: "150px"
            }}
          />
        </div>

        <form onSubmit={addItem} style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Novo item para a lista"
            style={{
              flex: 2,
              minWidth: "150px",
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
          {itens.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#555' }}>Nenhum item na lista de compras ainda.</p>
          )}
          {itens.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                background: item.done ? "#e0ffe0" : "#f5f6fa",
                borderRadius: 6,
                padding: "0.5rem 1rem",
                textDecoration: item.done ? "line-through" : "none",
                color: item.done ? "#888" : "#000",
                flexWrap: "wrap",
              }}
            >
              <span style={{ flex: 1, minWidth: "100px" }}>{item.text}</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
                <button
                  onClick={() => toggleItem(item.id, item.done)}
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
                  onClick={() => removerItem(item.id)}
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