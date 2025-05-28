import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";



import { FaBars } from "react-icons/fa";

import Agenda from "./Agenda";
import Supermercado from "./Supermercado";
import Planejamento from "./Planejamento";

function Dashboard() {
  const [open, setOpen] = useState(true); // começa aberta
  const [selectedPage, setSelectedPage] = useState("agenda");

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

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

  return (
    <div style={styles.container}>
      <Sidebar isOpen={open} close={() => setOpen(false)} setSelectedPage={setSelectedPage} logout={logout} />
      <button onClick={() => setOpen(!open)} style={styles.burger}>
        <FaBars />
      </button>
      <main
        style={{
          ...styles.main,
          marginLeft: open ? "250px" : "0", // muda conforme sidebar
          transition: "margin-left 0.3s",   // animação suave
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
    height: "100vh",
  },
  burger: {
    position: "fixed",
    top: 16,
    left: 16,
    fontSize: 28,
    background: "none",
    border: "none",
    color: "#ffffff", // ✅ cor branca para aparecer na faixa azul
    zIndex: 1100,
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "2rem",
    background: "#f5f6fa",
  },
};

export default Dashboard;
