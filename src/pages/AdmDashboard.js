import { useNavigate } from "react-router";
import { useEffect } from 'react';
import useAuth from "../hooks/useAuth";
import Header from "./Header";
import jwtDecode from 'jwt-decode';


export default function AdmDashboard(){
    const navigate = useNavigate();
    const isLoggedIn = useAuth(); 

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // get the current time
            if (currentTime > decodedToken.exp) {
                localStorage.removeItem("token");
                alert("Token expired, please login again");
                navigate('/');
            }
        } else if (!isLoggedIn) {
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
            <Header/>
            <div>Dashboard</div>
            <div>
                <button onClick={logout} style={{ marginLeft: "10px" }}>
                    Logout
                </button>
            </div>
        </div>
    );
}

