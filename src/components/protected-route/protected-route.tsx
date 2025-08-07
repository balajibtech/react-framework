import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../store";
import "./protected-route.scss";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return isAuthenticated ? (
    <div className="protected-route">{children}</div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
