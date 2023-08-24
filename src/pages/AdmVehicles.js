import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import Header from './Header';
import { v4 as uuidv4 } from 'uuid';
import jwtDecode from 'jwt-decode';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import './Components/AdmVehicles.css'
import { BASE_URL } from '../constants/api_url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StyledComponents/ToastStyles.css';

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
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CustomButton from './StyledComponents/CustomButton';
import { faD } from '@fortawesome/free-solid-svg-icons';


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
  const [vehicle_name, setVehicleName] = useState("");
  
  //modal
  const [cancel, setCancel] = useState(false);

  //defaultValue
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [vehicles, setVehicle] = useState([]);
  
  //update
  const [editVehicleName, setEditVehicleName] = useState("");
  const [editVehicleStatus, setEditVehicleStatus] = useState("");

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

  //search
  const [searchQuery, setSearchQuery] = useState('');

  
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

  const handleDelete = (vehicle) => {
    setSelectedRow(vehicle);
    setCancel(true);
  };
  
  const handleConfirmDelete = () => {
    if (selectedRow) {
      deleteVehicle(selectedRow.vehicle_id);
      setCancel(false);
    }
  };
  
  const handleCancelDelete = () => {
    setSelectedRow(null);
    setCancel(false);
  };
  
  

  //insert
  async function addVehicle(){
    const url = `${BASE_URL}/add_vehicle.php`;

    let fData = new FormData();
    fData.append("vehicle_id", UID);
    fData.append("vehicle_name", vehicle_name);

    try{
      const response = await axios.post(url, fData);
      if(response.data.message === "Success"){
        toast.success("Vehicle Added Successfully!");
        handleClose();
        setVehicleName('');
      } else{
        toast.error(response.data.message);
        handleClose();
      }
    }catch(e){
      toast.error(e);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BASE_URL}/sync_vehicle_status.php`;
      let fData = new FormData();
      fData.append("currentDate", formattedDate);
      try{
        const response = await axios.post(url, fData);
      }catch(e){
        toast.error(e);
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
    const url = `${BASE_URL}/read_vehicle.php`;
    axios
      .get(url)
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
    const url = `${BASE_URL}/edit_vehicle.php`;
  
    let fData = new FormData();
    fData.append("vehicle_id", selectedVehicle.vehicle_id);
    fData.append("vehicle_name", editVehicleName);
    fData.append("vehicle_status", editVehicleStatus);
    fData.append("selected_vehicle_name", selectedVehicle.vehicle_name);
    fData.append("selected_vehicle_status", selectedVehicle.vehicle_status);
  
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
  async function deleteVehicle(vehicle_id){
    const url = `${BASE_URL}/delete_vehicle.php`;
  
    let fData = new FormData();
    fData.append("vehicle_id", vehicle_id);
  
    const response = await axios.post(url, fData);
    if(response.data.message === "Success"){
      toast.success("Vehicle deleted successfully!");
    } else{
      toast.error("Vehicle deletion failed!");
    }
  }

  //search
  function filterVehicle(vehicle) {
    if(searchQuery) {
      return vehicle.filter(vehicle => vehicle.vehicle_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return vehicle;
  }

  return (
    <div className='page-container'>
      <Header />
      <div className="rlogs-text">Vehicles</div>

      {/* --- SEARCH BAR & ADD VEHICLE BUTTON --- */}
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
          + Add New Vehicle
        </Button>
      </Paper>

      {/* --- ADD NEW VEHICLE MODAL --- */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="addvehicle-title">
          <img className="addvehicle-logo" src="/images/addvehicle_logo.png" />
          <div className="addvehicle-title-content">
            <h1>Add New Vehicle</h1>
            <p>To add a new vehicle, please enter the details in the designated input field.</p>         
          </div>
          <Button onClick={handleClose} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>
        <hr className="addvehicle-hr" /> 
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="vehicle_name"
            label="Vehicle Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setVehicleName(e.target.value)}
            style={{ marginTop: 0 }}
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
          <CustomButton variant="save_button" text="Save" color="primary" onClick={addVehicle} />
        </DialogActions>
      </Dialog>

      {/* --- VEHICLE TABLE --- */}
      <Paper sx={{ borderRadius: '10px', marginTop: '2%' }}>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Vehicle Name</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Vehicle Status</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <TableBody>
              {filterVehicle(vehicles).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vehicle) => (
                <TableRow key={vehicle.vehicle_id}>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{vehicle.vehicle_name}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', padding: 0 }}>
                    <div
                      style={{
                        backgroundColor:
                          vehicle.vehicle_status === "Available" ? '#006600' :
                          vehicle.vehicle_status === "On-Travel" ? 'red' : 
                          vehicle.vehicle_status === "On-PMS" ? 'orange' : 
                          "",
                        color: 'white',
                        padding: '5px 5px',
                        borderRadius: '50px',
                        width: '80%',
                        margin: 'auto',
                        wordBreak: 'break-word',
                        maxWidth: '120px'
                      }}
                    >
                      {vehicle.vehicle_status}
                    </div>
                  </TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      {/* <Button
                        variant="contained"
                        onClick={() => handleOpenView(vehicle)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <RemoveRedEyeRoundedIcon />
                      </Button> */}
                      <Button
                        variant="contained"
                        onClick={() => handleOpenEdit(vehicle)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <EditRoundedIcon />
                      </Button>
                      <Button 
                        variant="contained"
                        onClick={() => handleDelete(vehicle)}
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
            count={vehicles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>
      
      {/* --- VIEW MODAL ---
      <Dialog open={openView} onClose={CloseView} fullWidth maxWidth="sm">
        <Button onClick={CloseView} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
          <CloseRoundedIcon />
        </Button>
        <DialogContent>
          <div className="view-vehicle">
            <div className="div1-viewvehicle">
              <img className="viewvehicle-logo" src="/images/viewvehicle_logo.png"/>
            </div>
            <div className="div2-viewvehicle">
              <p className="header-viewvehicle">{selectedVehicle.vehicle_name}</p>
              <p className="header-label-viewvehicle">Vehicle Name</p>
            </div>
            <div className="div3-viewvehicle">
              <div className="status-viewvehicle">
                <button className={`status-viewvehicle ${selectedVehicle.vehicle_status === 'Not Available' ? 'not-available' : 'available'}`}>
                  {selectedVehicle.vehicle_status}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* --- EDIT MODAL --- */}
      <Dialog open={openEdit} onClose={CloseEdit} fullWidth maxWidth="sm">
        <DialogTitle className="editvehicle-title">
          <img className="editvehicle-logo" src="/images/editvehicle_logo.png" />
          <div className="editvehicle-title-content">
            <h1>Edit Vehicle Details</h1>
            <p>Update the necessary changes to the vehicle details</p>         
          </div>
          <Button onClick={CloseEdit} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>
        <hr className="editvehicle-hr" /> 
        <DialogContent>
          <div className="edit-fields">
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
          <div className="edit-fields">
            <FormControl fullWidth variant="standard" margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status-select"
                value={editVehicleStatus}
                label="Request Status"
                onChange={(event) => setEditVehicleStatus(event.target.value)}
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
