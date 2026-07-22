import { useState } from "react";
import { API_URL } from "../config/api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    doctorName: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.doctorName.trim()) return "Doctor name is required";
    if (!form.oldPassword) return "Old password is required";
    if (form.newPassword.length < 8)
      return "New password must be at least 8 characters";
    if (form.newPassword !== form.confirmPassword)
      return "Passwords do not match";
    if (form.oldPassword === form.newPassword)
      return "New password must be different from old password";
    return "";
  };

  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorName: form.doctorName,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to change password");
        return;
      }

      alert("Password changed successfully");
      window.close();
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        {/* Updated Heading Section */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>Update Password</h2>
          <p style={subtitleStyle}>Ensure your account stays secure</p>
        </div>

        <input
          name="doctorName"
          placeholder="Doctor Name"
          value={form.doctorName}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={form.oldPassword}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          style={inputStyle}
        />

        {error && <div style={errorStyle}>{error}</div>}

        <button onClick={submit} style={btnStyle}>
          Update Password
        </button>

        <button onClick={() => window.close()} style={secondaryBtnStyle}>
          Cancel and Close
        </button>
      </div>
    </div>
  );
}

// --- Styles ---

const headerStyle: React.CSSProperties = {
  marginBottom: "24px",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#0F172A", // Deep Navy
  margin: 0,
  letterSpacing: "-0.02em",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#64748B", // Slate gray
  marginTop: "6px",
  marginInline: 0,
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.6)", 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(4px)", 
  zIndex: 1000,
};

const popupStyle: React.CSSProperties = {
  width: 400,
  padding: "32px",
  background: "#ffffff",
  borderRadius: 16,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  display: "flex",
  flexDirection: "column",
  fontFamily: "'Inter', sans-serif",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  marginBottom: 16,
  color: "#1E293B",
  padding: "0 14px",
  borderRadius: 8,
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  marginTop: "10px",
  height: "44px",
  background: "#0F172A",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "15px",
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  color: "#E11D48",
  fontSize: "13px",
  marginBottom: "12px",
  textAlign: "center",
  backgroundColor: "#FFF1F2",
  padding: "8px",
  borderRadius: "6px",
  fontWeight: 500,
};

const secondaryBtnStyle: React.CSSProperties = {
  marginTop: "16px",
  background: "transparent",
  color: "#64748B",
  border: "none",
  fontSize: "13px",
  cursor: "pointer",
  textDecoration: "none",
  fontWeight: 500,
};