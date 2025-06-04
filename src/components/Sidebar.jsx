import React from "react";

export default function Sidebar({ isOpen, close, selectedPage, setSelectedPage, logout }) {
  const menuItems = [
    { key: "agenda", label: "📅 Agenda", to: "/dashboard/agenda" },
    { key: "planejamento", label: "📈 Planejamento", to: "/dashboard/planejamento" },
    { key: "supermercado", label: "🛒 Supermercado", to: "/dashboard/supermercado" },
  ];

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh", // Garante que a sidebar ocupe 100% da altura da tela
        width: 240,
        padding: "2rem 1rem", // Padding superior e inferior para o conteúdo
        backgroundColor: "#2c3e50", // Cor de fundo da sidebar
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Empurra o logo para o topo e o botão de sair para o final
        alignItems: "center", // Centraliza o conteúdo horizontalmente
        zIndex: 1000, // Z-index da sidebar (menor que o botão de hambúrguer temporário)
        boxShadow: "2px 0 6px rgba(0,0,0,0.2)",
        // Transição e posicionamento responsivo:
        transform: isOpen ? "translateX(0)" : (window.innerWidth < 768 ? "translateX(-100%)" : "translateX(0)"),
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {/* Título "Meu Painel" */}
      <h2
        style={{
          color: "#fff",
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
              if (window.innerWidth < 768) { // Fecha a sidebar em telas menores ao clicar
                close();
              }
            }}
            style={{
              padding: "12px 20px",
              display: "block",
              width: "100%",
              textAlign: "left",
              color: selectedPage === item.key ? "#fff" : "#bdc3c7", // Cor do texto
              textDecoration: "none",
              background: selectedPage === item.key ? "#34495e" : "transparent", // Cor de fundo do item selecionado
              transition: "background 0.3s, color 0.3s",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "inherit",
              outline: "none",
              marginBottom: "8px", // Espaçamento entre os botões do menu
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
            color: "#fff", // Cor branca para o texto do botão
            backgroundColor: "#e74c3c", // Fundo vermelho para destaque
            textDecoration: "none",
            fontSize: 18,
            padding: "0.8rem 1.5rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            textAlign: 'center',
            width: 'calc(100% - 2rem)', // Ocupa a largura total menos 1rem de padding de cada lado
            maxWidth: '200px', // Limite máximo para a largura do botão
          }}
        >
          ⏏️ Sair
        </button>
      </div>
    </aside>
  );
}