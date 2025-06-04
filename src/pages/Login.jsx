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
    background: "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)", // gradiente
  },
  form: {
    background: "rgba(30,41,59,0.95)", // leve transparência
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    display: "flex",
    flexDirection: "column",
    width: "320px",
    backdropFilter: "blur(4px)", // efeito glassmorphism
  },
  title: {
    color: "#fff",
    marginBottom: "1rem",
    textAlign: "center",
    letterSpacing: "1px",
    fontWeight: "bold",
    fontSize: "2rem",
  },
  input: {
    padding: "12px",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #60a5fa",
    outline: "none",
    fontSize: "1rem",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "background 0.3s, transform 0.2s",
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
    fontSize: "0.95rem",
  },
  link: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "color 0.2s",
  },
};

export default Login;