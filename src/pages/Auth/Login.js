import * as React from 'react';
import '../Auth/Components/Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../StyledComponents/ToastStyles.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../constants/api_url';
const qs = require('qs');


const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastCompleted, setToastCompleted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/AdmDashboard");
    }
  }, [navigate]);

  const appendRole = async () => {
    await signIn();
    const admin_role = localStorage.getItem("admin_role");

    if (!admin_role) {
      alert("No admin role found in local storage!");
      return;
    }
    
    const url1 = `${BASE_URL}/read_request.php`;

    let fData1 = new FormData();
    fData1.append("admin_role", admin_role);
  
    try {
      const response = await axios.post(url1, fData1);
      if(response.data.message === "Success"){
        console.log("Nice");
      }
    } catch (e) {
      alert(e);
    }
  }



  const signIn = async () => {   
    const url = `${BASE_URL}/login.php`;
  
    let fData = new FormData();
    fData.append("username", username);
    fData.append("password", password);
  
    try {
      const response = await axios.post(url, fData);
  
      if (response.data.message !== "Success") {
        console.log("Login failed:", response.data.message);
        toast.error(response.data.message);
        return;
      }
  
      // Save the JWT token in the local storage
      const jwtToken = response.data.token;
      const admin_role = response.data.admin_role;
  
      if (response.data.message === "Success") {
        setIsLoggedIn(true);
        setToastCompleted(false);
  
        await new Promise((resolve) => {
          toast.success("You have logged in successfully!", {
            className: 'login-toast', 
            bodyClassName: 'login-toast-body', 
            progressClassName: 'login-toast-progress', 
            onClose: () => {
              setToastCompleted(true);
              resolve();
            },
          });
        });
  
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("admin_role", admin_role);
      } else {
        alert("User does not exist");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error);
    }
  };
  
  useEffect(() => {
    if (toastCompleted) {
      navigate("/AdmDashboard", { replace: true });
    }
  }, [toastCompleted]);
  
  
  

  return (
    <ThemeProvider theme={theme}>
      {isLoggedIn && <ToastContainer />}
      <div className='login-page'>
        <Container
          component='main'
          maxWidth='xs'
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            paddingTop: '15vh',
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="logo-container" style={{ display: 'flex', justifyContent: 'center' }}>
              <img src="/images/login_logo.png" className="login-logo" alt="login-logo" />
            </div>
            <Typography component='h1' variant='h5' style={{ fontWeight: 600, fontSize: 20, letterSpacing: '0.1em', paddingBottom: '5%' }}>
              VRESERV
            </Typography>
            <TextField
              onChange={(e) => setUsername(e.target.value)}
              margin='normal'
              required
              fullWidth
              id='email'
              label='Username'
              name='email'
              autoComplete='email'
              autoFocus
            />
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <Button
              onClick={appendRole}
              type='submit'
              fullWidth
              variant='contained'
              sx={{
                mt: 3,
                mb: 2,
                ':hover': {
                  backgroundColor: '#002445',
                },
              }}
              style={{ backgroundColor: '#025BAD' }}
            >
              Login
            </Button>
          </Box>
          <div className='login-footer'>
            <svg
              id="wave"
              style={{ transform: 'rotate(0deg)', transition: '0.3s' }}
              viewBox="0 0 1440 230"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
                  <stop stopColor="rgba(2, 91, 173, 0.6705882352941176)" offset="0%" />
                  <stop stopColor="rgba(2, 91, 173, 0.6705882352941176)" offset="100%" />
                </linearGradient>
              </defs>
              <path
                style={{ transform: 'translate(0, 0px)', opacity: 1 }}
                fill="url(#sw-gradient-0)"
                d="M0,115L60,115C120,115,240,115,360,130.3C480,146,600,176,720,168.7C840,161,960,115,1080,107.3C1200,100,1320,130,1440,141.8C1560,153,1680,146,1800,134.2C1920,123,2040,107,2160,118.8C2280,130,2400,169,2520,187.8C2640,207,2760,207,2880,187.8C3000,169,3120,130,3240,95.8C3360,61,3480,31,3600,42.2C3720,54,3840,107,3960,115C4080,123,4200,84,4320,80.5C4440,77,4560,107,4680,118.8C4800,130,4920,123,5040,99.7C5160,77,5280,38,5400,26.8C5520,15,5640,31,5760,46C5880,61,6000,77,6120,76.7C6240,77,6360,61,6480,46C6600,31,6720,15,6840,23C6960,31,7080,61,7200,72.8C7320,84,7440,77,7560,88.2C7680,100,7800,130,7920,145.7C8040,161,8160,161,8280,138C8400,115,8520,69,8580,46L8640,23L8640,230L8580,230C8520,230,8400,230,8280,230C8160,230,8040,230,7920,230C7800,230,7680,230,7560,230C7440,230,7320,230,7200,230C7080,230,6960,230,6840,230C6720,230,6600,230,6480,230C6360,230,6240,230,6120,230C6000,230,5880,230,5760,230C5640,230,5520,230,5400,230C5280,230,5160,230,5040,230C4920,230,4800,230,4680,230C4560,230,4440,230,4320,230C4200,230,4080,230,3960,230C3840,230,3720,230,3600,230C3480,230,3360,230,3240,230C3120,230,3000,230,2880,230C2760,230,2640,230,2520,230C2400,230,2280,230,2160,230C2040,230,1920,230,1800,230C1680,230,1560,230,1440,230C1320,230,1200,230,1080,230C960,230,840,230,720,230C600,230,480,230,360,230C240,230,120,230,60,230L0,230Z"
              />
              <defs>
                <linearGradient id="sw-gradient-1" x1="0" x2="0" y1="1" y2="0">
                  <stop stopColor="rgba(2, 91, 173, 1)" offset="0%" />
                  <stop stopColor="rgba(2, 91, 173, 1)" offset="100%" />
                </linearGradient>
              </defs>
              <path
                style={{ transform: 'translate(0, 50px)', opacity: 0.9 }}
                fill="url(#sw-gradient-1)"
                d="M0,161L60,153.3C120,146,240,130,360,107.3C480,84,600,54,720,65.2C840,77,960,130,1080,141.8C1200,153,1320,123,1440,126.5C1560,130,1680,169,1800,161C1920,153,2040,100,2160,65.2C2280,31,2400,15,2520,38.3C2640,61,2760,123,2880,134.2C3000,146,3120,107,3240,95.8C3360,84,3480,100,3600,111.2C3720,123,3840,130,3960,115C4080,100,4200,61,4320,61.3C4440,61,4560,100,4680,95.8C4800,92,4920,46,5040,38.3C5160,31,5280,61,5400,80.5C5520,100,5640,107,5760,126.5C5880,146,6000,176,6120,161C6240,146,6360,84,6480,53.7C6600,23,6720,23,6840,34.5C6960,46,7080,69,7200,84.3C7320,100,7440,107,7560,126.5C7680,146,7800,176,7920,172.5C8040,169,8160,130,8280,118.8C8400,107,8520,123,8580,130.3L8640,138L8640,230L8580,230C8520,230,8400,230,8280,230C8160,230,8040,230,7920,230C7800,230,7680,230,7560,230C7440,230,7320,230,7200,230C7080,230,6960,230,6840,230C6720,230,6600,230,6480,230C6360,230,6240,230,6120,230C6000,230,5880,230,5760,230C5640,230,5520,230,5400,230C5280,230,5160,230,5040,230C4920,230,4800,230,4680,230C4560,230,4440,230,4320,230C4200,230,4080,230,3960,230C3840,230,3720,230,3600,230C3480,230,3360,230,3240,230C3120,230,3000,230,2880,230C2760,230,2640,230,2520,230C2400,230,2280,230,2160,230C2040,230,1920,230,1800,230C1680,230,1560,230,1440,230C1320,230,1200,230,1080,230C960,230,840,230,720,230C600,230,480,230,360,230C240,230,120,230,60,230L0,230Z"
              />
            </svg>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
}