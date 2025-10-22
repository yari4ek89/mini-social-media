import "./Header.css";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/AuthContext.jsx";
import searchIcon from "@/assets/search-icon.png";

export default function Header() {
    let navigate = useNavigate();
    const {logout} = useAuth();

    return (
        <header>
            <h1>Mini SM</h1>
            <div className="search-container">
                <img src={searchIcon} alt="search-icon"/>
                <input type="text" placeholder="Input text..."/>
            </div>
            <button
                onClick={async () => {
                    await logout();
                    navigate("/login");
                }}
            >
                Log Out
            </button>
        </header>
    );
}
