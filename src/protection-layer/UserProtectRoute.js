// component/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (!user.isVerified) {
    return <Navigate to="/u/phone" replace />;
  }

  return children;
};

export default ProtectedRoute;
