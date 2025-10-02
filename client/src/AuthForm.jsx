// Import neccessary librarires
import "./AuthForm.css"; // styles for this form
import { useNavigate } from "react-router"; // react router (useNavigate)
import { useState } from "react"; // react (useState, useEffect)
import { useAuth } from "./context/AuthContext"; // AuthContext (useAuth)
import { toast } from "react-toastify";

// Export authorization form
export default function AuthForm(props) {
  // Define neccessary vars
  const [loading, setLoading] = useState(false); // data loading
  const currentDate = new Date(); // check current date
  const { login, registerFunc, checkUsernameContext, setLastAction } =
    useAuth(); // backend upload
  let navigate = useNavigate(); // navigate beetween routes

  // Data for registration to backend
  const [formReg, setFormReg] = useState({
    username: "",
    email: "test@gmail.com",
    passwordHash: "",
    avatarUrl: { url: "", publicId: "" },
    bio: "",
    createdAt: `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`,
  });

  // Data for authorization to backend
  const [formAuth, setFormAuth] = useState({
    username: "",
    passwordHash: "",
  });

  // async username checking
  const onUsernameInput = async (e) => {
    const usernameTemp = await checkUsernameContext(e); // check username for avaible
    try {
      if (usernameTemp === true) return false; // if username exists then false
    } catch {}
  };

  // password validation
  const onPasswordInput = (e) => {
    try {
      if (e.length < 8) return false; // if password length < 8 -> false
    } catch {}
  };

  // submit registration
  const onSubmit = async (e) => {
    setLoading(true); // loading to true
    setLastAction("register"); // set last action to register

    // Check if username is exists -> notify that is busy
    if ((await onUsernameInput(formReg.username.trim())) === false)
      return notify("Username is busy", "error");

    // Check if username length < 3 -> notify that is less than 3
    if (formReg.username.trim().length < 3) {
      return notify("Username length is less than 3", "error");
    }

    // Check if username length > 20 -> notify that is more than 20
    if (formReg.username.trim().length > 20) {
      return notify("Username length is more than 20", "error");
    }

    // Check if password length < 8 -> notify that password is < 8
    if (onPasswordInput(formReg.passwordHash.trim()) === false)
      return notify("Password is less than 8", "error");
    const payload = {
      username: formReg.username.trim(),
      passwordHash: formReg.passwordHash.trim(),
    }; // change username and password

    setFormReg({ ...formReg, payload }); // set registration data
    registerFunc(formReg); // make a POST query to backend
    setLoading(false); // loading to false
    return notify("You created account successfully", "success");
  };

  // Toast notify
  const notify = (params, type) => {
    if (type === "error") {
      toast.error(params, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (type === "success") {
      toast.success(params, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // Return an authorization form
  return (
    <div className="auth-form">
      <h1>Mini SM</h1>
      <div className="changeable-form">
        <h1 className="caption">
          {props.isLogin ? "Authorization" : "Registration"}
        </h1>
        <div className="logps-container">
          <p className="_p">Login:</p>
          <input
            type="text"
            placeholder="For example, user123"
            required
            minLength={3}
            maxLength={20}
            pattern="^[a-zA-Z0-9_]+$^"
            onChange={(e) =>
              props.isLogin
                ? setFormAuth({ ...formAuth, username: e.target.value })
                : setFormReg({ ...formReg, username: e.target.value })
            }
          />
        </div>
        <div className="logps-container1">
          <p className="password">Password:</p>
          <input
            type="text"
            placeholder="For example, 12345"
            required
            minLength={8}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+"
            onChange={(e) =>
              props.isLogin
                ? setFormAuth({ ...formAuth, passwordHash: e.target.value })
                : setFormReg({ ...formReg, passwordHash: e.target.value })
            }
          />
        </div>
        <div className="buttons-container">
          <button
            onClick={async (e) => {
              props.isLogin ? await login(formAuth) : await onSubmit(formReg);
              navigate("/feed");
            }}
          >
            {props.isLogin ? "Login" : "Registration"}
          </button>
          <button
            onClick={() => navigate(props.isLogin ? "/register" : "/login")}
          >
            {props.isLogin ? "Registration" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
