import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import axios from "axios";
import Header from './Header';

export default function AdmVehicle() {
  const [open, setOpen] = React.useState(false);

  const [vehicle_number, setVehicleNumber] = useState("");
  const [vehicle_name, setVehicleName] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function addVehicle(){
    const url = "http://localhost/vreserv_admin_api/add_vehicle.php";

    let fData = new FormData();
    fData.append("vehicle_number", vehicle_number);
    fData.append("vehicle_name", vehicle_name);

    axios.post(url, fData)
      .then(response => {
        alert(response.data);
      })
      .catch(error => {
       alert(error);
      });
  }

  return (
    <div>
      <Header />
      <Button variant="contained" onClick={handleClickOpen}>
        + Add New Vehicle
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent>
          <DialogContentText>
          To add a new vehicle, please enter the details in the designated input field.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="vehicle_number"
            label="Plate Number"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setVehicleNumber(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="vehicle_name"
            label="Vehicle Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setVehicleName(e.target.value)}
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addVehicle}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
