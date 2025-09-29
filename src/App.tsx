import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import RegistrationsPage from "./pages/Registrations/RegistrationsPage";
import RegistrationDetailPage from "./pages/Registrations/RegistrationDetailPage";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/AuthPages/LoginPage";
import ParticipantsPage from "./pages/Participants/ParticipantsPage";
import ReferralCodesPage from "./pages/ReferralCodes/ReferralCodesPage";
import ProgramsPage from "./pages/Programs/ProgramsPage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Auth Routes - Outside AppLayout */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* Protected Routes */}
            <Route
              index
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            <Route
              path="/registrations"
              element={
                <PrivateRoute>
                  <RegistrationsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/registrations/:registrationId"
              element={
                <PrivateRoute>
                  <RegistrationDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/participants"
              element={
                <PrivateRoute>
                  <ParticipantsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/referral-codes"
              element={
                <PrivateRoute>
                  <ReferralCodesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/programs"
              element={
                <PrivateRoute>
                  <ProgramsPage />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Fallback Routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}
