import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ---------------- STYLES ---------------- */
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e5e7eb",
  },

  card: {
    width: 520,
    padding: 30,
    background: "#ffffff",
    borderRadius: 8,
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
  },

  topLinks: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
    fontSize: 14,
    marginBottom: 10,
  },

  title: {
    textAlign: "center",
    marginBottom: 25,
    color: "#2563eb",
  },

  formGrid: {
  display: "grid",
  gridTemplateColumns: "120px 1fr",
  rowGap: 14,
  columnGap: 12,
  alignItems: "center",
},


  label: {
  textAlign: "right",
  fontWeight: 600,
  color: "#374151",
},



  input: {
    backgroundColor: "#f9fafb",
    color: "#111827",
  height: 36,
  padding: "0 10px",
  border: "1px solid #9ca3af",
  borderRadius: 4,
  fontSize: 14,
},


  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 22,
  },

  loginBtn: {
    padding: "8px 18px",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    borderRadius: 6,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },

  resetBtn: {
    padding: "8px 18px",
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    border: "none",
    color: "#6b7280",
    //cursor: "not-allowed",
  },

  cancelBtn: {
    padding: "8px 18px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    borderRadius: 6,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },

  registerRow: {
    color: "#374151",
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
    gap: 6,
    fontSize: 14,
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
    textDecoration: "underline",
  },

  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
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
