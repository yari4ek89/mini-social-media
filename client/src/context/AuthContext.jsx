// Import neccessary libraries
import {createContext, useContext, useEffect, useState} from "react"; // import createContext, useContext, useState, useEffect from react
import {checkUsername, getUsers, loginUser, logoutUser, me, registerUser} from "../services/authService.js";

// Create context
const AuthContext = createContext(undefined);

// Export context using
export const useAuth = () => useContext(AuthContext);

// Export AuthProvider
export default function AuthProvider({children}) {
    // Defining var and states
    const [user, setUser] = useState([]); // user data
    const [ready, setReady] = useState(false); // ready or not
    const [lastAction, setLastAction] = useState("login"); // last action for private route, default - login, optional - register
    const [users, setUsers] = useState([]);
    let data;

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [meRes] = await Promise.all([
                    me(),
                    getAllUsers(),
                ]);
                if (cancelled) return;

                setUser(meRes || []);
            } catch (err) {
                if (cancelled) return;
                setUser([]);
                setUsers([]);
            } finally {
                if (!cancelled) setReady(true);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // Neccessary requests
    const login = async (form) => {
        data = await loginUser(form);
        setLastAction("login");
        setUser(data);
    };
    const logout = async () => {
        data = await logoutUser();
        setUser(null);
    };
    const registerFunc = async (form) => {
        data = await registerUser(form);
        setLastAction("register");
        setUser(data);
    };
    const checkUsernameContext = async (form) => {
        data = await checkUsername(form);
        return data.exists;
    };
    const getAllUsers = async () => {
        data = await getUsers();
        setUsers(data.result || []);
        return data.result;
    }

    // Return component
    return (
        <AuthContext.Provider
            value={{
                user,
                users,
                setUser,
                ready,
                login,
                logout,
                registerFunc,
                checkUsernameContext,
                lastAction,
                setLastAction,
                getAllUsers,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
