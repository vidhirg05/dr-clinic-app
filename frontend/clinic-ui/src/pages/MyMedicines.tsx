import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

type Medicine = {
  _id: string;
  name: string;
};

export default function MyMedicines() {
  const [medicineName, setMedicineName] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);

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
    <div style={pageStyle}>
      <h2 style={{ marginBottom: 20 }}>My Medicines</h2>

      {/* ADD */}
      <div style={addRow}>
        <input
          placeholder="Enter medicine name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          style={inputStyle}
        />
        <button onClick={addMedicine} style={addBtn}>
          Add Medicine
        </button>
      </div>

      {/* TABLE */}
      <div style={tableCard}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#e5e7eb" }}>
            <tr>
              <th style={thStyle}>Medicine Name</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length === 0 && (
              <tr>
                <td colSpan={2} style={emptyCell}>
                  No medicines added
                </td>
              </tr>
            )}

            {medicines.map((m) => (
              <tr key={m._id}>
                <td style={tdStyle}>{m.name}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => deleteMedicine(m._id)}
                    style={deleteBtn}
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

const pageStyle = {
  padding: 20,
  background: "#f8fafc",
  minHeight: "100%",
  color: "#0f172a",
};

const addRow = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
};

const inputStyle = {
  flex: 1,
  height: 40,
  padding: "0 12px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
};

const addBtn = {
  height: 40,
  padding: "0 18px",
  background: "#16a34a",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 14px",
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const tableCard = {
  background: "#ffffff",
  borderRadius: 6,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  overflow: "hidden",
};

const thStyle = {
  padding: 12,
  textAlign: "left" as const,
  fontWeight: 600,
};

const tdStyle = {
  padding: 12,
};

const emptyCell = {
  padding: 16,
  textAlign: "center" as const,
  color: "#64748b",
};
