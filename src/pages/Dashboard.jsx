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

  // Estado para o modo escuro/claro
  const [darkMode, setDarkMode] = useState(true);

  // Coloque styles AQUI dentro do componente!
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(120deg, #1e293b 60%, #334155 100%)"
        : "linear-gradient(120deg, #f5f6fa 60%, #dbeafe 100%)",
      gap: windowWidth >= 768 ? "1.5rem" : 0, // Espaço entre Sidebar e Main
      paddingLeft: windowWidth < 768 ? "0.5rem" : "2rem",   // <-- Adicione isto
      paddingRight: windowWidth < 768 ? "0.5rem" : "2rem",  // <-- E isto
    },
    burger: {
      position: "fixed",
      top: "16px",
      left: "16px",
      fontSize: "28px",
      background: "#ecf0f1",
      border: "none",
      color: "#2c3e50",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      zIndex: 9999,
      transition: "background 0.2s, box-shadow 0.2s",
    },
    main: {
      flex: 1,
      padding: "2.5rem 2rem",
      background: darkMode
        ? "rgba(30,41,59,0.95)"
        : "rgba(255,255,255,0.75)",
      borderRadius: "24px",
      marginTop: "2.5rem", // só margem superior
      // Remova margin: "2.5rem",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      border: "1.5px solid rgba(255,255,255,0.35)",
      backdropFilter: "blur(8px)",
      transition: "margin-left 0.3s ease, box-shadow 0.3s, background 0.3s, border 0.3s",
      minHeight: "calc(100vh - 5rem)",
      color: darkMode ? "#fff" : "#222",
    },
    darkModeButton: {
      position: "fixed",
      top: "16px",
      right: "16px",
      fontSize: "18px",
      background: "transparent",
      border: "none",
      color: "#2c3e50",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      zIndex: 9999,
      transition: "color 0.2s",
    },
  };

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
        darkMode={darkMode} // Passando o estado darkMode para a Sidebar
      />

      <main
        style={{
          ...styles.main,
          paddingLeft: "2rem",
          paddingRight: windowWidth < 768 ? "1rem" : "2rem", // Adicione este padding
        }}
      >
        {renderPage()}
        {/* Botão para alternar entre modo escuro e claro */}
        <button onClick={() => setDarkMode(!darkMode)} style={styles.darkModeButton}>
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </main>
    </div>
  );
}

export default Dashboard;