import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CourtsPage from "./pages/CourtsPage.jsx";
import CourtDetailsPage from "./pages/CourtDetailsPage.jsx";
import AdminSchedulePage from "./pages/AdminSchedulePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminDeniedPage from "./pages/AdminDeniedPage.jsx";
import TrainingSportDetailsPage from "./pages/TrainingSportDetailsPage.jsx";
import CoachProfilePage from "./pages/CoachProfilePage.jsx";
import TrainingRegistrationPage from "./pages/TrainingRegistrationPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminTrainingRegistrationsPage from "./pages/AdminTrainingRegistrationsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courts" element={<CourtsPage />} />
          <Route path="/courts/:courtId" element={<CourtDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin-denied" element={<AdminDeniedPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* يبدأ مسار التدريب من صفحة الملاعب. */}
          <Route path="/training" element={<Navigate to="/courts" replace />} />
          <Route path="/training/coaches/:coachId" element={<CoachProfilePage />} />
          <Route path="/training/:sportId" element={<TrainingSportDetailsPage />} />

          <Route
            path="/training/register/:sportId"
            element={
              <ProtectedRoute>
                <TrainingRegistrationPage />
              </ProtectedRoute>
            }
          />

          <Route path="/training-registration" element={<Navigate to="/courts" replace />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users/:userId"
            element={
              <AdminRoute>
                <UserProfilePage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/training-registrations"
            element={
              <AdminRoute>
                <AdminTrainingRegistrationsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/schedule"
            element={
              <AdminRoute>
                <AdminSchedulePage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
