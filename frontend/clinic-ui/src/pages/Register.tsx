import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Register() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"doctor" | "clinic">("doctor");
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    practice:"",
    degree: "",
    regNo: "",
    city: "",
    state: "",
    pin: "",
    password: "",
    confirmPassword: "",
  });
  const [clinic, setClinic] = useState({
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
  closedDays: [] as string[],
});
const [doctorSaved, setDoctorSaved] = useState(false);


  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.firstName) return "First name required";
    if (!form.lastName) return "Last name required";
    if (!/^\d{10}$/.test(form.mobile)) return "Mobile must be 10 digits";
    if (!form.email.includes("@")) return "Valid email required";
    if (!form.practice) return "Practice is required";
    if (!form.degree) return "Degree required";
    if (!form.regNo) return "Registration no required";
    if (!form.city) return "City required";
    if (!form.state) return "State required";
    if (!/^\d{6}$/.test(form.pin)) return "Pin must be 6 digits";
    if (form.password.length < 8) return "Password min 8 characters";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match";
    return "";
  };
  const handleClinicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setClinic({ ...clinic, [e.target.name]: e.target.value });
  };

  const toggleClosedDay = (day: string) => {
    setClinic((prev) => ({
      ...prev,
      closedDays: prev.closedDays.includes(day)
        ? prev.closedDays.filter((d) => d !== day)
        : [...prev.closedDays, day],
    }));
  };


  const handleSave = () => {
  const err = validate();
  if (err) {
    setError(err);
    return;
  }
  alert("Doctor details saved");
  setDoctorSaved(true);
  setActiveTab("clinic");
  setError("");
};


const handleFinalSave = async () => {
  try {
    const res = await window.api.registerWithClinic({
      doctor: {
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        mobile: form.mobile,
        email: form.email,
        practice: form.practice,
        degree: form.degree,
        regNo: form.regNo,
        city: form.city,
        state: form.state,
        pin: form.pin,
        password: form.password,
      },
      clinic: {
        name: clinic.name,
        phones: clinic.phones,
        address: clinic.address,
        city: clinic.city,
        state: clinic.state,
        pin: clinic.pin,
        morningFrom: clinic.morningFrom,
        morningTo: clinic.morningTo,
        eveningFrom: clinic.eveningFrom,
        eveningTo: clinic.eveningTo,
        closedDays: clinic.closedDays,
      },
    });

    if (res.success) {
      alert("Registration completed successfully");
      navigate("/login");
    } else {
      setError(res.message || "Registration failed");
    }
  } catch (err) {
    console.error(err);
    setError("Registration error");
  }
};




  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* TABS */}
        <div style={styles.tabs}>
          <div
            style={activeTab === "doctor" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("doctor")}
          >
            Doctor Details
          </div>

          <div
            style={
              activeTab === "clinic"
                ? styles.activeTab
                : doctorSaved
                ? styles.tab
                : styles.disabledTab
            }
            onClick={() => doctorSaved && setActiveTab("clinic")}
          >
            Clinic Details
          </div>
        </div>



        <div style={styles.header}>
          <h2 style={styles.title}>Add Details</h2><br></br>
          <span style={styles.mandatory}>* Indicates mandatory fields</span>
        </div>


        {/*DOCTOR FORM */}
        {activeTab === "doctor" && (
          <>
        <div style={styles.formBox}>
        
          {/* ROW 1 */}
          <div style={styles.row3}>
            <Field label="First Name *" name="firstName" onChange={handleChange} />
            <Field label="Middle Name" name="middleName" onChange={handleChange} />
            <Field label="Last Name *" name="lastName" onChange={handleChange} />
          </div>

          {/* ROW 2 */}
          <div style={styles.row3}>
            <Field label="Mobile No *" name="mobile" onChange={handleChange} />
            <Field label="Email ID *" name="email" onChange={handleChange} />
          </div>

          {/* ROW 3 */}
          <div style={styles.row3}>
            <SelectField
              label="Practice *"
              name="practice"
              value={form.practice}
              onChange={handleChange}
              options={[
                "Physiotherapy",
                "General Medicine",
                "Dentistry",
                "Orthopedics",
                "Gynecology",
                "Pediatrics",
                "Ayurveda",
                "Homeopathy",
              ]}
            />

            <Field label="Degree *" name="degree" onChange={handleChange} />

            <Field
              label="Registration No *"
              name="regNo"
              onChange={handleChange}
            />
          </div>


          {/* ROW 4 */}
          <div style={styles.row2}>
            {/* ADDRESS */}
            <div style={styles.addressBox}>
              <h4 style={styles.boxTitle}>Address</h4>
              <Field label="City *" name="city" onChange={handleChange} />
              <Field label="State *" name="state" onChange={handleChange} />
              <Field label="Pin Code *" name="pin" onChange={handleChange} />
            </div>

            {/* PHOTO */}
            <div style={styles.photoBox}>
              <h4 style={styles.boxTitle}>Login Information</h4>
              <Field
              label="Set Password *"
              name="password"
              type="password"
              onChange={handleChange}
            />
            <Field
              label="Confirm Password *"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
            />
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
          <button
            style={styles.cancelBtn}
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
        </div>
        </>
        )}
        
         
        {/* CLINIC FORM */}
        {activeTab === "clinic" && (
          <>
            <div style={styles.formBox}>
              <h4 style={styles.boxTitle}>General Information</h4>
              <div style={styles.row2}>
                <Field label="Clinic Name *" name="name" value={clinic.name} onChange={handleClinicChange} />
                <Field label="Clinic Ph No *" name="phones" value={clinic.phones} onChange={handleClinicChange} />
              </div>

              <div style={styles.row2}>
                <Field label="Address *" name="address" value={clinic.address} onChange={handleClinicChange} />
                <Field label="City *" name="city" value={clinic.city} onChange={handleClinicChange} />
              </div>

              <div style={styles.row2}>
                <Field label="State *" name="state" value={clinic.state} onChange={handleClinicChange} />
                <Field label="Pin Code *" name="pin" value={clinic.pin} onChange={handleClinicChange} />
              </div>

              <div style={styles.row2}>
                {/* TIMINGS */}
                <div style={styles.timingSection}>
                  <h4 style={styles.boxTitle}>Clinic Timings</h4>
                  <div style={styles.timeFieldGroup}>
                    <label style={styles.label}>Morning Session</label>
                    <div style={styles.timeRow}>
                      <input type="time" name="morningFrom" value={clinic.morningFrom} onChange={handleClinicChange} style={styles.timeInput} />
                      <span style={{ color: "#94A3B8" }}> - </span>
                      <input type="time" name="morningTo" value={clinic.morningTo} onChange={handleClinicChange} style={styles.timeInput} />
                    </div>
                  </div>

                  <div style={styles.timeFieldGroup}>
                    <label style={styles.label}>Evening Session</label>
                    <div style={styles.timeRow}>
                      <input type="time" name="eveningFrom" value={clinic.eveningFrom} onChange={handleClinicChange} style={styles.timeInput} />
                      <span style={{ color: "#94A3B8" }}> - </span>
                      <input type="time" name="eveningTo" value={clinic.eveningTo} onChange={handleClinicChange} style={styles.timeInput} />
                    </div>
                  </div>
                </div>

                {/* CLOSED DAYS */}
                <div style={styles.closedBox}>
                  <h4 style={styles.boxTitle}>Closed On</h4>
                  <div style={styles.closedGrid}>
                    {[
                      "Sunday", "Monday", "Tuesday", "Wednesday",
                      "Thursday", "Friday", "Saturday",
                    ].map((day) => (
                      <label key={day} style={styles.closedItem}>
                        <input
                          type="checkbox"
                          checked={clinic.closedDays.includes(day)}
                          onChange={() => toggleClosedDay(day)}
                          style={styles.checkbox}
                        />
                        <span style={{ fontSize: "14px", color: "#1E293B" }}>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* FINAL ACTIONS */}
              <div style={styles.actions}>
                <button style={styles.saveBtn} onClick={handleFinalSave}>Complete Registration</button>
                <button style={styles.cancelBtn} onClick={() => navigate("/login")}>Cancel</button>
              </div>
            </div>
          </>
        )}
            {error && <div style={styles.error}>{error}</div>} 
              </div>
            </div>
          );
}

/* ---------------- FIELD COMPONENT ---------------- */

function Field({
  label,
  name,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  onChange: any;
  type?: string;
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input type={type} name={name} onChange={onChange} style={styles.input} />
    </div>
  );
}


function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  options: string[];
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={styles.select}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}


/* ---------------- STYLES ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#F1F5F9", // Consistent soft gray/blue
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
  },

  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "40px",
    maxWidth: 1000, // Slightly tighter for better readability
    width: "95%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    scrollbarWidth: "thin",
  },

  header: {
    position: "relative",
    textAlign: "center",
    marginBottom: "32px",
    paddingBottom: "16px",
    borderBottom: "1px solid #E2E8F0",
  },

  title: {
    color: "#0F172A", // Deep Navy
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },

  mandatory: {
    position: "absolute",
    right: 0,
    bottom: "20px",
    color: "#E11D48", // Soft Red
    fontSize: "12px",
    fontWeight: 500,
  },

  // Section grouping containers
  formBox: {
    background: "#F8FAFC", // Very subtle offset from card
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0", // Replaced 2px black
    marginBottom: "24px",
  },

  boxTitle: {
    color: "#475569",
    fontSize: "14px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "20px",
    textAlign: "left" as const,
  },

  row3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column", // Stacked labels look cleaner in busy forms
    gap: "8px",
  },

  label: {
    color: "#334155",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left" as const,
  },

  input: {
    color: "#1E293B",
    height: "40px",
    backgroundColor: "#ffffff",
    border: "1px solid #CBD5E1",
    borderRadius: "8px", // Subtle rounding
    padding: "0 12px",
    fontSize: "14px",
    transition: "all 0.2s ease",
    outline: "none",
  },

  select: {
    color: "#1E293B",
    height: "40px",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    padding: "0 10px",
    background: "#fff",
    fontSize: "14px",
    outline: "none",
  },

  // Tab Navigation
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "1px solid #E2E8F0",
    paddingBottom: "12px",
  },

  tab: {
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748B",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  activeTab: {
    padding: "10px 20px",
    background: "#0F172A", // Deep Navy background for active
    color: "#ffffff",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
  },

  disabledTab: {
    padding: "10px 20px",
    color: "#CBD5E1",
    cursor: "not-allowed",
    background: "transparent",
  },

  // Action Buttons
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "32px",
    paddingTop: "20px",
    borderTop: "1px solid #E2E8F0",
  },

  saveBtn: {
    background: "#0F172A", // Using primary navy instead of green for "Save"
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },

  cancelBtn: {
    background: "transparent",
    color: "#64748B",
    border: "1px solid #E2E8F0",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    color: "#E11D48",
    fontSize: "13px",
    marginTop: "15px",
    backgroundColor: "#FFF1F2",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center" as const,
  },


  // ... (previous styles like page, card, etc remain same)

  timingSection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },

  timeFieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },

  timeRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  timeInput: {
    flex: 1,
    height: "40px",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    padding: "0 10px",
    fontSize: "14px",
    color: "#CBD5E1",
    outline: "none",
  },

  closedBox: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
  },

  closedGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // Two columns for days looks cleaner
    gap: "10px",
  },

  closedItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "4px 0",
  },

  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#0F172A", // Matches the Navy theme
  }
};