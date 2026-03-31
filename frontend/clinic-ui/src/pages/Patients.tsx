import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { API_URL } from "../config/api";

/* ================= STYLES ================= */

const styles: any = {

  /* ---------- GENERAL ---------- */
 page: {
  width: "100%",
  padding: "20px",
  backgroundColor: "#f1f5f9",
  color: "#1e293b",
  minHeight: "100vh",
  boxSizing: "border-box", // Crucial for 100% stretch
},

  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 16px",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  field: {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  width: "70%",
},

  card: {
    width: "100%",
    height:"95%",
    fontSize: 19,
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
/* ---------- Search ---------- */
  fullWidthCard: {
  fontSize: 19,
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  marginBottom: 10,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  width: "100%",
},

  input: {
    color:"#ffffff",
    width: "98%",
    height: 36,
    padding: "0 10px",
    borderRadius: 6,
    border: "1px solid #cbd5e1",
  },

  searchRow: {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr 120px",
  gap: 20,
  alignItems: "flex-end",
},

searchTable: {
  width: "100%",
  marginTop: 20,
  borderCollapse: "collapse",
  tableLayout: "fixed",
  },
  noResult: {
  marginTop: 24,
  textAlign: "center",
  fontSize: 16,
  fontWeight: 500,
  color: "#6b7280",
},
th: {
  padding: "12px 10px",
  fontWeight: 600,
  borderBottom: "2px solid #e5e7eb",
  textAlign: "center",
},

td: {
  padding: "12px 10px",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "center",
  fontSize: 15,
},

/* ---------- Personal Details ---------- */
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
  },


  /*Allergies*/ 
  /* ---------- Allergy + Vitals card ---------- */
  allergiesCardRed: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    //boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    //borderLeft: "6px solid #ef4444", // High visibility for allergies
    display: "flex",
    flexDirection: "column",
    height: "100%", 
    boxSizing: "border-box",
  },

  fullWidthMedicalCard: {
    fontSize: 19,
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    width: "100%",
    boxSizing: "border-box",
  },
  fullTextarea: {
    width: "100%",
    height: 120,
    padding: "12px",
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    fontSize: 16,
    fontFamily: "inherit",
    resize: "none",
    boxSizing: "border-box",
  },

  clinicalRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr", // Keeps the 2:1 ratio
    gap: "10px",
    width: "100%", // Ensures it spans the full container width
    marginBottom: "20px",
    boxSizing: "border-box",
  },

  fixedHeightCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    height: "350px", 
    display: "flex",
    flexDirection: "column",
    width: "100%", // Ensures cards fill their grid columns
    boxSizing: "border-box",
  },

  scrollableContent: {
    flex: 1,
    overflowY: "auto", // Makes content scrollable
    paddingRight: "5px",
  },

  /* ---------- Clean UI Refinements ---------- */
  prescriptionCard: {
    width: "100%",           
    background: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    boxSizing: "border-box", // Prevents padding from breaking the 100% width
    margin: "0 0 20px 0",
  },

  cleanTable: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px", // Gives rows breathing room
  },

  tableHeader: {
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    padding: "12px",
  },

  noteArea: {
    width: "100%",
    height: "220px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    background: "#fdfdfd", 
    color: "#334155",
    fontSize: "14px",
    resize: "none",
    boxSizing: "border-box",
  },

  // Ensure the grid wrapping the two parts stretches 100%
  prescriptionGrid: {
    display: "grid",
    gridTemplateColumns: "1.8fr 1fr",
    gap: "30px",
    width: "100%",           // Forces the internal grid to span the whole card
    alignItems: "start",
  },

  primaryBtn: {
    height: 40,
    padding: "0 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },

  /*certificates link*/
  certificateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "15px",
    width: "100%",
    boxSizing: "border-box",
  },
  
  certLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  saveBtn: {
    background: "#16a34a",
    color: "#fff",
    padding: "12px 36px",
    border: "none",
    borderRadius: 6,
    fontSize: 15,
  },
};


/* ================= TYPES ================= */

type Patient = {
  _id: string;
  fullName: string;
  age: number;
  gender: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  bloodGroup: string;
  allergies: string;
  doctorNotes: string;
};
 
/* ================= REUSABLE ================= */

function Input({ label, name, value, onChange, ...rest }: any) {
  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        value={value ?? ""}
        onChange={onChange}
        style={styles.input}
        {...rest}
      />
    </div>
  );
}

/* ================= COMPONENT ================= */

export default function Patients() {
  const navigate = useNavigate();

  /* ---------- SEARCH ---------- */
  const [searchText, setSearchText] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchType, setSearchType] = useState<"name" | "mobile">("name");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<string[]>([]);
  const [doctor, setDoctor] = useState<any>(null); // Store logged-in doctor info
   /* ---------- FORM ---------- */
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    bloodGroup: "",

    allergies: "",
    doctorNotes: "",

    prescription: [
    {
      medicine: "",
      duration: "",      // Added for the number (e.g., 5)
      durationType: "Days", // Added for the unit (Days/Weeks)
      mor: false,
      aft: false,
      eve: false,
      night: false,
    },
  ],

    vitals: {
      height: "",
      weight: "",
      temperature: "",
      pulse: "",
      respirations: "",
      bp: "",
      spo2: "",          // Added: Oxygen Saturation
      waist: "",         // Added: Waist Circumference
      head: "",          // Added: Head Circumference (Pediatrics)
      bloodSugar: "",    // Added: Blood Glucose
      randomSugar: "",
      bmi: "",           // BMI will be calculated
  },

  history: {
    hiv: false,
    tb: false,
    diabetes: false,
    cancer: false,
    chickenpox: false,
    hypertension: false,
    asthma: false,
    hepatitis: false,
    thyroid: false,
    epilepsy: false,
  },

  referral: {
  targetName: "",      // Dr. Name or Diagnostic Center
  specialty: "",       // Cardiology, Radiology, etc.
  reason: "",          // Why are they being referred?
  urgency: "Normal",   // Normal, Urgent, Emergency
  },

  followUp: { 
    number: "", 
    type: "Days",
    notes: "" // Added this to match your textarea
  },
  followUpDate: "",

  fees: {
  visitCharges: "",
  totalCharges: "",
  previousBalance: "0",
  netPayable: "",
  discount: "",
  discountType: "Percent", // Percent | Amount
  paymentMode: "Cash",
  partPayment: false,
},

});

  useEffect(() => {
  const fetchMedicines = async () => {
    try {
      const res = await fetch(`${API_URL}/medicines`);
      const data = await res.json();

      // assuming each medicine has a "name" field
      setMedicines(data.map((m: any) => m.name));
    } catch (err) {
      console.error("Failed to load medicines", err);
    }
  };

  fetchMedicines();
}, []);

// In your useEffect
useEffect(() => {
  const savedDoctor = localStorage.getItem("doctor");
  if (savedDoctor) {
    setDoctor(JSON.parse(savedDoctor));
  }
}, []);

/* -------- AUTOMATIC FEES CALCULATION -------- */
useEffect(() => {
  // 1. Get values and ensure they are numbers
  const visit = parseFloat(form.fees.visitCharges) || 0;
  const prev = parseFloat(form.fees.previousBalance) || 0;
  const discValue = parseFloat(form.fees.discount) || 0;

  // 2. Calculate Total (usually the base visit charge)
  const total = visit;

  // 3. Logic for Discount Type
  let discountAmount = 0;
  if (form.fees.discountType === "Percent") {
    discountAmount = (total * discValue) / 100;
  } else {
    discountAmount = discValue;
  }

  // 4. Final Calculation: (Current + Arrears) - Reduction
  const net = (total + prev) - discountAmount;

  // 5. Update form state without triggering an infinite loop
  // We check if the values actually changed before updating
  if (form.fees.totalCharges !== total.toString() || form.fees.netPayable !== net.toString()) {
    setForm((prevForm) => ({
      ...prevForm,
      fees: {
        ...prevForm.fees,
        totalCharges: total.toFixed(2),
        netPayable: net.toFixed(2),
      },
    }));
  }
}, [form.fees.visitCharges, form.fees.previousBalance, form.fees.discount, form.fees.discountType]);


  const searchPatients = async () => {
  if (!searchText.trim()) return;

  setSearched(true); // 🔑 mark that search was attempted

  const res = await fetch(
    `${API_URL}/patients/search?${searchType}=${searchText}`
  );

  const data = await res.json();

  const normalizedPatients = data.map((p: any) => {
    const source = p.patient || p;

    return {
      _id: p._id || source._id,
      fullName: source.fullName || source.name || "",
      age: source.age,
      gender: source.gender,
      mobile: source.mobile,
    };
  });

  setPatients(normalizedPatients);
};

 const handleChange = (e: any) => {
  const { name, value, type, checked } = e.target;
  const val = type === "checkbox" ? checked : value;

  if (name.includes(".")) {
    const [outer, inner] = name.split(".");
    setForm((prev: any) => ({
      ...prev,
      // The [outer] key must be cast so TS knows it's an object
      [outer]: { 
        ...(prev[outer as keyof typeof prev] || {}), 
        [inner]: val 
      },
    }));
  } else {
    setForm((prev) => ({ ...prev, [name]: val }));
  }
};

  const handleVitals = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setForm((prev) => ({
    ...prev,
    vitals: { ...prev.vitals, [name]: value }
  }));
};

  const calculateBMI = () => {
    const heightCm = Number(form.vitals.height);
    const weightKg = Number(form.vitals.weight);
    if (!heightCm || !weightKg) return "";
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(2);
  };



 /* const handleHistoryChange = (e: any) => {
  const { name, checked } = e.target;
  setForm({
    ...form,
    history: { ...form.history, [name]: checked }
  });
};*/

  const handlePrescription = (
  index: number,
  key: string,
  value: any
  ) => { 
    const updated = [...form.prescription];
    (updated[index] as any)[key] = value;
    setForm({ ...form, prescription: updated });
  };

  const handleFollowUpChange = (name : any, value : any) => {
  setForm((prevForm) => {
    // 1. Create a copy of the follow-up object
    let updatedFollowUp = { ...prevForm.followUp };

    // 2. Update the specific field
    if (name === "followUp.number") updatedFollowUp.number = value;
    if (name === "followUp.type") updatedFollowUp.type = value;

    let calculatedDate = prevForm.followUpDate;

    // 3. Auto-calculate logic (Uses current date as the starting point)
    const num = parseInt(updatedFollowUp.number);
    if (!isNaN(num) && num > 0) {
      const d = new Date();
      if (updatedFollowUp.type === "Days") d.setDate(d.getDate() + num);
      if (updatedFollowUp.type === "Weeks") d.setDate(d.getDate() + num * 7 * 1); // 7 days per week
      if (updatedFollowUp.type === "Months") d.setMonth(d.getMonth() + num);
      calculatedDate = d.toISOString().split("T")[0];
    }

    return {
      ...prevForm,
      followUp: updatedFollowUp,
      followUpDate: calculatedDate
    };
  });
};

  const addMedicineRow = () => {
  setForm((prev) => ({
    ...prev,
    prescription: [
      ...prev.prescription,
      { 
        medicine: "", 
        duration: "", 
        durationType: "Days", 
        mor: false, aft: false, eve: false, night: false 
      },
    ],
  }));
};

  const savePatient = async () => {
  try {
    const res = await fetch(`${API_URL}/patients/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form), 
    });

    const data = await res.json();

    if (res.ok && data.patient?._id) {
      // SUCCESS: Data is in DB, now redirect
      navigate(`/patients/${data.patient._id}`); 
    } else {
      console.error("Server rejected data:", data.error);
      alert("Error: " + (data.message || "Failed to save"));
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Could not connect to the server.");
  }
};

const printReferral = () => {
  // Ensure the doctor data is loaded
  if (!doctor) return alert("Doctor data missing. Please log in again.");

  const printWindow = window.open("", "_blank", "width=900,height=900");
  if (!printWindow) return;

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  // --- DOCTOR & CLINIC MAPPING (Images 9 & 10) ---
  const clinicName = doctor.clinic?.name || "Clinic Name";
  const clinicAddress = doctor.clinic?.address || "Clinic Address";
  const drFullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
  const drRegNo = doctor.regNo || "—";
  const drMobile = doctor.mobile || "—";

  // --- PATIENT MAPPING ---
  // IMPORTANT: Replace 'form' with your actual state variable name on this page
  const pName = form.fullName || "________________";
  const pMobile = form.mobile || "________________";
  const pAge = form.age || "___";
  const pGender = form.gender || "___";
  const pBlood = form.bloodGroup || "___";

  printWindow.document.write(`
    <html>
      <head>
        <title>Referral Letter</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.4; }
          .header-main { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
          .header-left { width: 55%; }
          .header-left h1 { margin: 0; font-size: 26px; text-transform: uppercase; }
          .header-right { width: 40%; text-align: right; font-size: 14px; }
          
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .label { font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; }
          .value { font-size: 15px; font-weight: 600; color: #0f172a; }
          
          .sig-box { text-align: center; margin-top: 80px; float: right; }
          .sig-line { width: 220px; border-top: 2px solid #334155; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="header-main">
          <div class="header-left">
            <h1>${clinicName}</h1>
            <p>${clinicAddress}</p>
          </div>
          <div class="header-right">
            <h3>${drFullName}</h3>
            <p>${doctor.degree || "MBBS"}</p>
            <p>Reg No: ${drRegNo}</p>
            <p>Mob: ${drMobile}</p>
            <p style="margin-top:5px;"><strong>Date:</strong> ${today}</p>
          </div>
        </div>

        <h2 style="text-align:center; text-decoration:underline; margin: 30px 0;">REFERRAL LETTER</h2>

        <div class="card">
          <div><div class="label">Patient Name</div><div class="value">${pName}</div></div>
          <div><div class="label">Mobile</div><div class="value">${pMobile}</div></div>
          <div><div class="label">Age / Gender</div><div class="value">${pAge}Y / ${pGender}</div></div>
          <div><div class="label">Blood Group</div><div class="value">${pBlood}</div></div>
        </div>

        <div class="card" style="background: white;">
          <div>
            <div class="label">Referred To</div>
            
              Dr. ${form.referral.targetName || "________________"}
          </div>
          <div>
            <div class="label">Urgency</div>
            <div class="value">${(form.referral.urgency || "NORMAL").toUpperCase()}</div>
          </div>
        </div>

        <div style="margin-top:20px;">
          <div class="label" style="border-bottom:1px solid #cbd5e1; padding-bottom:5px; margin-bottom: 10px;">
            Clinical Reasons & Observations
          </div>
          <div style="white-space: pre-wrap; font-size: 15px;">
            ${form.referral.reason || "Referred for specialist evaluation."}
          </div>
        </div>

        <div class="sig-box">
          <div class="sig-line"></div>
          <strong>Authorized Signature</strong>
          <div style="font-size: 12px;">${drFullName}</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 300);
};

const openFitnessCertificateForm = () => {
  if (!doctor) return alert("Doctor data missing.");

  const certWindow = window.open("", "_blank", "width=800,height=850");
  if (!certWindow) return;

  const pName = form.fullName || "";
  const pAge = form.age || "";
  const pGender = form.gender || "";
  const pAddress = form.address || "";
  const today = new Date().toISOString().split('T')[0];

  certWindow.document.write(`
    <html>
      <head>
        <title>Fitness Certificate Form</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 30px; background: #f1f5f9; color: #1e293b; }
          .form-container { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h2 { border-bottom: 2px solid #2563eb; padding-bottom: 10px; color: #2563eb; }
          .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
          .field { display: flex; flexDirection: column; gap: 5px; }
          label { font-weight: 600; font-size: 14px; color: #64748b; }
          input, textarea { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; width: 100%; box-sizing: border-box; }
          .actions { margin-top: 30px; display: flex; gap: 15px; justify-content: flex-end; }
          .btn { padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
          .btn-preview { background: #64748b; color: white; }
          .btn-print { background: #2563eb; color: white; }
        </style>
      </head>
      <body>
        <div class="form-container">
          <h2>Fitness Certificate Details</h2>
          <div class="row">
            <div class="field"><label>Patient Name</label><input type="text" id="pName" value="${pName}"></div>
            <div class="field"><label>Date of Certificate</label><input type="date" id="certDate" value="${today}"></div>
          </div>
          <div class="row">
            <div class="field"><label>Age</label><input type="text" id="pAge" value="${pAge}"></div>
            <div class="field"><label>Gender</label><input type="text" id="pGender" value="${pGender}"></div>
          </div>
          <div class="field" style="margin-top:10px;">
            <label>Address</label>
            <textarea id="pAddress" rows="2">${pAddress}</textarea>
          </div>
          <div class="field" style="margin-top:15px;">
            <label>Fitness Statement (Fit to resume from:)</label>
            <input type="date" id="fitDate" value="${form.followUp.date || today}">
          </div>
          <div class="field" style="margin-top:15px;">
            <label>Remarks / Clinical Findings</label>
            <textarea id="remarks" rows="3">${form.referral.reason || ""}</textarea>
          </div>

          <div class="actions">
            <button class="btn btn-preview" onclick="generatePreview(false)">Preview</button>
            <button class="btn btn-print" onclick="generatePreview(true)">Print</button>
          </div>
        </div>

        <script>
          function generatePreview(shouldPrint) {
            const data = {
              name: document.getElementById('pName').value,
              date: document.getElementById('certDate').value,
              age: document.getElementById('pAge').value,
              gender: document.getElementById('pGender').value,
              address: document.getElementById('pAddress').value,
              fitDate: document.getElementById('fitDate').value,
              remarks: document.getElementById('remarks').value,
              clinicName: "${doctor.clinic?.name || 'Clinic'}",
              clinicAddr: "${doctor.clinic?.address || 'Address'}",
              drName: "Dr. ${doctor.firstName} ${doctor.lastName}",
              regNo: "${doctor.regNo || ''}"
            };

            const previewWindow = window.open("", "_blank", "width=850,height=900");
            const html = \`
              <html>
                <head>
                  <style>
                    body { font-family: 'Times New Roman', serif; padding: 50px; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid black; margin-bottom: 30px; }
                    .title { text-align: center; text-decoration: underline; font-size: 22px; font-weight: bold; margin: 30px 0; }
                    .sig { margin-top: 80px; float: right; text-align: center; }
                  </style>
                </head>
                <body>
                  <div class="header"><h1>\${data.clinicName}</h1><p>\${data.clinicAddr}</p></div>
                  <div class="title">MEDICAL FITNESS CERTIFICATE</div>
                  <p>Date: \${data.date}</p>
                  <p>This is to certify that I have examined <b>\${data.name}</b>, \${data.age}Y/\${data.gender}, 
                  residing at \${data.address}.</p>
                  <p>I find them clinically fit to resume their duties/activities from <b>\${data.fitDate}</b>.</p>
                  <p>Remarks: \${data.remarks}</p>
                  <div class="sig"><div style="border-top:1px solid black; width:200px;"></div><b>\${data.drName}</b><br>Reg: \${data.regNo}</div>
                </body>
              </html>\`;
            
            previewWindow.document.write(html);
            previewWindow.document.close();
            if(shouldPrint) {
              setTimeout(() => { previewWindow.focus(); previewWindow.print(); }, 200);
            }
          }
        </script>
      </body>
    </html>
  `);
  certWindow.document.close();
};

const openSicknessCertificateForm = () => {
  if (!doctor) return alert("Doctor data missing.");

  const certWindow = window.open("", "_blank", "width=800,height=850");
  if (!certWindow) return;

  const pName = form.fullName || "";
 /* const pAge = form.age || "";
  const pGender = form.gender || "";
  const pAddress = form.address || "";*/
  const today = new Date().toISOString().split('T')[0];

  certWindow.document.write(`
    <html>
      <head>
        <title>Sickness Certificate Form</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 30px; background: #f1f5f9; color: #1e293b; }
          .form-container { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h2 { border-bottom: 2px solid #e11d48; padding-bottom: 10px; color: #e11d48; }
          .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
          .field { display: flex; flex-direction: column; gap: 5px; }
          label { font-weight: 600; font-size: 14px; color: #64748b; }
          input, textarea { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; width: 100%; box-sizing: border-box; }
          .actions { margin-top: 30px; display: flex; gap: 15px; justify-content: flex-end; }
          .btn { padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
          .btn-preview { background: #64748b; color: white; }
          .btn-print { background: #e11d48; color: white; }
        </style>
      </head>
      <body>
        <div class="form-container">
          <h2>Sickness Certificate Details</h2>
          <div class="row">
            <div class="field"><label>Patient Name</label><input type="text" id="pName" value="${pName}"></div>
            <div class="field"><label>Certificate Date</label><input type="date" id="certDate" value="${today}"></div>
          </div>
          
          <div class="field" style="margin-top:10px;">
            <label>Diagnosis / Nature of Illness</label>
            <input type="text" id="diagnosis" placeholder="e.g. Viral Fever, Acute Gastritis" value="${form.referral.reason || ""}">
          </div>

          <div class="row" style="margin-top:15px;">
            <div class="field"><label>Rest From Date</label><input type="date" id="fromDate" value="${today}"></div>
            <div class="field"><label>Rest To Date (Inclusive)</label><input type="date" id="toDate" value="${form.followUp.date || ""}"></div>
          </div>

          <div class="field" style="margin-top:15px;">
            <label>Additional Advice (Optional)</label>
            <textarea id="advice" rows="2">Complete physical rest and medication as prescribed.</textarea>
          </div>

          <div class="actions">
            <button class="btn btn-preview" onclick="generateSicknessPreview(false)">Preview</button>
            <button class="btn btn-print" onclick="generateSicknessPreview(true)">Print</button>
          </div>
        </div>

        <script>
          function generateSicknessPreview(shouldPrint) {
            const data = {
              name: document.getElementById('pName').value,
              date: document.getElementById('certDate').value,
              diagnosis: document.getElementById('diagnosis').value,
              fromDate: document.getElementById('fromDate').value,
              toDate: document.getElementById('toDate').value,
              advice: document.getElementById('advice').value,
              clinicName: "${doctor.clinic?.name || 'Clinic'}",
              clinicAddr: "${doctor.clinic?.address || 'Address'}",
              drName: "Dr. ${doctor.firstName} ${doctor.lastName}",
              regNo: "${doctor.regNo || ''}"
            };

            const previewWindow = window.open("", "_blank", "width=850,height=900");
            const html = \`
              <html>
                <head>
                  <style>
                    body { font-family: 'Times New Roman', serif; padding: 60px; line-height: 1.8; }
                    .header { text-align: center; border-bottom: 2px solid black; margin-bottom: 40px; padding-bottom: 10px; }
                    .title { text-align: center; text-decoration: underline; font-size: 24px; font-weight: bold; margin: 30px 0; }
                    .content { text-align: justify; font-size: 18px; }
                    .sig { margin-top: 100px; float: right; text-align: center; }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h1 style="margin:0;">\${data.clinicName}</h1>
                    <p style="margin:5px;">\${data.clinicAddr}</p>
                  </div>
                  <div class="title">SICKNESS CERTIFICATE</div>
                  <div class="content">
                    <p>Date: <b>\${data.date}</b></p>
                    <p>This is to certify that <b>\${data.name}</b> is under my treatment for <b>\${data.diagnosis || "Medical Illness"}</b>.</p>
                    <p>I am of the opinion that they require rest for the recovery of their health for a period of 
                    <b>\${Math.ceil((new Date(data.toDate) - new Date(data.fromDate)) / (1000 * 60 * 60 * 24)) + 1} days</b>, 
                    starting from <b>\${data.fromDate}</b> to <b>\${data.toDate}</b> inclusive.</p>
                    <p>Advice: \${data.advice}</p>
                  </div>
                  <div class="sig">
                    <div style="border-top:1px solid black; width:220px; margin-bottom:5px;"></div>
                    <b>\${data.drName}</b><br>
                    Reg No: \${data.regNo}
                  </div>
                </body>
              </html>\`;
            
            previewWindow.document.write(html);
            previewWindow.document.close();
            if(shouldPrint) {
              setTimeout(() => { previewWindow.focus(); previewWindow.print(); }, 250);
            }
          }
        </script>
      </body>
    </html>
  `);
  certWindow.document.close();
};

/* ================= UI ================= */
return (
  <div style={styles.page}>
    <div style={styles.container}>
      <h1 style={styles.title}>Patients</h1>

      {/* ================= SEARCH (Always Visible) ================= */}
      <div style={styles.fullWidthCard}>
        <h3>Search Patient</h3>
        <div style={styles.searchRow}>
          <div style={styles.field}>
            <label>Search</label>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Filter</label>
            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value as "name" | "mobile")
              }
              style={styles.input}
            >
              <option value="name">Name</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <button onClick={searchPatients} style={styles.primaryBtn}>
            Search
          </button>
        </div>

        {/* SEARCH RESULT */}
        {patients.length > 0 ? (
          <table style={styles.searchTable}>
            <thead>
              <tr>
                <th style={{ ...styles.th, textAlign: "left" }}>Name</th>
                <th style={styles.th}>Age</th>
                <th style={styles.th}>Gender</th>
                <th style={styles.th}>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr
                  key={p._id}
                  onClick={() => navigate(`/patients/${p._id}`)}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f1f5f9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ ...styles.td, textAlign: "left" }}>{p.fullName}</td>
                  <td style={styles.td}>{p.age}</td>
                  <td style={styles.td}>{p.gender}</td>
                  <td style={styles.td}>{p.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          searched && (
            <div style={styles.noResult}>
              No record found
            </div>
          )
        )}
      </div>

      {/* TOGGLE BUTTON */}
      <div style={{ marginTop: 20, textAlign: "center", marginBottom: 20 }}>
        <button
          onClick={() => setShowAddPatient((prev) => !prev)}
          style={styles.primaryBtn}
        >
          {showAddPatient ? "Hide Add New Patient" : "Add New Patient"}
        </button>
      </div>

      {/* ================= CONDITIONAL SECTIONS ================= */}
      {showAddPatient && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. PERSONAL DETAILS */}
          <div style={styles.card}>
            <h3> Personal Details</h3>
            <div style={styles.grid3}>
              <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
              <Input label="Age" name="age" value={form.age} onChange={handleChange} />
              <Input label="Gender" name="gender" value={form.gender} onChange={handleChange} />
              <Input label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange}/>
              <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
              <Input label="Email" name="email" value={form.email} onChange={handleChange} />
              <div style={styles.field}>
              <label style={{ fontWeight: 600 }}>Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter full address..."
                style={{ 
                  ...styles.fullTextarea, 
                  height: "80px", 
                  background: "#333", 
                  color: "#fff" 
                }} 
              />
            </div>
            <div style={styles.field}>
              <label style={{ fontWeight: 600 }}>Blood Group</label>
              <select 
                name="bloodGroup" 
                value={form.bloodGroup} 
                onChange={handleChange} 
                style={{ ...styles.input, color: "#fff", background: "#333" }}
              >
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            </div>
          </div>

          {/* 2. ALLERGIES + VITALS ROW */}
          <div style={styles.clinicalRow}>
            
            {/* Left: Allergies Card (Takes up 2 parts of the grid) */}
            <div style={{ ...styles.fixedHeightCard }}>
              <h3>
                Allergies & Medical Alerts
              </h3>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <label style={{ fontWeight: 600, marginBottom: 8 }}>Specify Allergies</label>
                <textarea
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  placeholder="e.g. Penicillin, Peanuts..."
                  style={{ 
                    ...styles.fullTextarea, 
                    height: "100%", 
                    background: "#333", // Matching your dark UI in screenshot
                    color: "#fff" 
                  }} 
                />
              </div>
            </div>

            {/* Right: Vitals Card (Takes up 1 part of the grid) */}
            <div style={styles.fixedHeightCard}>
              <h3 style={{ textAlign: "center", marginTop: 0, marginBottom: 12 }}>Vitals</h3>
              <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
                <table style={{ ...styles.vitalsTable, width: "100%" }}>
                  <tbody>
                    {[
                      ["HEIGHT (cm)", "height"],
                      ["WEIGHT (kg)", "weight"],
                      ["TEMP (°F)", "temperature"],
                      ["PULSE (bpm)", "pulse"],
                      ["RESP (breaths/m)", "respirations"],
                      ["BP (mmHg)", "bp"],
                      ["SPO2 (%)", "spo2"],
                      ["WAIST (in)", "waist"],
                      ["HEAD (cm)", "head"],
                      ["FBS (mg/dL)", "bloodSugar"],
                      ["RBS (mg/dL)", "randomSugar"],
                    ].map(([label, key]) => (
                      <tr key={key}>
                        <td style={styles.vitalLabelCell}>{label}</td>
                        <td>
                          <input
                            name={key}
                            value={(form.vitals as any)[key]}
                            onChange={handleVitals}
                            style={{
                              ...styles.vitalInputSmall, 
                              width: "100%", 
                              background: "#333", 
                              color: "#fff",
                              boxSizing: "border-box"
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={styles.bmiBox}>
                  BMI : <strong>{calculateBMI() || "--"}</strong>
                </div>
              </div>
            </div>
          </div>  

          {/* 3. NEW BLANK CARD */}
          <div style={styles.card}>
            <h3 style={{ marginBottom: 16 }}>New Section Title</h3>
            <div style={{ minHeight: '100px', border: '1px dashed #cbd5e1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              {/* You can drop new content, inputs, or tables here later */}
              Blank Space for Future Content
            </div>
          </div>

          {/* 4. HISTORY CARD */}
          <div style={styles.card}>
            <h3 style={{ marginBottom: 16 }}>Medical History</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "15px",
              width: "100%",
              boxSizing: "border-box"
            }}>
              {[
                { label: "HIV", name: "hiv" },
                { label: "TB", name: "tb" },
                { label: "Diabetes", name: "diabetes" },
                { label: "Cancer", name: "cancer" },
                { label: "Chickenpox", name: "chickenpox" },
                { label: "Hypertension", name: "hypertension" },
                { label: "Asthma", name: "asthma" },
                { label: "Hepatitis", name: "hepatitis" },
                { label: "Thyroid", name: "thyroid" },
                { label: "Epilepsy", name: "epilepsy" },
              ].map((item) => (
                <label key={item.name} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  cursor: "pointer",
                  fontSize: "16px" 
                }}>
                  <input
                    type="checkbox"
                    // UPDATED: Prefixed with history. to match your universal handleChange logic
                    name={`history.${item.name}`} 
                    checked={(form.history as any)[item.name]}
                    // UPDATED: Use the universal handleChange that handles nested objects
                    onChange={handleChange} 
                    style={{ width: "18px", height: "18px" }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* PRESCRIPTION CARD (Full 100% Width) */}
          <div style={styles.prescriptionCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" }}>
              <h3 style={{ margin: 0, fontSize: "20px" }}>Prescription</h3>
            </div>

            <div style={styles.prescriptionGrid}>
              {/* Left Part: Medication Schedule */}
              <div>
                <h4 style={{ color: "#475569", marginBottom: "15px" }}>Medication Schedule</h4>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ ...styles.th, textAlign: "left", padding: "10px" }}>MEDICINE</th>
                      <th style={{ ...styles.th, width: "130px" }}>DURATION</th>
                      <th style={styles.th}>MOR</th>
                      <th style={styles.th}>AFT</th>
                      <th style={styles.th}>EVE</th>
                      <th style={styles.th}>NIGHT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.prescription.map((row, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 0" }}>
                          <select
                            style={{ ...styles.input, width: "95%" }}
                            value={row.medicine}
                            onChange={(e) => handlePrescription(index, "medicine", e.target.value)}
                          >
                            <option value="">Select Medicine</option>
                            {medicines.map((m) => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "10px 0" }}>
                          <div style={{ display: "flex", gap: "4px" }}>
                            <input
                              type="number"
                              style={{ ...styles.input, width: "45px" }}
                              value={row.duration}
                              onChange={(e) => handlePrescription(index, "duration", e.target.value)}
                            />
                            <select 
                              style={{ ...styles.input, width: "70px", fontSize: "12px" }}
                              value={row.durationType}
                              onChange={(e) => handlePrescription(index, "durationType", e.target.value)}
                            >
                              <option value="Days">Days</option>
                              <option value="Weeks">Weeks</option>
                            </select>
                          </div>
                        </td>
                        {["mor", "aft", "eve", "night"].map((t) => (
                          <td key={t} style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={(row as any)[t]}
                              onChange={(e) => handlePrescription(index, t, e.target.checked)}
                              style={{ cursor: "pointer", width: "16px", height: "16px" }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <button 
                  type="button" 
                  onClick={addMedicineRow} 
                  style={{ ...styles.primaryBtn, background: "white", color: "#2563eb", border: "1px solid #bfdbfe", marginTop: "15px" }}
                >
                  + Add Medicine
                </button>
              </div>

              {/* Right Part: Doctor Notes */}
              <div>
                <h4 style={{ color: "#475569", marginBottom: "15px" }}>Doctor Notes / Outside Medicines</h4>
                <textarea
                  name="doctorNotes"
                  value={form.doctorNotes}
                  onChange={handleChange}
                  placeholder="Enter additional clinical notes or medicines prescribed elsewhere..."
                  style={styles.noteArea}
                />
              </div>
            </div>
          </div>

          {/* 6. REFERENCE / REFERRAL CARD */}
          <div style={styles.prescriptionCard}>
              <h3 style={{ margin: "0 0 20px 0" }}>Patient Referral</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label>Refer to (Doctor/Center Name)</label>
                  <input 
                    name="referral.targetName"
                    style={{ ...styles.input, width: "70%" }}
                    value={form.referral.targetName}
                    onChange={handleChange}
                  />
                </div>
                <div style={styles.field}>
                <label>Urgency</label>
                <select 
                  name="referral.urgency" 
                  value={form.referral.urgency} 
                  onChange={handleChange} 
                  style={styles.input}
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
                <div>
                  <label>Specialty</label>
                  <select 
                    name="referral.specialty"
                    style={{ ...styles.input, width: "100%" }}
                    value={form.referral.specialty}
                    onChange={handleChange}
                  >
                    <option value="">Select Specialty</option>
                    {["Cardiology", "Neurology", "Radiology", "Orthopedics"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>


            <div style={{ marginTop: "20px" }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Reason for Referral / Clinical Findings</label>
              <textarea
                name="referral.reason" // This allows your universal handleChange to find it
                placeholder="Briefly describe why the patient is being referred..."
                style={{ ...styles.noteArea, height: "120px" }}
                value={form.referral.reason}
                onChange={handleChange} // Use your main handler for consistency
              />
            </div>

          {/* BUTTON */}
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <button
              type="button"
              onClick={printReferral}
              style={{
                padding: "8px 18px",
                background: "#059669",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              🖨 Print Referral Letter
            </button>
          </div>

          </div>


          {/* ===== FOLLOW-UP CARD ===== */}
          <div style={styles.prescriptionCard}>
            <h3 style={{ marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: "8px" }}>Follow-up</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              
              {/* Left Column: Follow-up After logic */}
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "end", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 600, fontSize: "14px", display: "block", marginBottom: "5px" }}>
                      Follow-up After
                    </label>
                    <input 
                      type="number" 
                      placeholder="Enter number"
                      style={{ ...styles.input, width: "70%" }} // Ensure style is applied
                      value={form.followUp.number}
                      onChange={(e) => handleFollowUpChange("followUp.number", e.target.value)} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <select 
                      style={styles.input} // Ensure style is applied
                      value={form.followUp.type}
                      onChange={(e) => handleFollowUpChange("followUp.type", e.target.value)}
                    >
                      <option value="Days">Days</option>
                      <option value="Weeks">Weeks</option>
                      <option value="Months">Months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "14px", display: "block", marginBottom: "5px" }}>
                    Follow-up Date
                  </label>
                  <input 
                    type="date" 
                    style={{ ...styles.input, width: "70%" }}
                    value={form.followUpDate} 
                    onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                  />
                  {/* Fixed "Scheduled on" logic: now checks followUpDate */}
                  {form.followUpDate && (
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                      Scheduled on: <strong>{new Date(form.followUpDate).toLocaleDateString('en-IN', { weekday: 'long' })}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Follow-up Notes */}
              <div>
                <label style={{ fontWeight: 600, fontSize: "14px", display: "block", marginBottom: "5px" }}>
                  Follow-up Note
                </label>
                <textarea
                  name="followUp.notes"
                  value={form.followUp.notes}
                  // Ensure you have a handleChange that supports nested objects OR use this:
                  onChange={(e) => setForm({
                    ...form,
                    followUp: { ...form.followUp, notes: e.target.value.slice(0, 120) }
                  })}
                  placeholder="Enter specific instructions for follow-up..."
                  style={{ 
                    ...styles.input, 
                    width: "70%",
                    height: "105px", 
                    resize: "none",
                    padding: "10px",
                    fontFamily: "inherit"
                  }}
                />
                <p style={{ textAlign: "right", fontSize: "11px", color: "#94a3b8" }}>
                  (Remaining: {120 - (form.followUp.notes?.length || 0)})
                </p>
              </div>
            </div>
          </div>

          {/* 7. FEES / CHARGES (MyOPD style) */}
          <div style={styles.prescriptionCard}>
            <h3 style={{ marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: "8px" }}>Fees & Payment</h3>

            <div
              style={{
                display: "grid",
                // Changed to auto-fit to prevent overlap on smaller screens
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "15px",
                alignItems: "end",
              }}
            >
              {/* Visit Charges */}
              <div style={styles.field}>
                <label style={{ fontWeight: 600, fontSize: "14px" }}>Visit Charges</label>
                <input
                  type="number"
                  name="fees.visitCharges"
                  value={form.fees.visitCharges}
                  onChange={handleChange}
                  placeholder="0.00"
                  style={{ ...styles.input, width: "50%" }}
                />
              </div>

              {/* Total Charges - Corrected ReadOnly UI */}
              <div style={styles.field}>
                <label style={{ fontWeight: 600, fontSize: "14px" }}>Total Charges</label>
                  <input
                    type="number"
                    name="fees.totalCharges"
                    value={form.fees.totalCharges}
                    readOnly // Important: System calculates this
                    style={{ ...styles.input, width: "50%", background: "#f1f5f9", cursor: "not-allowed", color: "#64748b" }}
                  />
              </div>

              {/* Previous Balance */}
              <div style={styles.field}>
                <label style={{ fontWeight: 600, fontSize: "14px" }}>Prev. Balance</label>
                <input
                  type="number"
                  name="fees.previousBalance"
                  value={form.fees.previousBalance}
                  onChange={handleChange}
                  style={{ ...styles.input, width: "50%" }}
                />
              </div>

              {/* Net Payable - Corrected ReadOnly UI */}
              <div style={styles.field}>
                <label style={{ fontWeight: 600, fontSize: "14px", color: "#16a34a" }}>Net Payable</label>
                <input
                  type="number"
                  name="fees.netPayable"
                  value={form.fees.netPayable}
                  readOnly // Important: System calculates this
                  style={{ ...styles.input, width: "50%", background: "#f0fdf4", color: "#16a34a", fontWeight: "bold" }}
                />
              </div>

              {/* Combined Discount & Type Field */}
              <div style={styles.field}>
                <label style={{ fontWeight: 600, fontSize: "14px" }}>Discount</label>
                <div style={{ display: "flex", gap: "4px" }}>
                  <input
                    type="number"
                    name="fees.discount"
                    value={form.fees.discount}
                    onChange={handleChange}
                    style={{ ...styles.input, width: "50%" , flex :2}}
                  />
                  <select
                    name="fees.discountType"
                    value={form.fees.discountType}
                    onChange={handleChange}
                    style={{ ...styles.input, flex: 1, padding: "8px 2px", minWidth: "50px", width:"50%"}}
                  >
                    <option value="Percent">%</option>
                    <option value="Amount">₹</option>
                  </select>
                </div>
              </div>

              {/* Payment Mode */}
              <div style={styles.field}>
                <label style={{ fontWeight: 600, fontSize: "14px" }}>Payment Mode</label>
                <select
                  name="fees.paymentMode"
                  value={form.fees.paymentMode}
                  onChange={handleChange}
                  style={{ ...styles.input, width: "85%" }}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            {/* Part Payment Box - Adjusted for better contrast */}
            <div style={{ marginTop: 15, padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", color: "#475569" }}>
                <input
                  type="checkbox"
                  name="fees.partPayment"
                  checked={form.fees.partPayment}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px" }}
                />
                <span style={{ fontSize: "15px", fontWeight: 500 }}>Enable Part Payment / Credit</span>
              </label>
            </div>
          </div>

          {/* 7. CERTIFICATES LINKS (Directly below Fees card) */}
          <div style={{ 
            marginTop: "10px", 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "15px", 
            padding: "0 5px" 
          }}>
            {[
              { label: "Fitness Certificate", icon: "💪" },
              { label: "Medical Certificate", icon: "🏥" },
              { label: "Sickness Certificate", icon: "🤒" },
              { label: "Leave Extension", icon: "📅" },
            ].map((cert) => (
              <div 
                key={cert.label} 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "#f1f5f9", // Subtle light grey/blue
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#475569",
                  transition: "all 0.2s",
                  border: "1px solid #e2e8f0"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#e0f2fe";
                  e.currentTarget.style.color = "#0369a1";
                  e.currentTarget.style.borderColor = "#bae6fd";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.color = "#475569";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
                onClick={() => {
                  if (cert.label === "Fitness Certificate") {
                    openFitnessCertificateForm();
                  } else if (cert.label === "Sickness Certificate" || cert.label === "Medical Certificate") {
                    openSicknessCertificateForm();
                  } else {
                    alert(`Generating ${cert.label}...`);
                  }
                }}
              >
                <span>{cert.icon}</span>
                <span>{cert.label}</span>
              </div>
            ))}
          </div>

          <p style={{ margin: "10px 0 0 10px", fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>
            * Select a link to generate a pre-filled document based on current clinical findings.
          </p>

          {/* SAVE BUTTON */}
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <button onClick={savePatient} style={styles.saveBtn}>
              Save
          </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}