import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/dashboard");
    } catch (error) {
      setErro("Email ou senha inválidos.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Entrar</h2>

        {erro && <p style={styles.erro}>{erro}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Entrar
        </button>

        <p style={styles.linkText}>
          Não tem uma conta?{" "}
          <Link to="/signup" style={styles.link}>
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a", // azul escuro
  },
  form: {
    background: "#1e293b", // fundo do form
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    width: "300px",
  },
  title: {
    color: "#fff",
    marginBottom: "1rem",
    textAlign: "center",
  },
  input: {
    padding: "10px",
    marginBottom: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  erro: {
    color: "red",
    marginBottom: "1rem",
    textAlign: "center",
  },
  linkText: {
    marginTop: "1rem",
    color: "#fff",
    textAlign: "center",
    fontSize: "0.9rem",
  },
  link: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;
