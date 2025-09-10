import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminVerification = ({ children }) => {
  const adminData = useSelector((state) => state.admin); // ensure correct slice name

  if (!adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminVerification;
