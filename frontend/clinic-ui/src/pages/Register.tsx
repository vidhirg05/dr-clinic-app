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
          <div style={styles.row2}>
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
        
         
        {/*CLINIC FORM */}
        {activeTab === "clinic" && (
          <>   
          <div style={styles.formBox}>
            <div style={styles.row2}>
              <Field label="Clinic Name *" name="name" onChange={handleClinicChange} />
              <Field
                label="Clinic Ph No *"
                name="phones"
                onChange={handleClinicChange}
              />
            </div>

            <div style={styles.row2}>
              <Field label="Address *" name="address" onChange={handleClinicChange} />
              <Field label="City *" name="city" onChange={handleClinicChange} />
            </div>

            <div style={styles.row2}>
              <Field label="State *" name="state" onChange={handleClinicChange} />
              <Field label="Pin Code *" name="pin" onChange={handleClinicChange} />
            </div>

            {/* TIMINGS */}
            <div style={styles.row2}>
              <div>
                <h4>Clinic Timings</h4>
                <div style={styles.timeRow}>
                  <label>Morning</label>
                  <input
                    type="time"
                    name="morningFrom"
                    value={clinic.morningFrom}
                    onChange={handleClinicChange}
                  />

                  <input
                    type="time"
                    name="morningTo"
                    value={clinic.morningTo}
                    onChange={handleClinicChange}
                  />
                </div>

                <div style={styles.timeRow}>
                  <label>Evening</label>
                  <input
                    type="time"
                    name="eveningFrom"
                    value={clinic.eveningFrom}
                    onChange={handleClinicChange}
                  />

                  <input
                    type="time"
                    name="eveningTo"
                    value={clinic.eveningTo}
                    onChange={handleClinicChange}
                  />
                </div>
              </div>

              {/* CLOSED DAYS */}
                <div style={styles.closedBox}>
                  <h4 style={styles.closedTitle}>Closed On</h4>

                  <div style={styles.closedList}>
                    {[
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ].map((day) => (
                      <label key={day} style={styles.closedItem}>
                        <input
                          type="checkbox"
                          checked={clinic.closedDays.includes(day)}
                          onChange={() => toggleClosedDay(day)}
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* FINAL ACTIONS */}
              <div style={styles.actions}>
                <button style={styles.saveBtn} onClick={handleFinalSave}>Login Now</button>
                <button
                  style={styles.loginNowBtn}
                  onClick={() => navigate("/login")}
                >
                  Cancel
                </button>
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
  background: "#e5e7eb",
  height: "100vh",        // 🔑 lock page height
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},

  card: {
  background: "#fff",
  borderRadius: 10,
  padding: 30,
  maxWidth: 1200,
  width: "100%",
  maxHeight: "90vh",      // 🔑 key line
  overflowY: "auto",      // 🔑 enables scrolling
  scrollbarWidth:"thin",
},

  header: {
    position: "relative",
    textAlign: "center",
    marginBottom: 25,
  },
  title: {
    color: "#2563eb",
    fontSize: 26,
    fontWeight: 600,
  },
  mandatory: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    color: "red",
    fontSize: 13,
  },

  select: {
  color:"#000000",
  flex: 1,
  height: 30,
  border: "2px solid #000",
  padding: "0 6px",
  background: "#fff",
},

  formBox: {
    color:"#000000",
    border: "2px solid #000",
    padding: 25,
  },
  row3: {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 16,
  marginBottom: 20,
},

  row2: {
    color:"#000000",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 20,
  },
  field: {
    display: "flex",
    alignItems: "center",
    gap: 25,
  },
  label: {
  color:"#000000",
  width: 120,   // 🔑 was 150 (too large for 3 columns)
  textAlign: "right",
  fontWeight: 500,
  whiteSpace: "nowrap",
},

  smallLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
  color:"#000000",
  flex: 1,
  backgroundColor: "#ffffff",
  //minWidth: 0, // 🔑 VERY IMPORTANT
  height: 30,
  border: "2px solid #000",
  padding: "0 8px",
},

  addressBox: {
    color:"#000000",
    border: "1px solid #000",
    padding: 15,
  },
  photoBox: {
    border: "1px solid #000",
    padding: 15,
    color:"#000000",
  },
  boxTitle: {
    color:"#000000",
    textAlign: "center",
    marginBottom: 12,
  },
  success: {
    color: "green",
    fontSize: 13,
    marginTop: 6,
    display: "block",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  saveBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: 15,
  },

  tabs: {
  color:"#000000",
  display: "flex",
  gap: 10,
  marginBottom: 20,
},

tab: {
  color:"#000000",
  padding: "8px 16px",
  border: "1px solid #000",
  cursor: "pointer",
},

activeTab: {
  padding: "8px 16px",
  border: "2px solid #153579",
  fontWeight: 600,
  cursor: "pointer",
},
disabledTab: {
  padding: "8px 16px",
  border: "1px solid #999",
  color: "#999",
  cursor: "not-allowed",
  background: "#f3f4f6",
},

timeRow: {
  width: "70%",
  fontWeight: 500,
  color:"#000000",
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 8,
},

checkboxRow: {
  color:"#000000",
  display: "flex",
  alignItems: "center",
  gap: 6,
},
closedBox: {
  color:"#000000",
  border: "1px solid #000",
  padding: 15,
},

closedTitle: {
  alignItems: "center",
  color:"#000000",
  marginBottom: 10,
  fontWeight: 600,
},

closedList: {
  display: "flex",
  flexDirection: "column",
  gap: 6,
},

closedItem: {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
},

loginNowBtn: {
  background: "#16a34a",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
},

}