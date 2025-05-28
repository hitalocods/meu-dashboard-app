import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, close, selectedPage, setSelectedPage, logout }) {
  const menuItems = [
    { key: "agenda", label: "📅 Agenda", to: "/dashboard/agenda" },
    { key: "supermercado", label: "📈 Planejamento", to: "/dashboard/planejamento" },
  ];

  return (
    <aside
      style={{
        ...styles.sidebar,
        left: isOpen ? 0 : -240,
      }}
    >
      <h2 style={styles.logo}>Meu Painel</h2>

      <div>
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setSelectedPage(item.key);
                close();
              }}
              style={{
                padding: "12px 20px",
                display: "block",
                width: "100%",
                textAlign: "left",
                color: selectedPage === item.key ? "#fff" : "#bdc3c7",
                textDecoration: "none",
                background: selectedPage === item.key ? "#34495e" : "transparent",
                transition: "background 0.3s, color 0.3s",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "inherit",
                outline: "none",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button style={styles.logout} onClick={logout}>
        ⏏️ Sair
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: 240,
    padding: "0rem 1rem", // diminua o padding superior
    backgroundColor: "#2c3e50",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "left 0.3s ease",
    zIndex: 1000,
    boxShadow: "2px 0 6px rgba(0,0,0,0.2)",
  },
  logo: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: 22,
    fontWeight: 600,
  },
  nav: { display: "flex", flexDirection: "column", gap: 12 },
  logout: {
    color: "#e74c3c",
    textDecoration: "none",
    fontSize: 18,
    padding: "0.4rem 0.6rem",
    borderRadius: 6,
    alignSelf: "center", // <-- centraliza o botão
  },
};
