import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/main-layout/main-layout";
import AdminLayout from "../layouts/admin-layout/admin-layout";
import Home from "../pages/home/home";
import Dashboard from "../pages/dashboard/dashboard";
import Login from "../pages/login/login";
import AdminUsers from "../pages/admin/admin-users/admin-users";
import AdminSettings from "../pages/admin/admin-settings/admin-settings";
import ProtectedRoute from "../components/protected-route/protected-route";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const AppRoutes: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={
              isAuthenticated ? <Navigate to="/admin" replace /> : <Home />
            }
          />
          <Route
            path="login"
            element={
              isAuthenticated ? <Navigate to="/admin" replace /> : <Login />
            }
          />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
