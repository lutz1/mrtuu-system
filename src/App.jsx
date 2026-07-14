import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import LandingPage from "./landing_page/LandingPage";
import ShowroomPage from "./main_page/ShowroomPage";
import VehicleOverviewPage from "./main_page/VehicleOverviewPage";
import LoginPage from "./Login_Signup/LoginPage";
import AccountPage from "./main_page/AccountPage"
import SignupPage from "./Login_Signup/SignupPage";
import BookingDetailsPage from "./main_page/BookingDetailsPage";
import PaymentPage from "./main_page/PaymentPage";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Old /home links/bookmarks still work, redirected to the merged page */}
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
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;