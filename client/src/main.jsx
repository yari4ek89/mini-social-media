// import neccessary libraries
import {createRoot} from "react-dom/client"; // import createRoot
import "./index.css"; // import styles
import App from "./App.jsx"; // import feed app
import AuthForm from "./AuthForm.jsx"; // import authorization form
import {BrowserRouter, Route, Routes} from "react-router-dom"; // import browser router, routes and route
import PrivateRoute from "./context/PrivateRoute.jsx"; // import private route
import AuthProvider from "./context/AuthContext.jsx"; // import authorization context
import PostProvider from "./context/PostContext.jsx";
import {ToastContainer} from "react-toastify";

// Create main application
createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ToastContainer/>
        <AuthProvider>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <PostProvider>
                                <App/>
                            </PostProvider>
                        </PrivateRoute>
                    }
                />
                <Route path="/login" element={<AuthForm isLogin={true}/>}/>
                <Route path="/register" element={<AuthForm isLogin={false}/>}/>
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
