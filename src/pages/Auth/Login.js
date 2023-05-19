import * as React from 'react';
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
const qs = require('qs');


const theme = createTheme();


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
  
    const url1 = "http://localhost/vreserv_admin_api/read_request.php";

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
    const url = "http://localhost/vreserv_admin_api/login.php";
  
    let fData = new FormData();
    fData.append("username", username);
    fData.append("password", password);
  
    try {
      const response = await axios.post(url, fData);
  
      if (response.data.message !== "Success") {
        console.log("Login failed:", response.data.message);
        alert(response.data.message);
        return;
      }
  
      // Save the JWT token in the local storage
      const jwtToken = await response.data.token;
      const admin_role = await response.data.admin_role;
  
      if (response.data.message === "Success") {
        alert("Login Successful");
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("admin_role", admin_role);
        alert(admin_role);
        navigate("/AdmDashboard", { replace: true });
      } else {
        alert("User does not exist");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            VRESERV
          </Typography>
            <TextField
              onChange={e => setUsername(e.target.value)}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              onChange={e => setPassword(e.target.value)}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              onClick={appendRole}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}