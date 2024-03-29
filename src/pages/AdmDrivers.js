import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import Header from './Header';
import { v4 as uuidv4 } from 'uuid';
import './Components/AdmDrivers.css'
import { BASE_URL } from '../constants/api_url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StyledComponents/ToastStyles.css';

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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CustomButton from './StyledComponents/CustomButton';

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

  //search
  const [searchQuery, setSearchQuery] = useState('');

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

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

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

  //viewdriver status button
  function getDriverStatusClass(driverStatus) {
    if (driverStatus === 'Available') {
      return 'available';
    } else if (driverStatus === 'Not Available') {
      return 'not-available';
    }
    return '';
  }

  //insert
  async function addDriver() {
    const url = `${BASE_URL}/add_driver.php`;

    let fData = new FormData();
    fData.append("user_id", UID);
    fData.append("driver_name", driver_name);
    fData.append("driver_email", email);
    fData.append("driver_password", driver_password);
    
    try{
      const response = await axios.post(url, fData);
      if(response.data.message === "Success"){
        toast.success("Driver Added Successfully!");
        handleClose();
      } else{
        toast.error(response.data.message);
      }
    }catch(e){
      toast.error(e);
    }

    // axios.post(url, fData)
    // .then(response => {
    //   if(response.data === "Success"){
    //     alert("Driver added successfully!");
    //   } else {
    //     alert("Unsuccessful");
    //   }
    //   handleClose();
    // })
      // .catch(error => {
       //  toast.error("Failed to add driver!");
    // });
  }

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BASE_URL}/sync_vehicle_status.php`;
      let fData = new FormData();
      fData.append("currentDate", formattedDate);
      try{
        const response = await axios.post(url, fData);
      }catch(e){
        toast.info(e);
      }
    }
    fetchData();
  }, [formattedDate]);

  //token expiry
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // get the current time
        if (currentTime > decodedToken.exp) {
          localStorage.removeItem("token");
          toast.info('Token expired, please login again', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            className: 'custom-toast-info',
            });
          navigate('/');
        }
    } else if (!isLoggedIn) {
        navigate('/');
    }
  }, [isLoggedIn, navigate]);

  //read
  useEffect(() => {
    const url = `${BASE_URL}/read_driver.php`;
    axios.get(url)
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
    const url = `${BASE_URL}/edit_driver.php`;
  
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
      toast.success("Changes applied successfully!", {
        className: 'toast-font-smaller'
      });
    } else{
      toast.error("Failed to apply changes!");
    }
    CloseEdit();
  }
  //delete
  async function deleteDriver(driver_id){
    const url = `${BASE_URL}/delete_driver.php`;
  
    let fData = new FormData();
    fData.append("driver_id", driver_id);
  
    const response = await axios.post(url, fData);
    if(response.data.message === "Success"){
      toast.success("Driver deleted successfully!");
    } else{
      toast.error("Driver deletion failed!");
    }
}
//search
function filterDriver(driver) {
  if(searchQuery) {
    return driver.filter(driver => driver.driver_name.toLowerCase().includes(searchQuery.toLowerCase())
    || driver.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  return driver;
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
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
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
      <DialogTitle className="adddriver-title">
          <img className="adddriver-logo" src="/images/adddriver_logo.png" />
          <div className="adddriver-title-content">
            <h1>Add New Driver</h1>
            <p>To add a new driver, please enter the details in the designated input field.</p>         
          </div>
          <Button onClick={handleClose} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>
        <hr className="adddriver-hr" /> 
        <DialogContent>
          <div className='add-fields'>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Fullname"
              type="text"
              fullWidth
              variant="standard"
              onChange={e => setDriverName(e.target.value)}
              style={{ marginTop: '-2' }}
              InputLabelProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                },
              }}
              InputProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px'
                },
              }}
            />
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            onChange={e => setDriverEmail(e.target.value)}
            style={{ marginTop: 5 }}
            InputLabelProps={{
              style: {
                fontFamily: 'Poppins, sans-serif',
              },
            }}
            InputProps={{
              style: {
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px'
              },
            }}
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
            style={{ marginTop: 5 }}
            InputLabelProps={{
              style: {
                fontFamily: 'Poppins, sans-serif',
              },
            }}
            InputProps={{
              style: {
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px'
              },
            }}
          />       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>Cancel</Button>
          <CustomButton variant="save_button" text="Save" color="primary" onClick={addDriver} />
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
              {filterDriver(drivers).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((driver) => (
                <TableRow key={driver.driver_id}>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{driver.driver_name}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{driver.email}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>
                    <div
                      style={{
                        backgroundColor:
                          driver.driver_status === "Available" ? '#006600' :
                          driver.driver_status === "On-Travel" ? 'red' : '',
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
                      {/* <Button
                        variant="contained"
                        onClick={() => handleOpenView(driver)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <RemoveRedEyeRoundedIcon />
                      </Button> */}
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

            
      {/* --- EDIT DRIVER MODAL --- */}
      <Dialog open={openEdit} onClose={CloseEdit} fullWidth maxWidth="sm">
        <DialogTitle className="editdriver-title">
          <img className="editdriver-logo" src="/images/editdriver_logo.png" />
          <div className="editdriver-title-content">
            <h1>Edit Driver Details</h1>
            <p>Update the necessary changes to the driver's details</p>         
          </div>
          <Button onClick={CloseEdit} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>
        <hr className="editdriver-hr" /> 
        <DialogContent>
          <div className='edit-fields'>
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
              style={{ marginTop: 0 }}
              InputLabelProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '110%',
                  color: 'black',    
                  fontWeight: '600',
                },
              }}
              InputProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px'
                },
              }}
            />
          </div>
          <div className='edit-fields'>
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
              style={{ marginTop: 0 }}
              InputLabelProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '110%',
                  color: 'black',    
                  fontWeight: '600',
                },
              }}
              InputProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px'
                },
              }}
            />  
          </div>
          <div className='edit-fields'>
            <FormControl fullWidth variant="standard" margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status-select"
                value={editDriverStatus}
                label="Request Status"
                onChange={(event) => setEditDriverStatus(event.target.value)}
                style={{ height: '40px', fontFamily: 'Poppins', fontSize: '14px' }}
                MenuProps={{ PaperProps: { style: { maxHeight: '200px' } } }}
              >
                {STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>         
          </div>
        </DialogContent>
        <DialogActions>
        <Button onClick={CloseEdit} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>Cancel</Button>
        <CustomButton variant="save_button" text="Save" color="primary" onClick={handleUpdate} />
        </DialogActions>
      </Dialog>
    
      {/* --- DELETE MODAL --- */}
      <Dialog open={cancel} fullWidth maxWidth="xs">
        <DialogContent>
          <div className='delete-icon'>
            <img className="delete-svg" src="/svg/delete_icon.svg" />
          </div>
          <DialogContentText>
            <div className='delete-title'>Are you sure?</div>
            <div className='delete-subtitle'>Do you really want to delete this vehicle? This process cannot be undone.</div>
          </DialogContentText>
        </DialogContent>
        <div class="button-container">
          <Button
            onClick={handleCancelDelete}
            style={{
              backgroundColor: 'rgb(92, 92, 92)',
              borderRadius: '3px',
              color: 'white',
              margin: '0 7px 40px 0',
              textTransform: 'none',
              width: '120px',
              fontFamily: 'Poppins, sans-serif',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#474747'}
            onMouseLeave={e => e.target.style.backgroundColor = 'rgb(92, 92, 92)'}
          >
            No
          </Button>
          <Button
            className="confirm-delete"
            onClick={handleConfirmDelete}
            style={{
              backgroundColor: '#cf0a0a',
              borderRadius: '3px',
              color: 'white',
              margin: '0 0 40px 7px',
              textTransform: 'none',
              width: '120px',
              fontFamily: 'Poppins, sans-serif',transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#b00909'}
            onMouseLeave={e => e.target.style.backgroundColor = '#cf0a0a'}
          >
            Yes
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
