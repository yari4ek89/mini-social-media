// Import neccessary libraries
import { createContext, useContext, useState, useEffect } from "react"; // import createContext, useContext, useState, useEffect from react
import {
  loginUser,
  registerUser,
  logoutUser,
  me,
  checkUsername,
} from "../services/authService"; // import services from authorization service

// Create context
const AuthContext = createContext(undefined);

// Export context using
export const useAuth = () => useContext(AuthContext);

// Export AuthProvider
export default function AuthProvider({ children }) {
  // Defining var and states
  const [user, setUser] = useState(null); // user data
  const [ready, setReady] = useState(null); // ready or not
  const [lastAction, setLastAction] = useState("login"); // last action for private route, default - login, optional - register
  let data;

  // Use Effect to check me
  useEffect(() => {
    me()
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        setUser(null);
      })
      .finally(() => {
        setReady(true);
      });
  }, []);

  // Neccessary requests
  const login = async (form) => {
    data = await loginUser(form);
    setUser(data);
  };
  const logout = async () => {
    data = await logoutUser();
    setUser(null);
  };
  const registerFunc = async (form) => {
    data = await registerUser(form);
    setUser(data);
  };
  const checkUsernameContext = async (form) => {
    data = await checkUsername(form);
    return data.exists;
  };

  me()
    .then((res) => setUser(res.data))
    .catch((e) => setUser(null));

  // Return component
  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        login,
        logout,
        registerFunc,
        checkUsernameContext,
        lastAction,
        setLastAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
