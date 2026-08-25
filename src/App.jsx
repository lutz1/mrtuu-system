import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import { StaffProvider } from "./context/StaffContext";
import PermissionRoute from "./context/PermissionRoute";
import { VehiclesProvider } from "./context/VehiclesContext";
import { ThemeProvider, ThemeGate } from "./context/ThemeContext";
import { CustomerBookingsProvider } from "./context/CustomerBookingsContext";

import AdminRoute from "./context/AdminRoute";
import { AdminVehiclesProvider } from "./context/AdminVehiclesContext";
import { AdminBookingsProvider } from "./context/AdminBookingsContext";
import { CustomersProvider } from "./context/CustomersContext";
import { ToastProvider } from "./context/ToastContext";
import DispatcherRoute from "./context/DispatcherRoute";

import RootRedirect from "./pages/RootRedirect";

// Route-level code splitting: every page is lazy-loaded so the initial
// bundle only ships what the entry route needs. Heavy dashboards (admin
// charts, dispatcher inspection, Firebase auth flows) load on demand.
const ShowroomPage = lazy(() => import("./pages/user/main_page/ShowroomPage"));
const VehicleOverviewPage = lazy(() => import("./pages/user/main_page/VehicleOverviewPage"));
const LoginPage = lazy(() => import("./pages/Login_Signup/LoginPage"));
const AccountPage = lazy(() => import("./pages/user/account/AccountPage"));
const MyBookingsPage = lazy(() => import("./pages/user/main_page/MyBookingsPage"));
const PaymentMethodsPage = lazy(() => import("./pages/user/account/PaymentMethodsPage"));
const NotificationsPage = lazy(() => import("./pages/user/account/NotificationsPage"));
const SignupPage = lazy(() => import("./pages/Login_Signup/SignupPage"));
const BookingDetailsPage = lazy(() => import("./pages/user/main_page/BookingDetailsPage"));
const PaymentPage = lazy(() => import("./pages/user/main_page/PaymentPage"));
const PaymentSuccessPage = lazy(() => import("./pages/user/main_page/PaymentSuccessPage"));
const PrivacySecurityPage = lazy(() => import("./pages/user/security/PrivacySecurityPage"));
const SettingsPage = lazy(() => import("./pages/user/settings/SettingsPage"));
const RequirementsPage = lazy(() => import("./pages/user/requirements/RequirementsPage"));
const ContactPage = lazy(() => import("./pages/user/contact/ContactPage"));

const AdminDashboardPage = lazy(() => import("./pages/admin/dashboard/AdminDashboardPage"));
const AdminBookingsPage = lazy(() => import("./pages/admin/booking/AdminBookingsPage"));
const AdminVehiclesPage = lazy(() => import("./pages/admin/vehicle/AdminVehiclesPage"));
const AdminCustomersPage = lazy(() => import("./pages/admin/customer/AdminCustomersPage"));
const AdminSalesReportsPage = lazy(() => import("./pages/admin/salesReports/AdminSalesReportsPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/user/AdminUsersPage"));
const AdminAddVehiclePage = lazy(() => import("./pages/admin/vehicle/AdminAddVehiclePage"));
const ArchivedVehiclesPage = lazy(() => import("./pages/admin/vehicle/ArchivedVehiclesPage"));
const AdminNewBookingPage = lazy(() => import("./pages/admin/booking/newBooking/AdminNewBookingPage"));
const AdminBookingHistoryDetailsPage = lazy(() => import("./pages/admin/booking/history/AdminBookingHistoryDetailsPage"));
const AdminVehicleDraftsPage = lazy(() => import("./pages/admin/vehicle/drafts/AdminVehicleDraftsPage"));
const AdminBookingDetailsPage = lazy(() => import("./pages/admin/booking/details/AdminBookingDetailsPage"));

const DispatcherDashboardPage = lazy(() => import("./pages/dispatcher/dashboard/DispatcherDashboardPage"));
const DispatcherInspectionPage = lazy(() => import("./pages/dispatcher/inspection/DispatcherInspectionPage"));
const DispatcherHistoryPage = lazy(() => import("./pages/dispatcher/history/DispatcherHistoryPage"));
const DispatcherProfilePage = lazy(() => import("./pages/dispatcher/profile/DispatcherProfilePage"));
const DispatcherInspectionWizardPage = lazy(() => import("./pages/dispatcher/inspection/DispatcherInspectionWizardPage"));

function App() {
  return (
    <div className="app">
      <ToastProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              {/* Always light mode while logged out; logged-in users keep their saved theme */}
              <ThemeGate />
              <StaffProvider>
                <VehiclesProvider>
                  <AdminVehiclesProvider>
                    <AdminBookingsProvider>
                      <CustomersProvider>
                        <CustomerBookingsProvider>
                          <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
                            <Routes>
                              <Route path="/" element={<RootRedirect />} />
                              <Route
                                path="/home"
                                element={<Navigate to="/" replace />}
                              />
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
                              <Route
                                path="/admin/vehicles/archived"
                                element={
                                  <AdminRoute>
                                    <ArchivedVehiclesPage />
                                  </AdminRoute>
                                }
                              />
                              <Route
                                path="/admin/bookings/new"
                                element={
                                  <AdminRoute>
                                    <AdminNewBookingPage />
                                  </AdminRoute>
                                }
                              />
                              <Route
                                path="/dispatcher/login"
                                element={<Navigate to={"/login"} replace />}
                              />
                              <Route
                                path="/dispatcher/dashboard"
                                element={
                                  <DispatcherRoute>
                                    <DispatcherDashboardPage />
                                  </DispatcherRoute>
                                }
                              />
                              <Route
                                path="/dispatcher/inspection"
                                element={
                                  <DispatcherRoute>
                                    <DispatcherInspectionPage />
                                  </DispatcherRoute>
                                }
                              />
                              <Route
                                path="/dispatcher/history"
                                element={
                                  <DispatcherRoute>
                                    <DispatcherHistoryPage />
                                  </DispatcherRoute>
                                }
                              />
                              <Route
                                path="/dispatcher/profile"
                                element={
                                  <DispatcherRoute>
                                    <DispatcherProfilePage />
                                  </DispatcherRoute>
                                }
                              />
                              <Route
                                path="/dispatcher/inspection/:bookingId"
                                element={
                                  <DispatcherRoute>
                                    <DispatcherInspectionWizardPage />
                                  </DispatcherRoute>
                                }
                              />
                              <Route
                                path="/admin/bookings/:id"
                                element={
                                  <AdminRoute>
                                    <AdminBookingDetailsPage />
                                  </AdminRoute>
                                }
                              />
                              <Route
                                path="/admin/bookings/history/:id"
                                element={
                                  <AdminRoute>
                                    <AdminBookingHistoryDetailsPage />
                                  </AdminRoute>
                                }
                              />
                              <Route
                                path="/admin/vehicles/drafts"
                                element={
                                  <AdminRoute>
                                    <AdminVehicleDraftsPage />
                                  </AdminRoute>
                                }
                              />
                            </Routes>
                          </Suspense>
                        </CustomerBookingsProvider>
                      </CustomersProvider>
                    </AdminBookingsProvider>
                  </AdminVehiclesProvider>
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
