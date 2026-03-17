import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

type VisitRow = {
  _id: string;
  name: string;
  age:number;
  gender: string;
  mobile: string;
  visitCount: number;
  lastVisit: string | null;
};


export default function Visits() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/visits`)
      .then((res) => res.json())
      .then((data) => {
        setVisits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        padding: 20,
        background: "#f1f5f9",
        height: "100%",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          marginBottom: 20,
          color: "#0f172a",
        }}
      >
        Visits
      </h1>

      <div
        style={{
          background: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: 20 }}>Loading visits...</div>
        ) : visits.length === 0 ? (
          <div style={{ padding: 20, color: "#64748b" }}>
            No visits recorded yet.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead style={{ background: "#e5e7eb" }}>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Age</th>
                <th style={thStyle}>Gender</th>
                <th style={thStyle}>Mobile</th>
                <th style={thStyle}>Last Visit</th>
                <th style={thStyle}>Visit Count</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr
                  key={v._id}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f1f5ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={tdStyle}>{v.name}</td>
                  <td style={tdStyle}>{v.age}</td>
                  <td style={tdStyle}>{v.gender}</td>
                  <td style={tdStyle}>{v.mobile}</td>
                  <td
                    style={{
                        padding: "10px 12px",
                        color: v.lastVisit ? "#065f46" : "#9ca3af",
                        fontWeight: 500,
                    }}
                    >
                    {v.lastVisit
                        ? new Date(v.lastVisit).toLocaleDateString()
                        : "—"}
                    </td>


                  <td
                    style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#1e293b", // dark slate
                    }}
                    >
                    {v.visitCount}
                    </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => navigate(`/patients/${v._id}`)}
                      style={{
                        padding: "6px 14px",
                        background: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left" as const,
  padding: "10px 12px",
  fontWeight: 600,
  fontSize: 14,
  color: "#0f172a", // 🔑 force dark text
};


const tdStyle = {
  padding: "12px 14px",
  fontSize: 14,
  color: "#0f172a",
};
