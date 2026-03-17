import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../config/api";

export default function NewPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = async () => {
    if (password.length < 8) return alert("Min 8 characters");
    if (password !== confirm) return alert("Passwords do not match");

    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    if (res.ok) {
      alert("Password reset successful");
      navigate("/login");
    } else {
      alert("Invalid or expired link");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Set New Password</h2>
      <input type="password" placeholder="New password" onChange={e => setPassword(e.target.value)} />
      <input type="password" placeholder="Confirm password" onChange={e => setConfirm(e.target.value)} />
      <button onClick={submit}>Reset</button>
    </div>
  );
}
