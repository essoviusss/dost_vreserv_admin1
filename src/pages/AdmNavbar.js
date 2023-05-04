// import React from "react";
// // import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import useAuth from '../../hooks/useAuth'; 
// import '../pages/Components/AdmNavbar.css';

// export default function AdmNavbar(){
//     const navigate = useNavigate();
//     // const isLoggedIn = useAuth(); 

//     // useEffect(() => {
//     //     const token = localStorage.getItem("token");
//     //     if (!isLoggedIn && token === null) {
//     //       navigate('/');
//     //     }
//     // }, [isLoggedIn, navigate]);

//     //   const logout = () => {
//     //     localStorage.removeItem("token");
//     //     alert("You have been logged out!");
//     //     navigate("/", { replace: true });
//     //   };
    

//     return(
//         <div className="wrapper">
//             <div className="sidebar">
//                 <h2>LOGO</h2>
//                 <ul>
//                     <li>
//                         <Link to="">Dashboard</Link>
//                     </li>
//                 </ul>
//                 <ul>
//                     <li>
//                         <Link to="">Travel Request</Link>
//                     </li>
//                 </ul>
//                 <ul>
//                     <li>
//                         <Link to="">Availability</Link>
//                     </li>
//                 </ul>
//                 <ul>
//                     <li>
//                         <Link to="">PMS Schedule</Link>
//                     </li>
//                 </ul>
                

//             </div>
//             <div className="main_content">
//                 <div className="header">
//                     {/* <button onClick={logout} style={{ marginLeft: "10px" }}>
//                         Logout
//                     </button> */}
//                 </div>
//             </div>
//         </div>
//     );
// }

