import { useEffect, useState } from "react";
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
        <label>Morning</label>
        <input type="time" name="morningFrom" value={clinic.morningFrom} onChange={handleClinicChange} />
        <input type="time" name="morningTo" value={clinic.morningTo} onChange={handleClinicChange} />
      </div>

      <div style={styles.timeRow}>
        <label>Evening</label>
        <input type="time" name="eveningFrom" value={clinic.eveningFrom} onChange={handleClinicChange} />
        <input type="time" name="eveningTo" value={clinic.eveningTo} onChange={handleClinicChange} />
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
  children: React.ReactNode;
}) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      {edit ? <div style={styles.inputBox}>{children}</div> : <span>{value}</span>}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: { color: "#000", padding: 30, display: "flex", justifyContent: "center" },
  card: { width: 900, background: "#fff", padding: 30, borderRadius: 8 },
  header: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
  editBtn: { background: "#2563eb", color: "#fff", padding: "8px 16px", border: "none" },
  tabs: { display: "flex", gap: 12, marginBottom: 20 },
  tab: { padding: "8px 16px", border: "1px solid #ccc", cursor: "pointer" },
  activeTab: { padding: "8px 16px", border: "2px solid #2563eb", fontWeight: 600 },
  row: { display: "flex", gap: 20, alignItems: "center" },
  label: { width: 200, fontWeight: 600 },
  inputBox: { flex: 1 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 30 },
  addressBox: { border: "1px solid #ccc", padding: 20 },
  photoBox: { border: "1px solid #ccc", padding: 20, textAlign: "center" },
  boxTitle: { textAlign: "center", marginBottom: 12 },
  actions: { marginTop: 30, textAlign: "right" },
  saveBtn: { background: "#16a34a", color: "#fff", padding: "10px 24px", border: "none" },
};
