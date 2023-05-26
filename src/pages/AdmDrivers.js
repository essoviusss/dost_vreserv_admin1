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
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import jwtDecode from 'jwt-decode';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import FormControl from '@mui/joy/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';



export default function AdmVehicle() {
  const UID = uuidv4();
  const isLoggedIn = useAuth();
  const navigate = useNavigate();
  //insert
  const [driver_name, setDriverName] = useState("");
  const [email, setDriverEmail] = useState("");
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

  const STATUSES = [
    { value: 'Available', label: 'Available' },
    { value: 'Not Available', label: 'Not Available' },

  ];

  //table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //dialog
  const handleOpenView = (driver) => {
    setSelectedDriver(driver);
    setOpenView(true);
  };

  const handleOpenEdit = (driver) => {
    setSelectedDriver(driver);
    setEditDriverName(driver.driver_name);
    setEditDriverEmail(driver.email);
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
    fData.append("driver_email", email);
    fData.append("driver_password", driver_password);
    fData.append("driver_status", driver_status);
    console.log(fData);

    axios.post(url, fData)
    .then(response => {
      if(response.data === "Success"){
        alert("Driver added successfully!");
      }
      handleClose();
    })
    .catch(error => {
     alert(error);
    });
  }

  //token expiry
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
  async function handleUpdate() {
    const url = "http://localhost/vreserv_admin_api/edit_driver.php";
  
    let fData = new FormData();
    fData.append("driver_id", selectedDriver.driver_id);
    fData.append("driver_name", editDriverName);
    fData.append("email", editDriverEmail);
    fData.append("driver_status", editDriverStatus);
    fData.append("selected_driver_name", selectedDriver.driver_name);
    fData.append("selected_email", selectedDriver.email);
    fData.append("selected_driver_status", selectedDriver.driver_status);

    const response = await axios.post(url, fData);
    if(response.data.message === "Success"){
      alert("Updated");
    } else{
      alert("Error");
    }
    CloseEdit();
  }
  //delete
  async function deleteDriver(driver_id){
    const url = "http://localhost/vreserv_admin_api/delete_driver.php";
  
    let fData = new FormData();
    fData.append("driver_id", driver_id);
  
    const response = await axios.post(url, fData);
    if(response.data.message === "Success"){
      alert("Driver deleted successfully.");
    } else{
      alert("Error");
    }
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
        <Paper>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Driver Name</th>
                  <th style={{ textAlign: 'center' }}>Driver Email</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <TableBody>
                {drivers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((driver) => (
                  <TableRow key={driver.driver_id}>
                    <TableCell style={{ textAlign: 'center' }}>{driver.driver_name}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{driver.email}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{driver.driver_status}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => handleOpenView(driver)}>
                          View
                        </Button>
                        <Button variant="contained" onClick={() => handleOpenEdit(driver)}>
                          Edit
                        </Button>
                        <Button variant="contained" onClick={() => deleteDriver(driver.driver_id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={drivers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
        </Paper>
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
                    defaultValue={selectedDriver.email}
                    InputProps={{
                      readOnly: true,
                    }}
                />
                
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
                        defaultValue={selectedDriver.email}
                        onChange={(event) => setEditDriverEmail(event.target.value)}
                    />  
                    <FormControl fullWidth variant="standard" margin="dense">
                          <InputLabel id="status-label">Status</InputLabel>
                          <Select
                            labelId="status-label"
                            id="status-select"
                            value={editDriverStatus}
                            label="Request Status"
                            onChange={(event) => setEditDriverStatus(event.target.value)}
                          >
                            {STATUSES.map((status) => (
                              <MenuItem key={status.value} value={status.value}>
                                {status.label}
                              </MenuItem>
                            ))}
                          </Select>
                  </FormControl>         
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
