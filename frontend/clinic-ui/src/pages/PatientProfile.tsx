import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

/* ================= TYPES ================= */
type Patient = {
  _id: string;
  fullName: string;
  age: string;
  gender: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  bloodGroup: string;
  allergies: string;
  medicalHistory?: string;
  history?: {
    [key: string]: boolean | undefined; 
    hiv: boolean;
    tb: boolean;
    diabetes: boolean;
    cancer: boolean;
    chickenpox: boolean;
    hypertension: boolean;
    asthma: boolean;
    hepatitis: boolean;
    thyroid: boolean;
    epilepsy: boolean;
  };
};

type Visit = {
  _id: string;
  createdAt: string;
  vitals: {
    height?: string;
    weight?: string;
    bp?: string;
    pulse?: string;
    temperature?: string;
    respirations?: string;
    spo2?: string;
    waist?: string;
    head?: string;
    bloodSugar?: string;
    randomSugar?: string;
    bmi?: string;
  };
  medical: {
    doctorNotes?: string;
    prescription: {
      medicine: string;
      duration?: string;      // Added
      durationType?: string;  // Added
      mor: boolean;
      aft: boolean;
      eve: boolean;
      night: boolean;
    }[];
  };
  // Matches your DB structure in image_2235c2.png
  referral?: {
    targetName: string;
    specialty: string;
    urgency: string;
  };
  followUp?: {
    date: string;
    notes: string;
  };
  fees?: {
    visitCharges: string;
    paymentMode: string;
  };
};


export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [formPatient, setFormPatient] = useState<Patient | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [historyInput, setHistoryInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [doctor, setDoctor] = useState<any>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [medicines, setMedicines] = useState<string[]>([]);

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
      duration: "",      // Added for the number (e.g., 5)
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
      spo2: "",          // Added: Oxygen Saturation
      waist: "",         // Added: Waist Circumference
      head: "",          // Added: Head Circumference (Pediatrics)
      bloodSugar: "",    // Added: Blood Glucose
      randomSugar: "",
      bmi: "",           // BMI will be calculated
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
  targetName: "",      // Dr. Name or Diagnostic Center
  specialty: "",       // Cardiology, Radiology, etc.
  reason: "",          // Why are they being referred?
  urgency: "Normal",   // Normal, Urgent, Emergency
  },

  followUp: {
    number: "",
    type: "Days",
    notes: ""
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

  /* ---------- NEW VISIT STATES ---------- */
  const [medicalForm, setMedicalForm] = useState({
    doctorNotes: "",
    prescription: [
      { medicine: "", mor: false, aft: false, eve: false, night: false },
    ],
  });

  const [vitalsForm, setVitalsForm] = useState({
    height: "",
    weight: "",
    temperature: "",
    pulse: "",
    respirations: "",
    bp: "",
  });

  /* ---------- REFERRAL ---------- */
  const [referralForm, setReferralForm] = useState({
    targetName: "",
    specialty: "",
    urgency: "Normal",
  });

  /* ---------- FOLLOW UP ---------- */
  const [followUpForm, setFollowUpForm] = useState({
    date: "",
    notes: "",
  });

  /* ---------- FEES ---------- */
  const [feesForm, setFeesForm] = useState({
    visitCharges: "",
    paymentMode: "Cash",
  });


  /* -------- FETCH DATA -------- */
  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/patients/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPatient(data);
        setFormPatient(data);
      });

    fetch(`${API_URL}/visits/${id}`)
      .then((res) => res.json())
      .then(setVisits);

    fetch(`${API_URL}/medicines`)
      .then((res) => res.json())
      .then((data) => setMedicines(data.map((m: any) => m.name)));
  }, [id]);

 /* -------- GET LOGGED-IN DOCTOR FROM LOCALSTORAGE -------- */
  useEffect(() => {
    const savedDoctor = localStorage.getItem("doctor");
    if (savedDoctor) {
      try {
        // Parse the string back into a JavaScript object
        setDoctor(JSON.parse(savedDoctor));
      } catch (err) {
        console.error("Error parsing doctor data:", err);
      }
    } else {
      console.warn("No doctor data found in localStorage. Please re-login.");
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


  /* -------- EDIT PATIENT -------- */
const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!formPatient) return;
  const { name, value } = e.target;

  if (name === "historyString") {
    // 1. Update the visible text box immediately
    setHistoryInput(value);

    // 2. Prepare the boolean object for the DB
    const typedKeys = value.toLowerCase().split(",").map((k) => k.trim());
    
    // Start with a clean slate of all false values
    const updatedHistory: any = {
      hiv: false, tb: false, diabetes: false, cancer: false,
      chickenpox: false, hypertension: false, asthma: false,
      hepatitis: false, thyroid: false, epilepsy: false
    };

    // Set to true only if the user typed it
    typedKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(updatedHistory, key)) {
        updatedHistory[key] = true;
      }
    });

    setFormPatient((prev: any) => ({ ...prev, history: updatedHistory }));
  } else {
    setFormPatient((prev: any) => ({ ...prev, [name]: value }));
  }
};

  const savePatientDetails = async () => {
    if (!formPatient || !id) return;
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPatient),
      });

      const updated = await res.json();
      setPatient(updated);
      setFormPatient(updated);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  /* -------- NEW VISIT HANDLERS -------- */
  const handleMedicalChange = (e: any) => {
    setMedicalForm({ ...medicalForm, [e.target.name]: e.target.value });
  };

  const handleHistoryChange = (key: string, value: boolean) => {
  if (!formPatient) return;
  setFormPatient({
    ...formPatient,
    history: {
      ...(formPatient.history || {}),
      [key]: value, 
    } as any, // The 'as any' tells TS we know what we're doing with the keys
  });
};

  const handlePrescriptionChange = (
    index: number,
    key: string,
    value: any
  ) => {
    const updated = [...medicalForm.prescription];
    (updated[index] as any)[key] = value;
    setMedicalForm({ ...medicalForm, prescription: updated });
  };

  const addMedicineRow = () => {
    setMedicalForm({
      ...medicalForm,
      prescription: [
        ...medicalForm.prescription,
        { medicine: "", mor: false, aft: false, eve: false, night: false },
      ],
    });
  };

  const handleVitalsChange = (e: any) => {
    setVitalsForm({ ...vitalsForm, [e.target.name]: e.target.value });
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

 const handlePrescription = (
  index: number,
  key: string,
  value: any
  ) => { 
    const updated = [...form.prescription];
    (updated[index] as any)[key] = value;
    setForm({ ...form, prescription: updated });
  };

  const printReferral = () => {
  if (!doctor || !patient) {
    alert("Please wait for all data to load.");
    return;
  }

  const printWindow = window.open("", "_blank", "width=900,height=900");
  if (!printWindow) return;

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  // --- FIXED MAPPING FROM IMAGES 9 & 10 ---
  // Clinic (Left Header)
  const clinicName = doctor.clinic?.name || "MY CLINIC NAME";
  const clinicAddress = doctor.clinic?.address || "Clinic Address Not Set";
  
  // Doctor (Right Header)
  const drName = `Dr. ${doctor.firstName || ""} ${doctor.lastName || ""}`;
  const drDegree = doctor.degree || "MBBS";
  const drReg = doctor.regNo || "REG-000"; // Note: 'regNo' from image 9
  const drMob = doctor.mobile || "0000000000";

  printWindow.document.write(`
    <html>
      <head>
        <title>Referral Letter - ${patient.fullName}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.4; }
          .header-main { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
          .header-left { width: 55%; }
          .header-left h1 { margin: 0; font-size: 26px; color: #0f172a; text-transform: uppercase; }
          .header-right { width: 40%; text-align: right; font-size: 14px; }
          .header-right h3 { margin: 0; font-size: 18px; }
          
          .doc-title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin: 25px 0; }
          
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .card-white { background: #ffffff; }
          
          .label { font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
          .value { font-size: 15px; font-weight: 600; color: #0f172a; }
          
          .observations { min-height: 100px; font-size: 15px; white-space: pre-wrap; padding: 5px 0; }
          
          .footer-container { margin-top: 80px; display: flex; justify-content: space-between; align-items: flex-end; }
          .footer-left { font-size: 11px; color: #94a3b8; }
          .sig-box { text-align: center; }
          .sig-line { width: 200px; border-top: 2px solid #334155; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="header-main">
          <div class="header-left">
            <h1>${clinicName}</h1>
            <p>${clinicAddress}</p>
          </div>
          <div class="header-right">
            <h3>${drName}</h3>
            <p>${drDegree}</p>
            <p>Reg No: ${drReg}</p>
            <p>Mob: ${drMob}</p>
            <p style="margin-top:5px;"><strong>Date:</strong> ${today}</p>
          </div>
        </div>

        <div class="doc-title">REFERRAL LETTER</div>

        <div class="card">
          <div><div class="label">Patient Name</div><div class="value">${patient.fullName}</div></div>
          <div><div class="label">Mobile Number</div><div class="value">${patient.mobile || "—"}</div></div>
          <div><div class="label">Age / Gender</div><div class="value">${patient.age}Y / ${patient.gender}</div></div>
          <div><div class="label">Blood Group</div><div class="value">${patient.bloodGroup || "—"}</div></div>
        </div>

        <div class="card card-white">
          <div>
            <div class="label">Referred To</div>
            <div class="value">Dr. ${form.referral.targetName || "________________"}</div>
            <div style="font-size:12px; color:#64748b;">${form.referral.specialty || ""}</div>
          </div>
          <div><div class="label">Urgency Status</div><div class="value">${(form.referral.urgency || "NORMAL").toUpperCase()}</div></div>
        </div>

        <div style="margin-top:25px;">
          <div style="font-weight:bold; border-bottom:1px solid #cbd5e1; margin-bottom:8px; font-size:13px; color:#475569; text-transform:uppercase;">Clinical Reasons & Observations</div>
          <div class="observations">${form.referral.reason || "Referred for consultation."}</div>
        </div>

        <div class="footer-container">
          <div class="footer-left">Generated via "${clinicName}" Software</div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div style="font-weight:bold; font-size:14px;">Authorized Signature</div>
            <div style="font-size:12px; margin-top:2px;">${drName}</div>
          </div>
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

const handleFollowUpChange = (name, value) => {
  let updatedFollowUp = { ...form.followUp };

  // Update the specific field
  if (name === "followUp.number") updatedFollowUp.number = value;
  if (name === "followUp.type") updatedFollowUp.type = value;

  let calculatedDate = form.followUpDate;

  // Auto-calculate logic
  const num = parseInt(updatedFollowUp.number);
  if (!isNaN(num) && num > 0) {
    const d = new Date();
    if (updatedFollowUp.type === "Days") d.setDate(d.getDate() + num);
    if (updatedFollowUp.type === "Weeks") d.setDate(d.getDate() + num * 7);
    if (updatedFollowUp.type === "Months") d.setMonth(d.getMonth() + num);
    calculatedDate = d.toISOString().split("T")[0];
  }

  setForm({
    ...form,
    followUp: updatedFollowUp,
    followUpDate: calculatedDate
  });
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

 const saveVisit = async () => {
  if (!id) return;
  setSaving(true);

  // 1. Prepare data objects
  const vitalsPayload = {
    patientId: id,
    ...form.vitals,
    bmi: calculateBMI(),
    recordedAt: new Date(), // Important for trend tracking
  };

  const visitPayload = {
    patientId: id,
    vitals: vitalsPayload,
    medical: {
      doctorNotes: form.doctorNotes,
      prescription: form.prescription,
    },
    referral: form.referral,
    followUp: form.followUp,
    fees: form.fees,
  };

  try {
    // --- PART A: Save to Visits Collection ---
    const res = await fetch(`${API_URL}/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitPayload),
    });

    if (!res.ok) throw new Error("Failed to save visit");

    // --- PART B: Save to Standalone Vitals Collection (The missing piece) ---
    // This ensures your separate 'vitals' collection is no longer empty
    await fetch(`${API_URL}/vitals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vitalsPayload),
    });

    // 2. Fetch updated history immediately 
    const historyRes = await fetch(`${API_URL}/visits/${id}`);
    const updatedVisits = await historyRes.json();
    setVisits(updatedVisits);

    // 3. Reset the form state to clear all textboxes
    setForm((prev) => ({
      ...prev,
      doctorNotes: "",
      prescription: [
        { medicine: "", duration: "", durationType: "Days", mor: false, aft: false, eve: false, night: false }
      ],
      vitals: { 
        height: "", weight: "", temperature: "", pulse: "", respirations: "", 
        bp: "", spo2: "", waist: "", head: "", bloodSugar: "", randomSugar: "", bmi: "" 
      },
      referral: { targetName: "", specialty: "", reason: "", urgency: "Normal" },
      followUp: { number: "", type: "Days", date: "", notes: "" },
      fees: { 
        visitCharges: "", totalCharges: "", previousBalance: "0", netPayable: "", 
        discount: "", discountType: "Percent", paymentMode: "Cash", partPayment: false 
      },
    }));

    alert("Visit saved successfully!");

  } catch (err) {
    console.error("Save Error:", err);
    alert("Error: Could not save visit.");
  } finally {
    setSaving(false);
  }
};

  if (!patient) return <div style={{ padding: 20 }}>Loading...</div>;

/*-------UI-------*/
return (
    <div
  style={{
    background: "#f1f5f9",
    minHeight: "100vh",
    padding: "24px 0",
    overflowX: "hidden",
    boxSizing: "border-box",
  }}
>
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 24px",
    }}
  >
      <button onClick={() => navigate("/patients")} style={backBtn}>
        ← Back to Patients
      </button>

      <h2 style={{ textAlign: "center", margin: "16px 0", color:"#000" }}>
        Patient Profile
      </h2>

      {/* 1. PATIENT DETAILS  */}
      <div
        style={{
          ...cardStyle,
          width: "100%",
          margin: "0 auto 24px",
        }}
      >

        <div style={headerRow}>
          <h3>Patient Details</h3>
          <button
  style={editBtn}
  // Find your Edit Details button and update the onClick:
onClick={() => {
  if (!editMode) {
    setFormPatient({ ...patient });
    // Pre-fill the text box with current true values
    const currentHistory = Object.entries(patient?.history || {})
      .filter(([_, val]) => val === true)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(", ");
    setHistoryInput(currentHistory);
  }
  setEditMode(!editMode);
}}
>
  {editMode ? "Cancel" : "Edit Details"}
</button>
        </div>

        <div style={detailsGrid}>
      {/* 1. RENDER STANDARD FIELDS */}
      {[
        ["Full Name", "fullName"],
        ["Age", "age"],
        ["Gender", "gender"],
        ["DOB", "dob"],
        ["Mobile", "mobile"],
        ["Email", "email"],
        ["Address", "address"],
        ["Blood Group", "bloodGroup"],
        ["Allergies", "allergies"],
      ].map(([label, key]) => (
        <div key={key}>
          <label style={labelStyle}>{label}</label>
          {editMode ? (
            <input
              name={key}
              value={(formPatient as any)?.[key] || ""}
              onChange={handlePatientChange}
              style={inputStyle}
            />
          ) : (
            <div>{(patient as any)?.[key] || "-"}</div>
          )}
        </div>
      ))}

      {/* 2. RENDER MEDICAL HISTORY */}
    <div style={{ gridColumn: "span 2", marginTop: "10px" }}>
  <label style={labelStyle}>Medical History</label>
  {editMode ? (
    <input
      name="historyString"
      value={historyInput} // Use the new state variable here
      onChange={handlePatientChange}
      placeholder="e.g. Asthma, HIV"
      style={inputStyle}
    />
  ) : (
    <div style={{ color: "#000" }}>
      {patient?.history && Object.values(patient.history).includes(true) ? 
        Object.entries(patient.history)
          .filter(([_, value]) => value === true)
          .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
          .join(", ") 
        : "None"}
    </div>
  )}
</div>
    </div>
    {editMode && (
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <button onClick={savePatientDetails} style={saveBtn}>
              Save Changes
            </button>
          </div>
        )}
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

      {/* 4. PRESCRIPTION CARD (Full 100% Width) */}
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

        {/* 5. REFERENCE / REFERRAL CARD */}
          <div style={styles.prescriptionCard}>
              <h3 style={{ margin: "0 0 20px 0" }}>Patient Referral</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label>Refer to (Doctor/Center Name)</label>
                  <input 
                    name="referral.targetName"
                    style={{ ...styles.input, width: "80%" }}
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
                placeholder="Briefly describe why the patient is being referred..."
                style={{ ...styles.noteArea, height: "120px" }}
                value={form.referral.reason}
                onChange={(e) => setForm({...form, referral: {...form.referral, reason: e.target.value}})}
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

          {/* 6. FOLLOW-UP CARD */}
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
                      value={form.followUp?.number || ""}
                      onChange={(e) => handleFollowUpChange("followUp.number", e.target.value)}
                      style={{ ...styles.input, width: "70%" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <select
                      value={form.followUp?.type || "Days"}
                      onChange={(e) => handleFollowUpChange("followUp.type", e.target.value)}
                      style={{ ...styles.input, width: "70%" }}
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
                    value={form.followUpDate || ""} 
                    onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                    style={{ ...styles.input, width: "70%" }}
                  />
                  
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
                  value={form.followUp?.notes || ""}
                  onChange={(e) => setForm({
                    ...form,
                    followUp: { ...form.followUp, notes: e.target.value }
                  })}
                  placeholder="Enter specific instructions for follow-up..."
                  style={{ 
                    ...styles.input, 
                    height: "105px", 
                    resize: "none",
                    padding: "10px",
                    fontFamily: "inherit",
                    width: "90%",
                  }}
                />
                <p style={{ textAlign: "right", fontSize: "11px", color: "#94a3b8" }}>
                  (Remaining: {120 - (form.followUp?.notes?.length || 0)})
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
              style={{ ...styles.input, width: "40%" }}
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
                style={{ ...styles.input, width: "40%", background: "#f1f5f9", cursor: "not-allowed", color: "#64748b" }}
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
              style={{ ...styles.input, width: "40%" }}
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
              style={{ ...styles.input, width: "40%", background: "#f0fdf4", color: "#16a34a", fontWeight: "bold" }}
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
                style={{ ...styles.input, width: "40%" , flex :2}}
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
              style={{ ...styles.input, width: "60%" }}
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

      {/* 8. CERTIFICATES LINKS (Directly below Fees card) */}
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



      {/* 9. SAVE VISIT BUTTON */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        width: "100%", 
        marginTop: "30px",
        paddingBottom: "20px" 
      }}>
        <button onClick={saveVisit} style={saveBtn}>
          Save Visit
        </button>
      </div>

      {/* 10. VISIT HISTORY */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "20px" }}>Detailed Visit History</h3>

        {visits.length === 0 && <p style={{ color: "#64748b" }}>No previous visits found.</p>}

        {visits.map((v) => (
          <div
            key={v._id}
            style={{
              border: "1px solid #e5e7eb",
              borderLeft: "5px solid #2563eb",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "20px",
              background: "#ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}
          >
            {/* HEADER: Date & Charges */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <strong style={{ color: "#2563eb" }}>
                {new Date(v.createdAt).toLocaleString("en-IN", { dateStyle: 'medium', timeStyle: 'short' })}
              </strong>
              {v.fees && (
                <span style={{ color: "#16a34a", fontWeight: 600 }}>
                  ₹ {v.fees.visitCharges || "0"} ({v.fees.paymentMode || "Cash"})
                </span>
              )}
            </div>

            {/* VITALS - Dynamically shows all recorded vitals for this visit */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "10px",
                background: "#f8fafc",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "15px",
                border: "1px solid #e2e8f0"
              }}
            >
              {v.vitals && Object.entries(v.vitals).map(([key, value]) => {
                // Skip empty values and BMI (we display BMI separately below)
                if (!value || key === "bmi") return null;

                // Mapping keys to readable labels
                const labels: Record<string, string> = {
                  height: "Height",
                  weight: "Weight",
                  temperature: "Temp",
                  pulse: "Pulse",
                  respirations: "Resp",
                  bp: "BP",
                  spo2: "SPO2",
                  waist: "Waist",
                  head: "Head",
                  bloodSugar: "FBS",
                  randomSugar: "RBS"
                };

                return (
                  <div key={key} style={{ fontSize: "13px", color: "#334155" }}>
                    <b style={{ color: "#64748b" }}>{labels[key] || key}:</b> {value}
                    {/* Add Units */}
                    {key === "weight" && " kg"}
                    {key === "height" && " cm"}
                    {key === "temperature" && " °F"}
                    {key === "spo2" && " %"}
                  </div>
                );
              })}

              {/* Highlighted BMI if it exists */}
              {v.vitals?.bmi && (
                <div style={{ fontSize: "13px" }}>
                  <b style={{ color: "#64748b" }}>BMI:</b>{" "}
                  <span style={{ color: "#dc2626", fontWeight: "bold" }}>{v.vitals.bmi}</span>
                </div>
              )}
            </div>

            {/* PRESCRIPTION TAGS */}
            {v.medical?.prescription?.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <b style={{ fontSize: "0.9rem" }}>Prescription:</b>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
                  {v.medical.prescription.map((p, i) => (
                    <div key={i} style={{ background: "#e0f2fe", padding: "6px 10px", borderRadius: "6px", fontSize: "0.85rem", border: "1px solid #bae6fd" }}>
                      <strong>{p.medicine}</strong>
                      {p.duration && ` — ${p.duration} ${p.durationType}`}
                      <span style={{ marginLeft: 6, color: "#0369a1", fontWeight: 600 }}>
                        ({[p.mor && "M", p.aft && "A", p.eve && "E", p.night && "N"].filter(Boolean).join("-")})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REFERRAL (Conditional) */}
            {v.referral && (v.referral.targetName || v.referral.specialty) && (
              <div style={{ marginBottom: "8px", fontSize: "0.9rem", borderTop: "1px dashed #e2e8f0", paddingTop: "8px" }}>
                <span style={{ color: "#ef4444", fontWeight: 600 }}>⤷ Referral: </span>
                <b>{v.referral.targetName}</b>
                {v.referral.specialty && <span style={{ color: "#64748b" }}> ({v.referral.specialty})</span>}
                {v.referral.urgency && (
                  <span style={{ marginLeft: "8px", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", background: v.referral.urgency === "Urgent" ? "#fee2e2" : "#f1f5f9", color: v.referral.urgency === "Urgent" ? "#dc2626" : "#475569" }}>
                    {v.referral.urgency}
                  </span>
                )}
              </div>
            )}

            {/* FOLLOW UP (Conditional) */}
            {v.followUp?.date && (
              <div style={{ fontSize: "0.85rem", color: "#475569", background: "#fff7ed", padding: "10px", borderRadius: "6px", marginTop: "8px", border: "1px solid #ffedd5" }}>
                <b style={{ color: "#c2410c" }}>📅 Next Follow-up:</b>{" "}
                {new Date(v.followUp.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                {v.followUp.notes && (
                  <div style={{ fontStyle: "italic", marginTop: "4px", color: "#9a3412", borderTop: "1px solid #fed7aa", paddingTop: "4px" }}>
                    Note: {v.followUp.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  ); 
}
/* ================= STYLES (UNCHANGED) ================= */
const cardStyle: React.CSSProperties = { 
  width: "100%",
  boxSizing: "border-box",
  background: "#fff",
  color: "#000",
  padding: 24,
  borderRadius: 12,
  marginBottom: 20,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const headerRow = { 
  color:"#000",
  display: "flex", 
  justifyContent: "space-between" 
};
const detailsGrid = { 
  display: "grid", 
  gridTemplateColumns: "repeat(2,1fr)", 
  gap: 16 
};
const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: 4,
  display: "block",
  color: "#000000ff",
};

const inputStyle = { 
  width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    boxSizing: "border-box", 
};
const editBtn = { 
  background: "#2563eb", 
  color: "#fff", 
  padding: "6px 12px" 
};
const saveBtn = { 
  background: "#16a34a", 
  color: "#fff", 
  padding: "8px 16px",
  
};
const backBtn = { 
  background: "#111827", 
  color: "#fff", 
  padding: "6px 12px" 
};
const styles: any = {
  splitRow: {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "60% 40%",
  gap: 22,
  alignItems: "flex-start",
  overflow: "hidden",
},
  card: cardStyle,
  textarea: { 
    width: "90%", 
    height: 90 
  },
  prescriptionTable: { 
    width: "100%", 
    marginTop: 12,
    borderCollapse: "collapse",
    tableLayout: "fixed",
    tableBorder: "1px solid #5d3f3f",
  },
  addMedicineBtn: { 
    marginTop: 12, 
    padding: "6px 12px" 
  },
  vitalsTable: { width: "90%", overflow: "hidden" },
  vitalLabelCell: { padding: 8 },
  vitalInputSmall: { width: 100 },
  bmiBox: { 
    textAlign: "center", 
    marginTop: 12 
  },
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
    color: "#000",
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
  color: "#000",
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
field: {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  width: "100%",
  boxSizing: "border-box"
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
    width: "100%",           // Forces the internal grid to span the whole card
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
  }
