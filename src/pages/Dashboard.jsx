import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Caminho relativo para o Sidebar
import { useAuth } from "../context/AuthContext";
import { FaBars } from "react-icons/fa"; // Certifique-se de ter 'react-icons' instalado

// Presumindo que Agenda, Supermercado e Planejamento estão na mesma pasta que Dashboard.jsx
import Agenda from "./Agenda";
import Supermercado from "./Supermercado";
import Planejamento from "./Planejamento";

function Dashboard() {
  // Estado para controlar a largura da janela, conforme sugerido pelo Copilot
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    // console.log("Listener de resize adicionado. Largura inicial:", window.innerWidth); // Debug removido
    return () => {
      window.removeEventListener("resize", handleResize);
      // console.log("Listener de resize removido."); // Debug removido
    };
  }, []);

  // Estado para controlar se a sidebar está aberta/fechada
  // Depende de windowWidth agora
  const [open, setOpen] = useState(windowWidth >= 768);

  useEffect(() => {
    // Atualiza o estado 'open' quando a largura da janela muda
    const newOpenState = windowWidth >= 768;
    // console.log(`Window width: ${windowWidth}, Sidebar should be open: ${newOpenState}`); // Debug removido
    setOpen(newOpenState);
  }, [windowWidth]); // Reage às mudanças em windowWidth

  // Estado para qual página está selecionada na sidebar
  const [selectedPage, setSelectedPage] = useState("agenda");

  // Contexto de autenticação para logout e usuário
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Redireciona para o login se o usuário não estiver autenticado
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Função que renderiza o componente da página selecionada
  const renderPage = () => {
    switch (selectedPage) {
      case "agenda":
        return <Agenda />;
      case "supermercado":
        return <Supermercado />;
      case "planejamento":
        return <Planejamento />;
      default:
        return <Agenda />;
    }
  };

  const sidebarWidth = 240; // Largura fixa da sidebar em pixels

  return (
    <div style={styles.container}>
      {/* Botão Hamburguer - Visível APENAS em telas menores */}
      {windowWidth < 768 && ( // Apenas renderiza se a tela for pequena
        <button
          onClick={() => {
            setOpen(!open);
            // console.log("Botão hambúrguer clicado! Sidebar aberta:", !open); // Debug removido
          }}
          style={styles.burger} // Volta para os estilos padrões do botão
        >
          <FaBars />
        </button>
      )}

      <Sidebar
        isOpen={open}
        close={() => setOpen(false)}
        setSelectedPage={setSelectedPage}
        logout={logout}
      />

      <main
        style={{
          ...styles.main,
          marginLeft: (open && windowWidth >= 768) ? `${sidebarWidth}px` : "0px",
          transition: "margin-left 0.3s ease",
          paddingLeft: (!open && windowWidth < 768) ? "60px" : "2rem",
        }}
      >
        {renderPage()}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f6fa",
  },
  burger: {
    position: "fixed",
    top: "16px",
    left: "16px",
    fontSize: "28px",
    background: "#ecf0f1", // Cor de fundo padrão do botão
    border: "none",
    color: "#2c3e50", // Cor do ícone padrão
    cursor: "pointer",
    padding: "8px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 9999, // Mantém um z-index alto, que é bom para elementos fixos
  },
  main: {
    flex: 1,
    padding: "2rem",
    backgroundColor: "#f5f6fa",
  },
};

export default Dashboard;