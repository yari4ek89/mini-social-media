// Import neccessary libraries
import { Navigate } from "react-router-dom"; // navigate
import { useAuth } from "./AuthContext"; // useAuth

// Export PrivateRoute
export default function PrivateRoute({ children }) {
  const { user, ready } = useAuth(); // declare authorization context
  const { lastAction } = useAuth();
  if (!ready) return <p>Loading....</p>; // check if user data is not ready -> wait
  return user ? children : <Navigate to="/login" replace />; // check if no user data -> /login
}
