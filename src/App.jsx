import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/page";
import CapturedTurtles from "./pages/captured-turtles/page";
import Terrapins from "./pages/terrapins/page";
import NestersPage from "./pages/nesters/NestersPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import "./index.css";


function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/captured-turtles" element={<CapturedTurtles />} />
          <Route path="/terrapins" element={<Terrapins />} />
          <Route path="/nesters" element={<NestersPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;