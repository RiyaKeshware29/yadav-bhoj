import { Navigate } from "react-router-dom";
import { useManager } from "../context/ManagerContext";

const ManagerProtectedRoute = ({ children }) => {
  const { manager } = useManager();

  if (!manager.isVerified || manager.role !== "manager") {
    return <Navigate to="/m/login" />;
  }

  return children;
};

export default ManagerProtectedRoute;
