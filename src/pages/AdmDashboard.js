import { useNavigate } from "react-router";
import { useEffect } from 'react';
import useAuth from "../hooks/useAuth";

export default function AdmDashboard(){
    const navigate = useNavigate();
    const isLoggedIn = useAuth(); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!isLoggedIn && token === null) {
          navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        alert("You have been logged out!");
        navigate("/", { replace: true });
      };
    return(
        <div>
            <div>Dashboard</div>
            <div>
                <button onClick={logout} style={{ marginLeft: "10px" }}>
                    Logout
                </button>
            </div>
        </div>
    );
}