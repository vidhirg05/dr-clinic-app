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

  const handleChange = (e: any) => {
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
      <h3>Change Password</h3>

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
        Change Password
      </button>
    </div>
  </div>
);
}
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const popupStyle: React.CSSProperties = {
  width: 420,
  padding: 28,
  background: "#ffffff",
  color: "#111827",
  textAlign: "center",
  borderRadius: 12,
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
};

const inputStyle: React.CSSProperties = {
  width: "90%",
  height: 40,
  marginBottom: 12,
  color: "#111827",
  padding: "0 12px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  background: "#f9fafb",
  fontSize: 14,
};

const btnStyle: React.CSSProperties = {
  marginTop: 14,
  height: 42,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};
const errorStyle: React.CSSProperties = {
  color: "#dc2626",
  fontSize: 13,
  marginBottom: 6,
};