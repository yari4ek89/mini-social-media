// Import neccessary libraries
import {Navigate} from "react-router-dom"; // navigate
import {useAuth} from "./AuthContext.jsx"; // useAuth

// Export PrivateRoute
export default function PrivateRoute({children}) {
    const {user, ready, lastAction} = useAuth();
    if (!ready) return <p>Loading....</p>; // check if user data is not ready -> wait
    return user?.user ? children : <Navigate to={lastAction} replace/>; // check if no user data -> /login
}
