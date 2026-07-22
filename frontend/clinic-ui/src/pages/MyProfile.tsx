import React, { useEffect, useState } from "react";
import { API_URL } from "../config/api";

/* ---------------- TYPES ---------------- */

type Doctor = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  mobile: string;
  email: string;
  degree: string;
  regNo: string;
  city: string;
  state: string;
  pin: string;
};

type Clinic = {
  name: string;
  phones: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  morningFrom: string;
  morningTo: string;
  eveningFrom: string;
  eveningTo: string;
  closedDays: string[];
};


/* ---------------- COMPONENT ---------------- */

export default function MyProfile() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Doctor | null>(null);
  const [clinic, setClinic] = useState<Clinic>({
    name: "",
    phones: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    morningFrom: "09:00",
    morningTo: "14:00",
    eveningFrom: "17:00",
    eveningTo: "21:00",
    closedDays: [],
  });

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"doctor" | "clinic">("doctor");

  /* ---------------- LOAD DATA ---------------- */
useEffect(() => {
  const stored = localStorage.getItem("doctor");
  if (!stored) return;

  const storedDoctor = JSON.parse(stored);
  loadProfile(storedDoctor._id);
}, []);

const loadProfile = async (doctorId: string) => {
  try {
    const res = await fetch(`${API_URL}/doctors/${doctorId}`);

    if (!res.ok) throw new Error("Failed to load profile");

    const data = await res.json();

    setDoctor(data.doctor);
    setForm(data.doctor);
    setClinic({
      name: data.clinic?.name || "",
      phones: data.clinic?.phones || "",
      address: data.clinic?.address || "",
      city: data.clinic?.city || "",
      state: data.clinic?.state || "",
      pin: data.clinic?.pin || "",
      morningFrom: data.clinic?.morningFrom || "09:00",
      morningTo: data.clinic?.morningTo || "14:00",
      eveningFrom: data.clinic?.eveningFrom || "17:00",
      eveningTo: data.clinic?.eveningTo || "21:00",
      closedDays: data.clinic?.closedDays || [],
});
  } catch (err) {
    console.error("LOAD PROFILE ERROR:", err);
    alert("Failed to load profile");
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClinicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClinic({ ...clinic, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  if (!doctor) return;
  setSaving(true);

  try {
    if (activeTab === "doctor" && form) {
      const res = await fetch(`${API_URL}/doctors/${doctor._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const updated = await res.json();

      setDoctor(updated.doctor);
      setForm(updated.doctor);
      localStorage.setItem("doctor", JSON.stringify(updated.doctor));
    }

    
    
    if (activeTab === "clinic") {
      await fetch(`${API_URL}/doctors/${doctor._id}/clinic`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clinic),
      });
    }

    alert("Profile updated successfully");
    setEditMode(false);
  } catch (err) {
    console.error(err);
    alert("Failed to save changes");
  } finally {
    setSaving(false);
  }
};

  if (!doctor || !form) return null;

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2>My Profile</h2>
          <button
            style={styles.editBtn}
            onClick={() => {
              if (!editMode) setForm(doctor);
              setEditMode(!editMode);
            }}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* TABS */}
        <div style={styles.tabs}>
          <div
            style={activeTab === "doctor" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("doctor")}
          >
            Doctor Details
          </div>
          <div
            style={activeTab === "clinic" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("clinic")}
          >
            Clinic Details
          </div>
        </div>

        {/* ---------------- DOCTOR TAB ---------------- */}
        {activeTab === "doctor" && (
          <>
            <Section>
              <Row label="First Name" value={doctor.firstName} edit={editMode}>
                <input name="firstName" value={form.firstName} onChange={handleChange} />
              </Row>

              <Row label="Middle Name" value={doctor.middleName || "-"} edit={editMode}>
                <input name="middleName" value={form.middleName || ""} onChange={handleChange} />
              </Row>

              <Row label="Last Name" value={doctor.lastName} edit={editMode}>
                <input name="lastName" value={form.lastName} onChange={handleChange} />
              </Row>

              <Row label="Mobile" value={doctor.mobile} edit={editMode}>
                <input name="mobile" value={form.mobile} onChange={handleChange} />
              </Row>

              <Row label="Email" value={doctor.email} edit={editMode}>
                <input name="email" value={form.email} onChange={handleChange} />
              </Row>

              <Row label="Degree" value={doctor.degree} edit={editMode}>
                <input name="degree" value={form.degree} onChange={handleChange} />
              </Row>

              <Row label="Reg No" value={doctor.regNo} edit={editMode}>
                <input name="regNo" value={form.regNo} onChange={handleChange} />
              </Row>
            </Section>

            <div style={styles.row2}>
              {/* ADDRESS */}
              <div style={styles.addressBox}>
                <h4 style={styles.boxTitle}>Address</h4>
                <Row label="City" value={doctor.city} edit={editMode}>
                  <input name="city" value={form.city} onChange={handleChange} />
                </Row>
                <Row label="State" value={doctor.state} edit={editMode}>
                  <input name="state" value={form.state} onChange={handleChange} />
                </Row>
                <Row label="Pin" value={doctor.pin} edit={editMode}>
                  <input name="pin" value={form.pin} onChange={handleChange} />
                </Row>
              </div>

              {/* PHOTO */}
              <div style={styles.photoBox}>
                <h4 style={styles.boxTitle}>Profile Photo *</h4>
                {editMode ? (
                  <input type="file" accept="image/*" required />
                ) : (
                  <span>Photo uploaded</span>
                )}
              </div>
            </div>
          </>
        )}

        {/* ---------------- CLINIC TAB ---------------- */}
        {activeTab === "clinic" && (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

    <Row label="Clinic Name" value={clinic.name || "-"} edit={editMode}>
      <input name="name" value={clinic.name} onChange={handleClinicChange} />
    </Row>

    <Row label="Phone" value={clinic.phones || "-"} edit={editMode}>
      <input name="phones" value={clinic.phones} onChange={handleClinicChange} />
    </Row>

    <Row label="Address" value={clinic.address || "-"} edit={editMode}>
      <input name="address" value={clinic.address} onChange={handleClinicChange} />
    </Row>

    <Row label="City" value={clinic.city || "-"} edit={editMode}>
      <input name="city" value={clinic.city} onChange={handleClinicChange} />
    </Row>

    <Row label="State" value={clinic.state || "-"} edit={editMode}>
      <input name="state" value={clinic.state} onChange={handleClinicChange} />
    </Row>

    <Row label="Pin Code" value={clinic.pin || "-"} edit={editMode}>
      <input name="pin" value={clinic.pin} onChange={handleClinicChange} />
    </Row>

    {/* ===== CLINIC TIMINGS ===== */}
    <div style={styles.box}>
      <h4 style={styles.boxTitle}>Clinic Timings</h4>

      <div style={styles.timeRow}>
        <label style={styles.label}>Morning</label>
        <input 
          type="time" 
          name="morningFrom" 
          style={styles.inputBox} // Apply the style here
          value={clinic.morningFrom} 
          onChange={handleClinicChange} 
          disabled={!editMode} 
        />
        <input 
          type="time" 
          name="morningTo" 
          style={styles.inputBox} // And here
          value={clinic.morningTo} 
          onChange={handleClinicChange} 
          disabled={!editMode}
        />
      </div>

      <div style={styles.timeRow}>
        <label style={styles.label}>Evening</label>
        <input type="time" name="eveningFrom" style={styles.inputBox} value={clinic.eveningFrom} onChange={handleClinicChange} disabled={!editMode} />
        <input type="time" name="eveningTo" style={styles.inputBox} value={clinic.eveningTo} onChange={handleClinicChange} disabled={!editMode} />
      </div>
    </div>

    {/* ===== CLOSED DAYS ===== */}
    <div style={styles.box}>
      <h4 style={styles.boxTitle}>Closed On</h4>

      {[
        "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
      ].map((day) => (
        <label key={day} style={{ display: "flex", gap: 8 }}>
          <input
            type="checkbox"
            disabled={!editMode}
            checked={clinic.closedDays.includes(day)}
            onChange={() =>
              setClinic((prev) => ({
                ...prev,
                closedDays: prev.closedDays.includes(day)
                  ? prev.closedDays.filter((d) => d !== day)
                  : [...prev.closedDays, day],
              }))
            }
          />
          {day}
        </label>
      ))}
    </div>

  </div>
)}


        {/* SAVE */}
        {editMode && (
          <div style={styles.actions}>
            <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- REUSABLE ---------------- */

function Section({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>;
}

function Row({
  label,
  value,
  edit,
  children,
}: {
  label: string;
  value: string;
  edit: boolean;
  children: React.ReactElement; // Changed to ReactElement to allow cloning
}) {
  const [isFocused, setIsFocused] = useState(false);

 return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      {edit ? (
        <div style={{ flex: 1 }}>
          {/* We inject the styles directly into the input child */}
          {React.cloneElement(children as React.ReactElement<any>, {
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
            style: {
              ...styles.inputBox,
              ...(isFocused ? styles.inputFocus : {}),
            },
          })}
        </div>
      ) : (
        <span style={styles.labelValue}>{value}</span>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: { 
    color: "#0F172A", 
    padding: "40px", 
    display: "flex", 
    justifyContent: "center",
    background: "#F8FAFC", // Matches MainLayout content background
    minHeight: "100%",
  },

  card: { 
    width: 900, 
    background: "#ffffff", 
    padding: "40px", 
    borderRadius: 16,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E2E8F0",
  },

  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #F1F5F9",
  },

  editBtn: { 
    background: "#0F172A", // Deep Navy instead of bright blue
    color: "#fff", 
    padding: "10px 20px", 
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },

  tabs: { 
    display: "flex", 
    gap: "12px", 
    marginBottom: "32px",
  },

  tab: { 
    padding: "10px 20px", 
    border: "1px solid #E2E8F0", 
    borderRadius: "8px",
    background: "#fff",
    color: "#64748B",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },

  activeTab: { 
    padding: "10px 20px", 
    border: "1px solid #0F172A", 
    background: "#0F172A", // Solid Navy background for active
    color: "#ffffff",
    borderRadius: "8px",
    fontWeight: 600, 
    fontSize: "14px",
    cursor: "pointer",
  },

  row: { 
    display: "flex", 
    gap: "24px", 
    alignItems: "center", 
    marginBottom: "12px", // Tightened gap slightly
    minHeight: "42px"     // Ensures height doesn't jump when editing
  },

  label: { 
    width: 180, 
    fontWeight: 600, 
    color: "#475569", // Slate label
    fontSize: "14px"
  },

  labelValue: {
    flex: 1,
    fontSize: "15px",
    color: "#1E293B",
    padding: "0 14px",    // Match input padding so text doesn't shift left
    fontWeight: 500,
  },
  
  inputBox: { 
    flex: 1,
    height: "42px",
    padding: "0 14px",
    fontSize: "15px",
    color: "#1E293B",
    background: "#FFFFFF",
    borderRadius: "8px",
    border: "1px solid #CBD5E1", // Login page border color
    outline: "none",
    transition: "all 0.2s ease",
    width: "100%",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#0F172A",   // Navy border from Login focus
    boxShadow: "0 0 0 3px rgba(15, 23, 42, 0.1)", // Subtle Navy glow
    background: "#FFFFFF",
  },
  timeRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "10px"
  },

  row2: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "24px", 
    marginTop: "40px" 
  },

  addressBox: { 
    background: "#F8FAFC",
    border: "1px solid #E2E8F0", 
    padding: "24px",
    borderRadius: "12px" 
  },

  photoBox: { 
    background: "#F8FAFC",
    border: "1px solid #E2E8F0", 
    padding: "24px", 
    textAlign: "center" as const,
    borderRadius: "12px" 
  },

  boxTitle: { 
    textAlign: "left" as const, 
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#0F172A",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },

  actions: { 
    marginTop: "40px", 
    textAlign: "right" as const,
    paddingTop: "24px",
    borderTop: "1px solid #F1F5F9",
  },

  saveBtn: { 
    background: "#16a34a", // Keeping Green for "Save" is okay, but use a cleaner shade
    color: "#fff", 
    padding: "12px 32px", 
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
