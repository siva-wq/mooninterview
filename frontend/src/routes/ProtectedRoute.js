import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");

  // No token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {

    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return <Navigate to="/login" replace />;
    }

    // Check role
    if (role && decoded.role !== role) {
      return <Navigate to="/" replace />;
    }

    return children;

  } catch (error) {

    console.error("Invalid Token:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;