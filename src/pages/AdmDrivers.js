import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Header from './Header';

export default function AdmVehicle() {
  const [open, setOpen] = React.useState(false);
  const [driver_name, setDriverName] = useState("");
  const [driver_email, setDriverEmail] = useState("");
  const [driver_username, setDriverUsername] = useState("");
  const [driver_password, setDriverPassword] = useState("");

  const [drivers, setDrivers] = useState([]);

  const UID = uuidv4();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function addDriver(){
    const url = "http://localhost/vreserv_admin_api/add_driver.php";

    let fData = new FormData();
    fData.append("user_id", UID);
    fData.append("driver_name", driver_name);
    fData.append("driver_email", driver_email);
    fData.append("driver_username", driver_username);
    fData.append("driver_password", driver_password);


    axios.post(url, fData)
      .then(response => {
        alert("Driver added successfully!!");
        handleClose();
      })
      .catch(error => {
       alert(error);
      });
  }

  useEffect(() => {
    axios.get('http://localhost/vreserv_admin_api/read_driver.php')
      .then(response => {
        setDrivers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [drivers]);

  return (
    <div>
      <Header/>
      <Button variant="contained" onClick={handleClickOpen}>
        + Add New Driver
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Driver</DialogTitle>
        <DialogContent>
          <DialogContentText>
          To add a new driver, please enter the details in the designated input field.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Fullname"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setDriverName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            onChange={e => setDriverEmail(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setDriverUsername(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={e => setDriverPassword(e.target.value)}
          />    
                  
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addDriver}>Save</Button>
        </DialogActions>
      </Dialog>
      <div>
        <table>
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Driver Name</th>
              <th>Driver Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.driver_id}>
                <td>{driver.driver_id}</td>
                <td>{driver.driver_name}</td>
                <td>{driver.driver_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
