import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import Header from './Header';
import { v4 as uuidv4 } from 'uuid';

//material ui
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


export default function AdmVehicle() {
  const UID = uuidv4();
  //insert
  const [driver_name, setDriverName] = useState("");
  const [driver_email, setDriverEmail] = useState("");
  const [driver_username, setDriverUsername] = useState("");
  const [driver_password, setDriverPassword] = useState("");
  const [driver_status, setDriverStatus] = useState("");
  const [drivers, setDrivers] = useState([]);

  //modal
  const [open, setOpen] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  //defaultValue
  const [selectedDriver, setSelectedDriver] = useState({});

  //update
  const [editDriverName, setEditDriverName] = useState("");
  const [editDriverEmail, setEditDriverEmail] = useState("");
  const [editDriverStatus, setEditDriverStatus] = useState("");

  //dialog
  const handleOpenView = (driver) => {
    setSelectedDriver(driver);
    setOpenView(true);
  };

  const handleOpenEdit = (driver) => {
    setSelectedDriver(driver);
    setEditDriverName(driver.driver_name);
    setEditDriverEmail(driver.driver_email);
    setEditDriverStatus(driver.driver_status);
    setOpenEdit(true);
  };

  const CloseView = () => {
    setOpenView(false);
  };
  
  const CloseEdit = () => {
    setOpenEdit(false);
  }; 


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //insert
  async function addDriver() {
    
    const url = "http://localhost/vreserv_admin_api/add_driver.php";

    let fData = new FormData();
    fData.append("user_id", UID);
    fData.append("driver_name", driver_name);
    fData.append("driver_email", driver_email);
    fData.append("driver_username", driver_username);
    fData.append("driver_password", driver_password);
    fData.append("driver_status", driver_status);
    console.log(fData);

    axios.post(url, fData)
    .then(response => {
      alert("Driver added successfully!");
      handleClose();
    })
    .catch(error => {
     alert(error);
    });
  }

  //read
  useEffect(() => {
    axios.get('http://localhost/vreserv_admin_api/read_driver.php')
      .then(response => {
        if(Array.isArray(response.data)){
          setDrivers(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [drivers]);

  //update
  function handleUpdate() {
    const url = "http://localhost/vreserv_admin_api/edit_driver.php";
  
    let fData = new FormData();
    fData.append("driver_id", selectedDriver.driver_id);
    fData.append("driver_name", editDriverName);
    fData.append("driver_email", editDriverEmail);
    fData.append("driver_status", editDriverStatus);
    fData.append("selected_driver_name", selectedDriver.driver_name);
    fData.append("selected_driver_email", selectedDriver.driver_email);
    fData.append("selected_driver_status", selectedDriver.driver_status);
  
    axios
      .post(url, fData)
      .then((response) => {
        alert("Driver updated successfully!!");
        CloseEdit();
      })
      .catch((error) => {
        alert(error);
      });
  }
  //delete
  function deleteDriver(driver_id){
    const url = "http://localhost/vreserv_admin_api/delete_driver.php";
  
    let fData = new FormData();
    fData.append("driver_id", driver_id);
  
    axios.post(url, fData)
      .then(response => {
        alert("Driver deleted successfully!!");
      })
      .catch(error => {
       alert(error);
      });
  }

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
              <th>Driver Name</th>
              <th>Driver Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.driver_id}>
                <td>{driver.driver_name}</td>
                <td>{driver.driver_email}</td>
                <td>{driver.driver_status}</td>
                <td>
                  <Button variant="contained" onClick={() => handleOpenView(driver)}>
                    View
                  </Button>  
                </td>
                <td>
                  <Button variant="contained" onClick={() => handleOpenEdit(driver)}>
                    Edit
                  </Button> 
                </td>
                <td>
                  <Button variant="contained" onClick={() => deleteDriver(driver.driver_id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog open={openView} onClose={CloseView} fullWidth maxWidth="sm">
            <DialogTitle>View Details</DialogTitle>
              <DialogContent>
                <DialogContentText>
                {/* To add a new employee account, please enter the details in the designated input field. */}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Fullname"
                    type="text"
                    fullWidth
                    variant="filled"
                    defaultValue={selectedDriver.driver_name}
                    InputProps={{
                      readOnly: true,
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="filled"
                    defaultValue={selectedDriver.driver_email}
                    InputProps={{
                      readOnly: true,
                    }}
                />
                {/* <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="filled"
                    // defaultValue={selectedEmployee.employee_username}
                    InputProps={{
                      readOnly: true,
                    }}
                /> */}
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Driver Status"
                    type="text"
                    fullWidth
                    variant="filled"
                    defaultValue={selectedDriver.driver_status}
                    InputProps={{
                      readOnly: true,
                    }}
                />              
                </DialogContent>
                <DialogActions>
                <Button onClick={CloseView}>Close</Button>
                {/* <Button onClick={addEmployee}>Save</Button> */}
                </DialogActions>
            </Dialog>
            <Dialog open={openEdit} onClose={CloseEdit} fullWidth maxWidth="sm">
                <DialogTitle>Edit Details</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                    {/* To add a new employee account, please enter the details in the designated input field. */}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Fullname"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedDriver.driver_name}
                        onChange={(event) => setEditDriverName(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedDriver.driver_email}
                        onChange={(event) => setEditDriverEmail(event.target.value)}
                    />
                    {/* <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        // defaultValue={selectedEmployee.employee_username}
                    /> */}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Driver Status"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedDriver.driver_status}
                        onChange={(event) => setEditDriverStatus(event.target.value)}
                    />              
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={CloseEdit}>Close</Button>
                    <Button onClick={handleUpdate}>Save</Button>
                    </DialogActions>
                </Dialog>
      </div>
    </div>
  );
}
