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
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';


export default function AdmVehicle() {
  const UID = uuidv4();
  const isLoggedIn = useAuth();
  const navigate = useNavigate();

  //Search Bar Icon Focus Color
  const [isPaperActive, setIsPaperActive] = useState(false);
  const handlePaperFocus = () => {
    setIsPaperActive(true);
  };

  const handlePaperBlur = () => {
    setIsPaperActive(false);
  };

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
  const [cancel, setCancel] = useState(false);

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

  //delete
  const [selectedRow, setSelectedRow] = useState(null);

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

  const handleDelete = (driver) => {
    setSelectedRow(driver);
    setCancel(true);
  };
  
  const handleConfirmDelete = () => {
    if (selectedRow) {
      deleteDriver(selectedRow.driver_id);
      setCancel(false);
    }
  };
  
  const handleCancelDelete = () => {
    setSelectedRow(null);
    setCancel(false);
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
    <div className='page-container'>
      <Header/>
      <div className="rlogs-text">Drivers</div>

      {/* --- SEARCH BAR & ADD DRIVER BUTTON --- */}
      <Paper
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: '75%',
          height: '100%',
        }}
        onFocus={handlePaperFocus}
        onBlur={handlePaperBlur}
      >
        <SearchIcon style={{ marginLeft: 10, marginRight: 10, color: isPaperActive ? '#025BAD' : 'gray' }} /> {/* Set icon color */}
        <InputBase
          style={{ fontFamily: 'Poppins, sans-serif' }}
          sx={{ flex: 1 }}
          placeholder="Search"
        />
        <Button
          variant="contained"
          onClick={handleClickOpen}
          style={{
            fontFamily: 'Poppins, sans-serif',
            backgroundColor: '#025BAD',
            marginLeft: '1%',
            padding: '1%',
            height: '100%',
            width: '30%',
          }}
        >
          + Add New Driver
        </Button>
      </Paper>

      {/* --- ADD DRIVER MODAL --- */}
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

      {/* --- DRIVER TABLE --- */}
      <Paper sx={{ borderRadius: '10px', marginTop: '2%' }}>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Driver Name</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Driver Email</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Status</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <TableBody>
              {drivers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((driver) => (
                <TableRow key={driver.driver_id}>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{driver.driver_name}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{driver.email}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>
                    <div
                      style={{
                        backgroundColor:
                          driver.driver_status === "Available" ? '#006600' :
                          driver.driver_status === "Not Available" ? '#b21127' : '',
                        color: 'white',
                        padding: '5px 5px',
                        borderRadius: '50px',
                        width: '80%',
                        margin: 'auto',
                        wordBreak: 'break-word',
                        maxWidth: '120px'
                      }}
                    >
                      {driver.driver_status}
                    </div>
                  </TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '150px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenView(driver)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <RemoveRedEyeRoundedIcon />
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenEdit(driver)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <EditRoundedIcon />
                      </Button>
                      <Button 
                        variant="contained"
                        onClick={() => handleDelete(driver)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <DeleteRoundedIcon />
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
      
      {/* delete modal */}
      <Dialog open={cancel} fullWidth maxWidth="sm">
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDelete}>No</Button>
        <Button onClick={handleConfirmDelete}>Yes</Button>
      </DialogActions>
    </Dialog>
        
      </div>
  );
}
