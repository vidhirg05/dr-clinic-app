
require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const patientRoutes = require("./routes/patient");
const vitalsRoutes = require("./routes/vitals");
const authRoutes = require("./routes/auth");
const visitRoutes = require("./routes/visits");
const medicineRoutes = require("./routes/medicine");
const doctorRoutes = require("./routes/doctor");
const clinicRoutes = require("./routes/clinic");


const app = express();


app.use(cors()); 
app.use(express.json());


app.use("/doctors", doctorRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/vitals", vitalsRoutes);
app.use("/visits", visitRoutes);
app.use("/medicines", medicineRoutes);


const mongoURI = process.env.MONGO_URI || "mongodb+srv://myclinic_admin:clinic-admin2@cluster0.xd0omox.mongodb.net/test";
console.log("MONGO_URI USED:", process.env.MONGO_URI);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log(" MongoDB Atlas connected");
    console.log("Connected to DB:", mongoose.connection.name);
  })
  .catch((err) => console.error(" MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});