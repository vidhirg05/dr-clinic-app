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
  const [filterPeriod, setFilterPeriod] = useState<"all" | "day" | "week" | "month">("all");

  useEffect(() => {
    fetch(`${API_URL}/visits`)
      .then((res) => res.json())
      .then((data) => {
        setVisits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter visits based on selected period
  const getFilteredVisits = () => {
    if (filterPeriod === "all") return visits;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return visits.filter((v) => {
      if (!v.lastVisit) return false;
      const visitDate = new Date(v.lastVisit);
      const visitDay = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate());
      
      const daysDiff = Math.floor((today.getTime() - visitDay.getTime()) / (1000 * 60 * 60 * 24));

      switch (filterPeriod) {
        case "day":
          return daysDiff === 0; // Today
        case "week":
          return daysDiff >= 0 && daysDiff < 7; // Last 7 days
        case "month":
          return daysDiff >= 0 && daysDiff < 30; // Last 30 days
        default:
          return true;
      }
    });
  };

  const filteredVisits = getFilteredVisits();

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
        {/* Filter Buttons */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setFilterPeriod("all")}
            style={{
              padding: "8px 16px",
              background: filterPeriod === "all" ? "#2563eb" : "#f1f5f9",
              color: filterPeriod === "all" ? "#ffffff" : "#0f172a",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
              transition: "all 0.2s",
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterPeriod("day")}
            style={{
              padding: "8px 16px",
              background: filterPeriod === "day" ? "#2563eb" : "#f1f5f9",
              color: filterPeriod === "day" ? "#ffffff" : "#0f172a",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
              transition: "all 0.2s",
            }}
          >
            Today
          </button>
          <button
            onClick={() => setFilterPeriod("week")}
            style={{
              padding: "8px 16px",
              background: filterPeriod === "week" ? "#2563eb" : "#f1f5f9",
              color: filterPeriod === "week" ? "#ffffff" : "#0f172a",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
              transition: "all 0.2s",
            }}
          >
            This Week
          </button>
          <button
            onClick={() => setFilterPeriod("month")}
            style={{
              padding: "8px 16px",
              background: filterPeriod === "month" ? "#2563eb" : "#f1f5f9",
              color: filterPeriod === "month" ? "#ffffff" : "#0f172a",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
              transition: "all 0.2s",
            }}
          >
            This Month
          </button>
        </div>

        {/* Results Count */}
        {!loading && filteredVisits.length > 0 && (
          <div
            style={{
              padding: "12px 20px",
              background: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
              fontSize: 13,
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            Showing {filteredVisits.length} of {visits.length} patients
          </div>
        )}

        {loading ? (
          <div style={{ padding: 20 }}>Loading visits...</div>
        ) : filteredVisits.length === 0 ? (
          <div style={{ padding: 20, color: "#64748b" }}>
            {visits.length === 0
              ? "No visits recorded yet."
              : `No visits in the selected period.`}
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
              {filteredVisits.map((v) => (
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
                      color: "#1e293b",
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
