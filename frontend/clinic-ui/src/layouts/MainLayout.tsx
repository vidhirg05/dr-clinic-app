import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const doctorName = doctor
  ? [doctor.firstName, doctor.middleName, doctor.lastName]
      .filter(Boolean)
      .join(" ")
  : "Doctor";


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
        {/* SIDEBAR */}
        <div
          style={{
            ...styles.sidebar,
            width: open ? 220 : 70,
          }}
        >
          <button style={styles.toggleBtn} onClick={() => setOpen(!open)}>
            {open ? "◀" : "▶"}
          </button>

          <button
            style={styles.sideBtn}
            onClick={() => navigate("/my-profile")}
          >
            {open ? "My Profile" : "P"}
          </button>

          <button
            style={styles.sideBtn}
            onClick={() => navigate("/my-medicines")}
          >
            {open ? "My Medicines" : "M"}
          </button>
        </div>

        {/* RIGHT AREA */}
        <div style={styles.rightArea}>
          <div style={styles.navbar}>
            <span onClick={() => navigate("/patients")}>Patients</span>
            <span onClick={() => navigate("/visits")}>Visits</span>
            <span onClick={() => navigate("/reports")}>Reports</span>
            <span onClick={() => navigate("/analytics")}>Analytics</span>
          </div>

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
  },

  header: {
    height: 60,
    background: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },

  headerLeft: {
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
  },

  headerRight: {
    position: "relative",
  },

  doctorArea: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#1e40af",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },

  nameText: {
    fontWeight: 600,
    lineHeight: "16px",
  },

  subText: {
    fontSize: 12,
    opacity: 0.95,
    color: "#ffffff",
    whiteSpace: "nowrap",
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 60,
    background: "#ffffff",
    color: "#111827",
    borderRadius: 6,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: 160,
    zIndex: 100,
  },

  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    borderBottom: "1px solid #e5e7eb",
  },

  body: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },

  sidebar: {
    background: "#1e293b",
    color: "#fff",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    transition: "width 0.25s ease",
  },

  toggleBtn: {
    background: "#334155",
    border: "none",
    color: "#fff",
    padding: 8,
    cursor: "pointer",
  },

  sideBtn: {
    background: "transparent",
    border: "1px solid #475569",
    color: "#fff",
    padding: 10,
    cursor: "pointer",
    borderRadius: 4,
    textAlign: "left",
  },

  rightArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  navbar: {
    height: 55,
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "0 20px",
    borderBottom: "1px solid #cbd5e1",
    cursor: "pointer",
  },

  content: {
    flex: 1,
    padding: 20,
    background: "#f8fafc",
    overflowY: "auto",
  },
};
