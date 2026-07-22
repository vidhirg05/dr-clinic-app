import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ---------------- STYLES ---------------- */
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Light, neutral background to reduce eye strain
    backgroundColor: "#F1F5F9", 
    fontFamily: "'Inter', sans-serif",
  },

  card: {
    width: 480, // Slightly narrower for a tighter look
    padding: "40px",
    background: "#FFFFFF", // Pure white card on gray background looks cleaner
    borderRadius: 16, // More rounded for a modern feel
    // Softer, larger shadow for a "floating" effect
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
  },

  topLinks: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
    fontSize: 13,
    marginBottom: 20,
    color: "#64748B",
  },

  title: {
    textAlign: "center",
    marginBottom: 32,
    color: "#0F172A", // Deep Navy instead of bright blue
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "-0.025em",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr", // Stacked layout is more modern for Login
    rowGap: 18,
    alignItems: "center",
  },

  label: {
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
    color: "#475569", // Muted slate
    marginBottom: "4px",
    display: "block",
  },

  input: {
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
    height: 42, // Slightly taller for better touch/click targets
    padding: "0 14px",
    border: "1px solid #E2E8F0",
    borderRadius: 8, // Matching card roundedness
    fontSize: "15px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  buttonRow: {
    display: "flex",
    flexDirection: "column", // Stack buttons for a cleaner mobile-style look
    gap: 12,
    marginTop: 30,
  },

  loginBtn: {
    padding: "12px",
    backgroundColor: "#0F172A", // Dark Navy (Professional/Authoritative)
    color: "#ffffff",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    transition: "background 0.2s",
  },

  resetBtn: {
    padding: "10px",
    backgroundColor: "transparent",
    borderRadius: 8,
    border: "1px solid #E2E8F0",
    color: "#64748B",
    fontSize: "14px",
    cursor: "pointer",
  },

  // Cancel buttons in login are rare, but if kept, make it a text link or muted
  cancelBtn: {
    padding: "10px",
    backgroundColor: "transparent",
    color: "#94A3B8",
    borderRadius: 8,
    border: "none",
    fontSize: "13px",
    cursor: "pointer",
  },

  registerRow: {
    color: "#64748B",
    marginTop: 24,
    display: "flex",
    justifyContent: "center",
    gap: 6,
    fontSize: 14,
  },

  link: {
    color: "#2563EB",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none", // Underlines feel cluttered; bolding is cleaner
  },

  error: {
    color: "#E11D48", // Softer red
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
    backgroundColor: "#FFF1F2", // Added background for visibility
    padding: "8px",
    borderRadius: "6px",
  },
};

/* ---------------- COMPONENT ---------------- */
export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.identifier.trim()) return "Phone number, email, or username is required";
    if (form.password.length < 8)
      return "Password must be at least 8 characters";
    return "";
  };

  const handleLogin = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await window.api.loginDoctor({
       identifier: form.identifier,
        password: form.password,
      });

      if (res && (res.success || res.doctor)) {
        if (res.doctor) {
          localStorage.setItem("doctor", JSON.stringify(res.doctor));
        }

        if (window.api.expandWindow) {
          await window.api.expandWindow();
        }

        navigate("/home");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Login failed");
    }
  };

  const openReset = () => window.api.openResetWindow();
  const openChange = () => window.api.openChangeWindow();

  const handleReset = () => { setForm({ identifier: "", password: "" }); setError(""); };
  const handleCancel = () => window.api.closeApp();

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* TOP LINKS */}
        <div style={styles.topLinks}>
          {/*<span style={styles.link} onClick={openReset}>
            Reset Password
          </span>*/}
          <span style={styles.link} onClick={openChange}>
            Change Password
          </span>
        </div>

       <h2 style={styles.title}>MyClinic Login</h2>

        <div style={styles.formGrid}>

          {/* USERNAME */}
          <label style={styles.label}>Login : </label>
          <input
            name="identifier"
            placeholder="email or mobile no"
            value={form.identifier}
            onChange={handleChange}
            style={styles.input}
          />

          {/* PASSWORD */}
          <label style={styles.label}>Password :</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

        </div>



        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonRow}>
          <button onClick={handleLogin} style={styles.loginBtn}>
            Login
          </button>

          <button style={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>

          <button onClick={handleCancel} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>

        <div style={styles.registerRow}>
          <span>Don't have an account?</span>
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}
