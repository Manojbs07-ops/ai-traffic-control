import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Citizen Portal Pages
import UserDashboard from './pages/user/UserDashboard';
import CitizenReportViolation from './pages/user/ReportViolation';
import MyViolations from './pages/user/MyViolations';
import ViolationDetails from './pages/user/ViolationDetails';
import Payment from './pages/user/Payment';
import PaymentHistory from './pages/user/PaymentHistory';
import UserProfile from './pages/user/UserProfile';

// Police Portal Pages
import PoliceDashboard from './pages/police/PoliceDashboard';
import ReportViolation from './pages/police/ReportViolation';
import ManagePoliceViolations from './pages/police/ManageViolations';
import PoliceViolationDetails from './pages/police/ViolationDetails';
import PoliceProfile from './pages/police/PoliceProfile';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePolice from './pages/admin/ManagePolice';
import AdminManageViolations from './pages/admin/ManageViolations';
import AdminPayments from './pages/admin/Payments';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <AuthProvider>
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Citizen Routes */}
        <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/report" element={<CitizenReportViolation />} />
          <Route path="/user/violations" element={<MyViolations />} />
          <Route path="/user/violation/:id" element={<ViolationDetails />} />
          <Route path="/user/payment" element={<Payment />} />
          <Route path="/user/payment-history" element={<PaymentHistory />} />
          <Route path="/user/profile" element={<UserProfile />} />
        </Route>

        {/* Police Routes */}
        <Route element={<ProtectedRoute allowedRoles={['police']} />}>
          <Route path="/police/dashboard" element={<PoliceDashboard />} />
          <Route path="/police/report" element={<ReportViolation />} />
          <Route path="/police/violations" element={<ManagePoliceViolations />} />
          <Route path="/police/pending" element={<ManagePoliceViolations />} />
          <Route path="/police/approved" element={<ManagePoliceViolations />} />
          <Route path="/police/rejected" element={<ManagePoliceViolations />} />
          <Route path="/police/violation/:id" element={<PoliceViolationDetails />} />
          <Route path="/police/profile" element={<PoliceProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/police" element={<ManagePolice />} />
          <Route path="/admin/violations" element={<AdminManageViolations />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
