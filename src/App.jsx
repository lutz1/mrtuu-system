import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import { StaffProvider } from "./context/StaffContext";
import PermissionRoute from "./context/PermissionRoute";
import { VehiclesProvider } from "./context/VehiclesContext";
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

import AdminRoute from "./context/AdminRoute";
import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";
import AdminBookingsPage from "./pages/admin/booking/AdminBookingsPage";
import AdminChecklistPage from "./pages/admin/checklist/AdminChecklistPage";
import AdminVehiclesPage from "./pages/admin/vehicle/AdminVehiclesPage";
import AdminCustomersPage from "./pages/admin/customer/AdminCustomersPage";
import AdminSalesReportsPage from "./pages/admin/salesReports/AdminSalesReportsPage";
import AdminUsersPage from "./pages/admin/user/AdminUsersPage";
import { AdminVehiclesProvider } from "./context/AdminVehiclesContext";
import AdminAddVehiclePage from "./pages/admin/vehicle/AdminAddVehiclePage";
import RootRedirect from "./pages/RootRedirect";

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <VehiclesProvider>
          <AdminVehiclesProvider>
            <BrowserRouter>
              <AuthProvider>
                <StaffProvider>
                  <Routes>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route
                      path="/requirements"
                      element={<RequirementsPage />}
                    />
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

                    <Route
                      path="/admin/login"
                      element={<Navigate to={"/login"} replace />}
                    />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/bookings"
                      element={
                        <AdminRoute>
                          <PermissionRoute permission="view_reports">
                            <AdminBookingsPage />
                          </PermissionRoute>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/checklist"
                      element={
                        <AdminRoute>
                          <PermissionRoute permission="clearance_review">
                            <AdminChecklistPage />
                          </PermissionRoute>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/vehicles"
                      element={
                        <AdminRoute>
                          <PermissionRoute permission="manage_fleet">
                            <AdminVehiclesPage />
                          </PermissionRoute>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/customers"
                      element={
                        <AdminRoute>
                          <PermissionRoute permission="view_reports">
                            <AdminCustomersPage />
                          </PermissionRoute>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/sales-reports"
                      element={
                        <AdminRoute>
                          <PermissionRoute permission="view_reports">
                            <AdminSalesReportsPage />
                          </PermissionRoute>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <AdminRoute>
                          <PermissionRoute permission="manage_staff">
                            <AdminUsersPage />
                          </PermissionRoute>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/vehicles/new"
                      element={
                        <AdminRoute>
                          <PermissionRoute permission="manage_fleet">
                            <AdminAddVehiclePage />
                          </PermissionRoute>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/vehicles/:id/edit"
                      element={
                        <AdminRoute>
                          <PermissionRoute permission="manage_fleet">
                            <AdminAddVehiclePage />
                          </PermissionRoute>
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </StaffProvider>
              </AuthProvider>
            </BrowserRouter>
          </AdminVehiclesProvider>
        </VehiclesProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
