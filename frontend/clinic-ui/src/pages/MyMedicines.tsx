import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

type Medicine = {
  _id: string;
  name: string;
};

export default function MyMedicines() {
  const [medicineName, setMedicineName] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  /* LOAD MEDICINES */
  const loadMedicines = async () => {
    const res = await fetch(`${API_URL}/medicines`);
    const data = await res.json();
    setMedicines(data);
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  /* ADD MEDICINE */
  const addMedicine = async () => {
    if (!medicineName.trim()) return;

    await fetch(`${API_URL}/medicines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: medicineName }),
    });

    setMedicineName("");
    loadMedicines();
  };

  /* DELETE MEDICINE */
  const deleteMedicine = async (id: string) => {
    await fetch(`${API_URL}/medicines/${id}`, {
      method: "DELETE",
    });
    loadMedicines();
  };

  return (
    <div style={styles.pageStyle}>
      <h2 style={{ marginBottom: 20, fontWeight: 700, color: "#0f172a" }}>My Medicines</h2>

      {/* ADD */}
     <div style={styles.addRow}>
        <input
          placeholder="Enter medicine name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          onFocus={() => setIsInputFocused(true)} // Toggle glow on
          onBlur={() => setIsInputFocused(false)}  // Toggle glow off
          style={{
            ...styles.inputStyle,
            ...(isInputFocused ? styles.inputFocus : {}), // Apply the focus style
          }}
        />
        <button onClick={addMedicine} style={styles.addBtn}>
          Add Medicine
        </button>
</div>

      {/* TABLE */}
      <div style={styles.tableCard}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          {/* Palette Update: Light Slate background for Header */}
          <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <tr>
              <th style={styles.thStyle}>Medicine Name</th>
              <th style={styles.thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length === 0 && (
              <tr>
                <td colSpan={2} style={styles.emptyCell}>
                  No medicines added
                </td>
              </tr>
            )}

            {medicines.map((m) => (
              <tr key={m._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={styles.tdStyle}>{m.name}</td>
                <td style={styles.tdStyle}>
                  <button
                    onClick={() => deleteMedicine(m._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles: Record<string, React.CSSProperties> = {
 pageStyle : {
  padding: "32px",
  background: "#f8fafc",
  minHeight: "100%",
  color: "#0f172a",
},

 addRow : {
  display: "flex",
  gap: 12,
  marginBottom: 24,
},

 inputStyle: { 
    flex: 1, 
    height: "42px", 
    padding: "0 14px", 
    borderRadius: "8px", 
    border: "1px solid #CBD5E1", // Same slate border as Login
    fontSize: "14px",
    background: "#FFFFFF",
    color: "#334155",
    outline: "none",
    transition: "all 0.2s ease",
  },
  inputFocus: {
    borderColor: "#0F172A",
    boxShadow: "0 0 0 3px rgba(15, 23, 42, 0.1)",
    background: "#FFFFFF",
  },

 addBtn: { 
    height: "42px", 
    padding: "0 24px", 
    background: "#0F172A", // Navy button
    color: "#ffffff", 
    border: "none", 
    borderRadius: "8px", 
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },

 deleteBtn : {
  padding: "8px 16px",
  background: "#fff1f2", // Soft Red Background
  color: "#e11d48", // Sharp Red Text
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
},

 tableCard : {
  background: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
  border: "1px solid #e2e8f0",
  overflow: "hidden",
},

 thStyle : {
  padding: "16px",
  textAlign: "left" as const,
  fontWeight: 700,
  fontSize: "13px",
  color: "#64748b", // Slate secondary text
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
},

 tdStyle : {
  padding: "16px",
  fontSize: "14px",
  color: "#1e293b",
},

 emptyCell : {
  padding: 40,
  textAlign: "center" as const,
  color: "#94a3b8",
  fontSize: "15px",
},
}