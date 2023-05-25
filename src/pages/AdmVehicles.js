import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import Header from './Header';
import { v4 as uuidv4 } from 'uuid';
//material ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/joy/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import jwtDecode from 'jwt-decode';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function AdmVehicle() {
  const UID = uuidv4();
  const isLoggedIn = useAuth();
  const navigate = useNavigate();
  //insert
  const [vehicle_name, setVehicleName] = useState("");
  

  //defaultValue
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [vehicles, setVehicle] = useState([]);
  
  //update
  const [editVehicleName, setEditVehicleName] = useState("");
  const [editVehicleStatus, setEditVehicleStatus] = useState("");

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
  
  //modal
  const [open, setOpen] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  //dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenView = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenView(true);
  };

  const handleOpenEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditVehicleName(vehicle.vehicle_name);
    setEditVehicleStatus(vehicle.vehicle_status);
    setOpenEdit(true);
  };

  const CloseView = () => {
    setOpenView(false);
  };
  
  const CloseEdit = () => {
    setOpenEdit(false);
  }; 

  //insert
  function addVehicle(){
    const url = "http://localhost/vreserv_admin_api/add_vehicle.php";

    let fData = new FormData();
    fData.append("vehicle_id", UID);
    fData.append("vehicle_name", vehicle_name);

    axios.post(url, fData)
    .then(response => {
      alert("Vehicle added successfully!");
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
    axios
      .get("http://localhost/vreserv_admin_api/read_vehicle.php")
      .then((response) => {
        if(Array.isArray(response.data)){
          setVehicle(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [vehicles]);

  //update
  async function handleUpdate() {
    const url = "http://localhost/vreserv_admin_api/edit_vehicle.php";
  
    let fData = new FormData();
    fData.append("vehicle_id", selectedVehicle.vehicle_id);
    fData.append("vehicle_name", editVehicleName);
    fData.append("vehicle_status", editVehicleStatus);
    fData.append("selected_vehicle_name", selectedVehicle.vehicle_name);
    fData.append("selected_vehicle_status", selectedVehicle.vehicle_status);
  
    const response = await axios.post(url, fData);
    if(response.data.message === "Success"){
      alert("Updated");
    } else{
      alert("Error");
    }
    CloseEdit();
  }

  //delete
  function deleteVehicle(vehicle_id){
    const url = "http://localhost/vreserv_admin_api/delete_vehicle.php";
  
    let fData = new FormData();
    fData.append("vehicle_id", vehicle_id);
  
    axios.post(url, fData)
      .then(response => {
        alert("Vehicle deleted successfully!!");
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
      <Paper>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Vehicle Name</th>
              <th style={{ textAlign: 'center' }}>Vehicle Status</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <TableBody>
            {vehicles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vehicle) => (
              <TableRow key={vehicle.vehicle_id}>
                <TableCell style={{ textAlign: 'center' }}>{vehicle.vehicle_name}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{vehicle.vehicle_status}</TableCell>
                <TableCell>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <Button variant="contained" onClick={() => handleOpenView(vehicle)}>
                    View
                  </Button>
                  <Button variant="contained" onClick={() => handleOpenEdit(vehicle)}>
                    Edit
                  </Button>
                  <Button variant="contained" onClick={() => deleteVehicle(vehicle.vehicle_id)}>
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
          count={vehicles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      </Paper>
      {/* view modal*/}
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
                    label="Vehicle Name"
                    type="text"
                    fullWidth
                    variant="filled"
                    defaultValue={selectedVehicle.vehicle_name}
                    InputProps={{
                      readOnly: true,
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Vehicle Status"
                    type="text"
                    fullWidth
                    variant="filled"
                    defaultValue={selectedVehicle.vehicle_status}
                    InputProps={{
                      readOnly: true,
                    }}
                />              
                </DialogContent>
                <DialogActions>
                <Button onClick={CloseView}>Close</Button>
                </DialogActions>
            </Dialog>
        
        {/* edit modal */}
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
                        label="Vehicle Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedVehicle.vehicle_name}
                        onChange={(event) => setEditVehicleName(event.target.value)}
                    />

                    <FormControl fullWidth variant="standard" margin="dense">
                          <InputLabel id="status-label">Status</InputLabel>
                          <Select
                            labelId="status-label"
                            id="status-select"
                            value={editVehicleStatus}
                            label="Request Status"
                            onChange={(event) => setEditVehicleStatus(event.target.value)}
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
  );
}
