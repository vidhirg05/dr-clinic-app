import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import Visits from "./pages/Visits";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import MyProfile from "./pages/MyProfile";
import MyMedicines from "./pages/MyMedicines";
import ChangePassword from "./pages/ChangePassword";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import ResetRequest from "./pages/ResetRequest";




function App() {
  return (
  
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/request-reset" element={<ResetRequest />} />
      <Route path="/new-password/:token" element={<NewPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<MainLayout><Home/></MainLayout>}/>
      <Route path="/patients" element={<MainLayout><Patients /></MainLayout>} />
      <Route path="/patients/:id" element={<MainLayout><PatientProfile /></MainLayout>} />
      <Route path="/visits" element={<MainLayout><Visits /></MainLayout>} />
      <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
      <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
      <Route path="/my-profile" element={<MainLayout><MyProfile /></MainLayout>} />
      <Route path="/my-medicines" element={<MainLayout><MyMedicines /></MainLayout>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
