import "./AuthForm.css";
import {useNavigate} from "react-router";
import {useState} from "react";
import {useAuth} from "./context/AuthContext.jsx";
import {notify} from "@/utils/notify.js"

export default function AuthForm(props) {
    const [loading, setLoading] = useState(false);
    const {login, registerFunc, checkUsernameContext, setLastAction} =
        useAuth();
    let navigate = useNavigate();

    // Data for registration to backend
    const [formReg, setFormReg] = useState({
        username: "",
        email: "test@gmail.com",
        passwordHash: "",
        avatarUrl: {url: "", publicId: ""},
        bio: "",
    });

    // Data for authorization to backend
    const [formAuth, setFormAuth] = useState({
        username: "",
        passwordHash: "",
    });

    // async username checking
    const onUsernameInput = async (e) => {
        const usernameTemp = await checkUsernameContext(e);
        try {
            if (usernameTemp === true) return false;
        } catch { /* empty */
        }
    };

    // password validation
    const onPasswordInput = (e) => {
        try {
            if (e.length < 8) return false;
        } catch { /* empty */
        }
    };

    // submit registration
    const onSubmit = async (e) => {
        setLoading(true);
        setLastAction("register");

        if ((await onUsernameInput(formReg.username.trim())) === false)
            return notify("error", "Username is busy");

        if (formReg.username.trim().length < 3) {
            return notify("error", "Username length is less than 3");
        }

        if (formReg.username.trim().length > 20) {
            return notify("error", "Username length is more than 20");
        }

        if (onPasswordInput(formReg.passwordHash.trim()) === false)
            return notify("error", "Password is less than 8");
        const payload = {
            username: formReg.username.trim(),
            passwordHash: formReg.passwordHash.trim(),
        };

        setFormReg({...formReg, payload});
        await registerFunc(formReg);
        setLoading(false);
        return notify("success", "You created account successfully");
    };

    const loginValidate = async () => {
        setLoading(true);
        setLastAction("login");

        if ((formAuth?.username?.trim()?.length <= 0))
            return notify("error", "Please input correct username");

        if (formAuth?.passwordHash.trim().length <= 0)
            return notify("error", "Please input correct password");

        await login(formAuth);
    }

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
                        onChange={(e) =>
                            props.isLogin
                                ? setFormAuth({...formAuth, username: e.target.value})
                                : setFormReg({...formReg, username: e.target.value})
                        }
                    />
                </div>
                <div className="logps-container1">
                    <p className="password">Password:</p>
                    <input
                        type="password"
                        placeholder="For example, 12345"
                        required
                        minLength={8}
                        onChange={(e) =>
                            props.isLogin
                                ? setFormAuth({...formAuth, passwordHash: e.target.value})
                                : setFormReg({...formReg, passwordHash: e.target.value})
                        }
                    />
                </div>
                <div className="buttons-container">
                    <button
                        onClick={async () => {
                            props.isLogin ? await loginValidate() : await onSubmit(formReg);
                            navigate("/");
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
