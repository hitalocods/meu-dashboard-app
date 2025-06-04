import React from "react";

export default function Sidebar({ isOpen, close, selectedPage, setSelectedPage, logout, darkMode }) {
  const menuItems = [
    { key: "agenda", label: "📅 Agenda", to: "/dashboard/agenda" },
    { key: "planejamento", label: "📈 Planejamento", to: "/dashboard/planejamento" },
    { key: "supermercado", label: "🛒 Supermercado", to: "/dashboard/supermercado" },
  ];

  return (
    <aside
      style={{
        minHeight: "calc(100vh - 5rem)", // Garante altura mínima igual ao painel
        height: "auto",                  // Permite crescer junto com o conteúdo
        width: window.innerWidth < 768 ? "100vw" : 240,
        padding: window.innerWidth < 768 ? "1.5rem 1rem" : "2rem 1rem",
        background: "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)", // sempre azul
        borderRadius: window.innerWidth < 768 ? 0 : "24px",
        border: window.innerWidth < 768 ? "none" : "1.5px solid rgba(255,255,255,0.35)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        backdropFilter: "blur(8px)",
        display: isOpen || window.innerWidth >= 768 ? "flex" : "none",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: window.innerWidth < 768 ? 0 : "2.5rem",    // alinhamento superior igual ao painel
        marginLeft: window.innerWidth < 768 ? 0 : "2.5rem",   // alinhamento esquerdo igual ao painel
        position: window.innerWidth < 768 ? "fixed" : "static",
        top: 0,
        left: 0,
        zIndex: 2000,
        transition: "all 0.3s",
      }}
    >
      {/* Título "Meu Painel" */}
      <h2
        style={{
          color: "#fff", // Sempre branco para o título
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: 22,
          fontWeight: 600,
          width: "100%", // Ocupa a largura total para centralizar o texto
        }}
      >
        Meu Painel
      </h2>

      {/* Navegação Principal */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          flexGrow: 1, // Permite que a navegação ocupe o espaço restante
          overflowY: 'auto', // Adiciona scroll se houver muitos itens
          paddingBottom: '1rem', // Espaçamento antes do botão de sair
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setSelectedPage(item.key);
              if (window.innerWidth < 768) close();
            }}
            style={{
              padding: "12px 20px",
              display: "block",
              width: "100%",
              textAlign: "left",
              color: "#fff", // Sempre branco
              background: selectedPage === item.key
                ? "rgba(59,130,246,0.85)" // Destaque azul para o ativo
                : "transparent",
              transition: "background 0.3s, color 0.3s",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "inherit",
              outline: "none",
              marginBottom: "8px",
              fontWeight: selectedPage === item.key ? "bold" : "normal",
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Contêiner para o botão Sair - para centralização */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center', // Centraliza o botão horizontalmente
          paddingTop: '1rem', // Espaçamento acima do botão
        }}
      >
        {/* Botão Sair */}
        <button
          onClick={logout}
          style={{
            color: "#fff", // Sempre branco
            backgroundColor: "#ef4444",
            textDecoration: "none",
            fontSize: 18,
            padding: "0.8rem 1.5rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            textAlign: 'center',
            width: 'calc(100% - 2rem)',
            maxWidth: '200px',
          }}
        >
          ⏏️ Sair
        </button>
      </div>
    </aside>
  );
}