import { Navigate } from "react-router-dom";



function ProtectedRoute({ children, role }) {

  //const token = localStorage.getItem("token");

  // No token

  // if (!token) {
  //   return <Navigate to="/login" />;
  //}

  try {

    // Decode token

    //const decoded = jwtDecode(token);

    // Check role

    //if (decoded.role !== role) {
      //return <Navigate to="/" />;
    //}

    return children;

  } catch (error) {

    // Invalid token

    localStorage.removeItem("token");

    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
