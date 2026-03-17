import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../config/api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  if (!token) {
    return <div>Invalid or expired reset link</div>;
  }

  const submit = async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    alert("Password reset successfully");
    window.location.href = "/#/login";
  };

  return (
    <div>
      <h3>Reset Password</h3>

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button onClick={submit}>Reset Password</button>
    </div>
  );
}
