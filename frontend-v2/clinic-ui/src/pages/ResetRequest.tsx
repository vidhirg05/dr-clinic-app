import { useState } from "react";
import { API_URL } from "../config/api";

export default function ResetRequest() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Request failed");
        return;
      }

      setSuccess("Reset link sent to email");

      setTimeout(() => {
        window.close();
      }, 2000);
    } catch {
      setError("Server error");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h3>Reset Password</h3>

      <input
        placeholder="Registered Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <button onClick={submit} style={{ marginTop: 12 }}>
        Submit
      </button>
    </div>
  );
}
