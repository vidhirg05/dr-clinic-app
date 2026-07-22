import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 

type Doctor = {
  firstName: string;
  middleName?: string;
  lastName: string;
  degree: string;
  mobile?: string;
};


export default function MainLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const location = useLocation();
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const doctorName = doctor
  ? [doctor.firstName, doctor.middleName, doctor.lastName]
      .filter(Boolean)
      .join(" ")
  : "Doctor";

  const getSidebarStyle = (id: string) => {
  const isBtnActive = isActive(id); // Using the isActive logic from before
  const isBtnHovered = hoveredBtn === id;

  if (isBtnActive) return styles.sideBtnActive;
  if (isBtnHovered) return styles.sideBtnHover;
  return styles.sideBtn;
};


  /* 🔑 Load logged-in doctor */
  useEffect(() => {
    const stored = localStorage.getItem("doctor");
    if (stored) {
      setDoctor(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <div style={styles.header}>
        {/* LEFT */}
        <div style={styles.headerLeft} onClick={() => navigate("/home")}>
          MyClinic
        </div>

        {/* RIGHT — DOCTOR INFO */}
        <div style={styles.headerRight}>
          <div
            style={styles.doctorArea}
            onClick={() => setShowMenu(!showMenu)}
          >
            <div style={styles.avatar}>
              {doctor?.firstName?.charAt(0) ?? "D"}
            </div>

            <div>
              <div style={styles.nameText}>
                Dr. {doctorName}
              </div>


              <div style={styles.subText}>
                {doctor?.degree}
                {doctor?.mobile && (
                  <>
                    {" "} | {doctor.mobile}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* DROPDOWN */}
          {showMenu && (
            <div style={styles.dropdown}>
              <div
                style={styles.dropdownItem}
                onClick={() => {
                  setShowMenu(false);
                  navigate("/my-profile");
                }}
              >
                Edit Profile
              </div>

              <div
                style={{ ...styles.dropdownItem, color: "#dc2626" }}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BODY */}
      <div style={styles.body}>

        {/* SIDEBAR - CONSOLIDATED NAVIGATION */}
        <div
          style={{
            ...styles.sidebar,
            width: open ? 220 : 70,
          }}
        >
          <button style={styles.toggleBtn} onClick={() => setOpen(!open)}>
            {open ? "◀" : "▶"}
          </button>

          {/* Profile */}
          <button
            style={getSidebarStyle("/my-profile")}
            onMouseEnter={() => setHoveredBtn("/my-profile")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate("/my-profile")}
            title="Profile"
          >
            {open ? "👤 Profile" : "👤"}
          </button>

          {/* Medicines */}
          <button
            style={getSidebarStyle("/my-medicines")}
            onMouseEnter={() => setHoveredBtn("/my-medicines")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate("/my-medicines")}
            title="Medicines"
          >
            {open ? "💊 Medicines" : "💊"}
          </button>

          {/* Separator */}
          <div style={styles.separator} />

          {/* Patients */}
          <button
            style={getSidebarStyle("/patients")}
            onMouseEnter={() => setHoveredBtn("/patients")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate("/patients")}
            title="Patients"
          >
            {open ? "👥 Patients" : "👥"}
          </button>

          {/* Visits */}
          <button
            style={getSidebarStyle("/visits")}
            onMouseEnter={() => setHoveredBtn("/visits")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate("/visits")}
            title="Visits"
          >
            {open ? "📋 Visits" : "📋"}
          </button>

          {/* Records */}
          <button
            style={getSidebarStyle("/reports")}
            onMouseEnter={() => setHoveredBtn("/reports")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate("/reports")}
            title="Records"
          >
            {open ? "📄 Records" : "📄"}
          </button>

          {/* Analytics */}
          <button
            style={getSidebarStyle("/analytics")}
            onMouseEnter={() => setHoveredBtn("/analytics")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate("/analytics")}
            title="Analytics"
          >
            {open ? "📊 Analytics" : "📊"}
          </button>
        </div>

        {/* RIGHT AREA */}
        <div style={styles.rightArea}>
          <div style={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: Record<string, React.CSSProperties> = {
  app: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    background: "#F8FAFC",
  },

  header: {
    height: 64,
    // Clean white header for a modern medical look
    background: "#ffffff", 
    color: "#0F172A",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    borderBottom: "1px solid #E2E8F0",
    zIndex: 50,
  },

  headerLeft: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0F172A", // Deep Navy
    cursor: "pointer",
    letterSpacing: "-0.02em",
  },

  headerRight: {
    position: "relative",
  },

  doctorArea: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "background 0.2s",
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: "10px", // Squircle look
    background: "#F1F5F9",
    color: "#0F172A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    border: "1px solid #E2E8F0",
  },

  nameText: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0F172A",
    lineHeight: "1.2",
  },

  subText: {
    fontSize: 12,
    color: "#64748B", // Slate gray
    whiteSpace: "nowrap",
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 55,
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    width: 180,
    padding: "8px",
    zIndex: 100,
    border: "1px solid #E2E8F0",
  },

  dropdownItem: {
    padding: "10px 12px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    borderRadius: "6px",
    color: "#334155",
    transition: "background 0.2s",
  },

  body: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },

  sidebar: {
    // Primary Brand Color: Deep Navy
    background: "#0F172A", 
    color: "#fff",
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  toggleBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "none",
    color: "#94A3B8",
    padding: "8px",
    marginBottom: "12px",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "12px",
  },

  sideBtn: {
    background: "transparent",
    border: "none",
    color: "#94A3B8", // Muted Slate
    padding: "12px",
    cursor: "pointer",
    borderRadius: "8px",
    textAlign: "left" as const,
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease", // Smooth fade effect
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  sideBtnHover: {
    background: "rgba(255, 255, 255, 0.08)", // Very subtle light highlight
    border: "none",
    color: "#F1F5F9", // Brightens the text on hover
    padding: "12px",
    cursor: "pointer",
    borderRadius: "8px",
    textAlign: "left" as const,
    fontSize: "14px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.2s ease",
  },

  sideBtnActive: {
    background: "#334155", // Solid lighter navy/slate for active state
    border: "none",
    color: "#FFFFFF", 
    padding: "12px",
    cursor: "pointer",
    borderRadius: "8px",
    textAlign: "left" as const,
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  rightArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  content: {
    flex: 1,
    padding: "24px",
    background: "#F8FAFC", // Softest gray-blue for working area
    overflowY: "auto",
  },

  separator: {
    height: 1,
    background: "rgba(255, 255, 255, 0.1)",
    margin: "8px 0",
  },
};
