import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import LandingPage from "./pages/landing_page/LandingPage";
import ShowroomPage from "./pages/main_page/ShowroomPage";
import VehicleOverviewPage from "./pages/main_page/VehicleOverviewPage";
import LoginPage from "./pages/Login_Signup/LoginPage";
import AccountPage from "./pages/account/AccountPage";
import MyBookingsPage from "./pages/main_page/MyBookingsPage";
import PaymentMethodsPage from "./pages/account/PaymentMethodsPage";
import NotificationsPage from "./pages/account/NotificationsPage";
import SignupPage from "./pages/Login_Signup/SignupPage";
import BookingDetailsPage from "./pages/main_page/BookingDetailsPage";
import PaymentPage from "./pages/main_page/PaymentPage";
import PaymentSuccessPage from "./pages/main_page/PaymentSuccessPage";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
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
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;