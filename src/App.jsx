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
import { CustomerBookingsProvider } from "./context/CustomerBookingsContext";

import AdminRoute from "./context/AdminRoute";
import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";
import AdminBookingsPage from "./pages/admin/booking/AdminBookingsPage";
import AdminVehiclesPage from "./pages/admin/vehicle/AdminVehiclesPage";
import AdminCustomersPage from "./pages/admin/customer/AdminCustomersPage";
import AdminSalesReportsPage from "./pages/admin/salesReports/AdminSalesReportsPage";
import AdminUsersPage from "./pages/admin/user/AdminUsersPage";
import { AdminVehiclesProvider } from "./context/AdminVehiclesContext";
import AdminAddVehiclePage from "./pages/admin/vehicle/AdminAddVehiclePage";
import RootRedirect from "./pages/RootRedirect";
import { ToastProvider } from "./context/ToastContext";
import ArchivedVehiclesPage from "./pages/admin/vehicle/ArchivedVehiclesPage";
import { AdminBookingsProvider } from "./context/AdminBookingsContext";
import AdminNewBookingPage from "./pages/admin/booking/newBooking/AdminNewBookingPage";
import AdminBookingHistoryDetailsPage from "./pages/admin/booking/history/AdminBookingHistoryDetailsPage";
import AdminVehicleDraftsPage from "./pages/admin/vehicle/drafts/AdminVehicleDraftsPage";

import DispatcherRoute from "./context/DispatcherRoute";
import DispatcherDashboardPage from "./pages/dispatcher/dashboard/DispatcherDashboardPage";
import DispatcherInspectionPage from "./pages/dispatcher/inspection/DispatcherInspectionPage";
import DispatcherHistoryPage from "./pages/dispatcher/history/DispatcherHistoryPage";
import DispatcherProfilePage from "./pages/dispatcher/profile/DispatcherProfilePage";
import DispatcherInspectionWizardPage from "./pages/dispatcher/inspection/DispatcherInspectionWizardPage";
import AdminBookingDetailsPage from "./pages/admin/booking/details/AdminBookingDetailsPage";
import { CustomersProvider } from "./context/CustomersContext";
import { PaymentsProvider } from "./context/PaymentsContext";

// Staff-only data providers. Mounted only under /admin/* and /dispatcher/*,
// not the whole app, since these listeners carry staff-gated data.
function StaffProviders({ children }) {
  return (
    <AdminVehiclesProvider>
      <AdminBookingsProvider>
        <CustomersProvider>
          <PaymentsProvider>{children}</PaymentsProvider>
        </CustomersProvider>
      </AdminBookingsProvider>
    </AdminVehiclesProvider>
  );
}

function CustomerRoutesElement() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
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
      <Route path="/admin/login" element={<Navigate to={"/login"} replace />} />
      <Route
        path="/dispatcher/login"
        element={<Navigate to={"/login"} replace />}
      />
    </Routes>
  );
}

function AdminRoutesElement() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <AdminRoute>
            <PermissionRoute permission="view_reports">
              <AdminBookingsPage />
            </PermissionRoute>
          </AdminRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <AdminRoute>
            <PermissionRoute permission="manage_fleet">
              <AdminVehiclesPage />
            </PermissionRoute>
          </AdminRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <AdminRoute>
            <PermissionRoute permission="view_reports">
              <AdminCustomersPage />
            </PermissionRoute>
          </AdminRoute>
        }
      />
      <Route
        path="/sales-reports"
        element={
          <AdminRoute>
            <PermissionRoute permission="view_reports">
              <AdminSalesReportsPage />
            </PermissionRoute>
          </AdminRoute>
        }
      />
      <Route
        path="/users"
        element={
          <AdminRoute>
            <PermissionRoute permission="manage_staff">
              <AdminUsersPage />
            </PermissionRoute>
          </AdminRoute>
        }
      />
      <Route
        path="/vehicles/new"
        element={
          <AdminRoute>
            <PermissionRoute permission="manage_fleet">
              <AdminAddVehiclePage />
            </PermissionRoute>
          </AdminRoute>
        }
      />
      <Route
        path="/vehicles/:id/edit"
        element={
          <AdminRoute>
            <PermissionRoute permission="manage_fleet">
              <AdminAddVehiclePage />
            </PermissionRoute>
          </AdminRoute>
        }
      />
      <Route
        path="/vehicles/archived"
        element={
          <AdminRoute>
            <ArchivedVehiclesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={
          <AdminRoute>
            <AdminNewBookingPage />
          </AdminRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <AdminRoute>
            <AdminBookingDetailsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/bookings/history/:id"
        element={
          <AdminRoute>
            <AdminBookingHistoryDetailsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/vehicles/drafts"
        element={
          <AdminRoute>
            <AdminVehicleDraftsPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

function DispatcherRoutesElement() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <DispatcherRoute>
            <DispatcherDashboardPage />
          </DispatcherRoute>
        }
      />
      <Route
        path="/inspection"
        element={
          <DispatcherRoute>
            <DispatcherInspectionPage />
          </DispatcherRoute>
        }
      />
      <Route
        path="/history"
        element={
          <DispatcherRoute>
            <DispatcherHistoryPage />
          </DispatcherRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <DispatcherRoute>
            <DispatcherProfilePage />
          </DispatcherRoute>
        }
      />
      <Route
        path="/inspection/:bookingId"
        element={
          <DispatcherRoute>
            <DispatcherInspectionWizardPage />
          </DispatcherRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <div className="app">
      <ToastProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <StaffProvider>
                <VehiclesProvider>
                  <CustomerBookingsProvider>
                    <Routes>
                      <Route
                        path="/admin/*"
                        element={
                          <StaffProviders>
                            <AdminRoutesElement />
                          </StaffProviders>
                        }
                      />
                      <Route
                        path="/dispatcher/*"
                        element={
                          <StaffProviders>
                            <DispatcherRoutesElement />
                          </StaffProviders>
                        }
                      />
                      <Route path="/*" element={<CustomerRoutesElement />} />
                    </Routes>
                  </CustomerBookingsProvider>
                </VehiclesProvider>
              </StaffProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
