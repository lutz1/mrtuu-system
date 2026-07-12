import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import LandingPage from "./landing_page/LandingPage";
import LandingPageLoggedIn from "./main_page/LandingPageLoggedIn";
import ShowroomPage from "./main_page/ShowroomPage";
import VehicleOverviewPage from "./main_page/VehicleOverviewPage";
import LoginPage from "./Login_Signup/LoginPage";
import SignupPage from "./Login_Signup/SignupPage";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <LandingPageLoggedIn />
                </ProtectedRoute>
              }
            />
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
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;