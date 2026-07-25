import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import LandingPage from "./pages/user/landing_page/LandingPage";
import ShowroomPage from "./pages/user/main_page/ShowroomPage";
import VehicleOverviewPage from "./pages/user/main_page/VehicleOverviewPage";
import LoginPage from "./pages/Login_Signup/LoginPage";
import AccountPage from "./pages/user/account/AccountPage";
import MyBookingsPage from "./pages/user/main_page/MyBookingsPage";
import PaymentMethodsPage from "./pages/user/account/PaymentMethodsPage";
import NotificationsPage from "./pages/user/account/NotificationsPage";
import SignupPage from "./pages/Login_Signup/SignupPage";
import BookingDetailsPage from "./pages/user/main_page/BookingDetailsPage";
import PaymentPage from "./pages/user/main_page/PaymentPage";
import PaymentSuccessPage from "./pages/user/main_page/PaymentSuccessPage";
import PrivacySecurityPage from "./pages/user/security/PrivacySecurityPage";
import SettingsPage from "./pages/user/settings/SettingsPage";
import RequirementsPage from "./pages/user/requirements/RequirementsPage";
import ContactPage from "./pages/user/contact/ContactPage";
import { ThemeProvider } from "./context/ThemeContext";

import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminRoute from "./context/AdminRoute";
import AdminLoginPage from "./pages/admin/dashboard/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/requirements" element={<RequirementsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route
                  path="/showroom"
                  element={
                    <ProtectedRoute>
                      <ShowroomPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vehicle/:id"
                  element={
                    <ProtectedRoute>
                      <VehicleOverviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/payment"
                  element={
                    <ProtectedRoute>
                      <PaymentMethodsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking/:id"
                  element={
                    <ProtectedRoute>
                      <BookingDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/:id"
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment-success/:id"
                  element={
                    <ProtectedRoute>
                      <PaymentSuccessPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/security"
                  element={
                    <ProtectedRoute>
                      <PrivacySecurityPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </AdminAuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;