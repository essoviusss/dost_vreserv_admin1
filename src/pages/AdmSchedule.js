import * as React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';
import Header from "./Header";
import { v4 as uuidv4 } from 'uuid';
import './Components/AdmSchedule.css'
//materialUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CustomButton from './StyledComponents/CustomButton';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import jwtDecode from 'jwt-decode';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function AdmSchedule() {
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

  //modal
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [cancel, setCancel] = useState(false);

  //defaultValue
  const [selectedPMS, setSelectedPMS] = useState({});
  const [pms, setPMS] = useState([]);


  //insert
  const [month, setMonth] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');

  //update
  const [editPmsStartdate, setEditPmsStartdate] = useState("");
  const [editPmsEnddate, setEditPmsEnddate] = useState(null);

  
  //search
  const [searchQuery, setSearchQuery] = useState('');

  //cancel
  const [selectedRow, setSelectedRow] = useState(null);


  //dialog

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const handleOpenEdit = (pms) => {
    setSelectedPMS(pms);
    setEditPmsStartdate(pms.pms_startdate === "0000-00-00 00:00:00" ? dayjs() : dayjs(pms.pms_startdate));
    setEditPmsEnddate(pms.pms_enddate === "0000-00-00 00:00:00" ? dayjs() : dayjs(pms.pms_enddate));
    setOpenEdit(true);
  };
  
  const CloseEdit = () => {
    setOpenEdit(false);
  };

  const handleDelete = (pms) => {
    setSelectedRow(pms);
    setCancel(true);
  };
  
  const handleConfirmDelete = () => {
    if (selectedRow) {
      deleteSchedule(selectedRow.pms_id);
      setCancel(false);
    }
  };
  
  const handleCancelDelete = () => {
    setSelectedRow(null);
    setCancel(false);
  };
  
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
  
  //read vehicles
  useEffect(() => {
    axios.get('http://localhost/vreserv_admin_api/read_vehicle.php')
      .then(response => {
        setVehicles(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleVehicleChange = (event) => {
    setSelectedVehicle(event.target.value);
  };

  //read-pms
  useEffect(() => {
    axios.get('http://localhost/vreserv_admin_api/read_pms.php')
      .then(response => {
        if(Array.isArray(response.data)){
            setPMS(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [pms]);

  //insertt
  const months = [
    { name: "--Select Month--", value: "none"},
    { name: "January", value: "January" },
    { name: "February", value: "February" },
    { name: "March", value: "March" },
    { name: "April", value: "April" },
    { name: "May", value: "May" },
    { name: "June", value: "June" },
    { name: "July", value: "July" },
    { name: "August", value: "August" },
    { name: "September", value: "September" },
    { name: "October", value: "October" },
    { name: "November", value: "November" },
    { name: "December", value: "December" },
  ];

  //search
  function filterPMS(pms) {
    if(searchQuery) {
      return pms.filter(pms => pms.vehicle_name.toLowerCase().includes(searchQuery.toLowerCase())
      || pms.initial_pms.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return pms;
  }

  //insert
  function addPms(id) {
    const url = "http://localhost/vreserv_admin_api/add_pms.php";
    alert(id);
    let fData = new FormData();
    
    fData.append("pmsId", UID);
    fData.append("vehicle_id", selectedVehicle);
    fData.append("month", month);
    
    axios
      .post(url, fData)
      .then((response) => {
        if(response.data === "Success"){
            alert("PMS added successfully!!");
            handleClose();
        } else{
            alert("Error");
        }
      })
      .catch((error) => {
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

  useEffect(() => {
    axios.get('http://localhost/vreserv_admin_api/read_pms.php')
      .then(response => {
        if(Array.isArray(response.data)){
            setPMS(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [pms]);

  // delete
  async function deleteSchedule(pms_id) {
    const url = "http://localhost/vreserv_admin_api/delete_pms.php";
    
    let fData = new FormData();
    fData.append("pms_id", pms_id);
    
    const response = await axios.post(url, fData);
    if(response.data.message === "Success"){
      alert("PMS deleted successfully.");
    } else{
      alert("Schedule deletion failed.");
    }
  }
    // update
    async function handleUpdate() {
      const url = "http://localhost/vreserv_admin_api/edit_pms.php";
      let fData = new FormData();
      fData.append("pms_id", selectedPMS.pms_id); // Use selectedPMS.id instead of selectedPMS.pms_id
    
      // Format date and time values
      const formattedStartDate = editPmsStartdate.format("YYYY-MM-DD HH:mm");
      const formattedEndDate = editPmsEnddate.format("YYYY-MM-DD HH:mm");
    
      fData.append("pms_startdate", formattedStartDate);
      fData.append("pms_enddate", formattedEndDate);
    
      const response = await axios.post(url, fData);
      if (response.data.message === "Success") {
        alert("Updated");
        setPMS((prevPMS) => {
          const updatedPMS = prevPMS.map((pmsItem) => {
            if (pmsItem.pms_id === selectedPMS.pms_id) { // Use pmsItem.id instead of pmsItem.pms_id
              // Update the specific row
              return {
                ...pmsItem,
                pms_startdate: formattedStartDate,
                pms_enddate: formattedEndDate,
              };
            }
            return pmsItem;
          });
          return updatedPMS;
        });
      } else {
        alert("Error");
      }
      CloseEdit();
    }
    
  return (
    <div className='page-container'>
      <Header/>
      <div className="rlogs-text">PMS Schedule</div>

      {/* --- SEARCH BAR & ADD PMS BUTTON --- */}
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
          + Add New PMS Schedule
        </Button>
      </Paper>
    <div>

    {/* --- ADM SCHEDULE TABLE --- */}
    <Paper sx={{ borderRadius: '10px', marginTop: '2%' }}>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th className='requestlog-th' style={{ textAlign: 'center' }}>Vehicle Name</th>
              <th className='requestlog-th' style={{ textAlign: 'center' }}>Initial PMS</th>
              <th className='requestlog-th' style={{ textAlign: 'center' }}>PMS Start Date</th>
              <th className='requestlog-th' style={{ textAlign: 'center' }}>PMS End Date</th>
              <th className='requestlog-th' style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <TableBody>
            {filterPMS(pms)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((data) => (
                <TableRow key={data.id}>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{data.vehicle_name}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{data.initial_pms}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{data.pms_startdate === "0000-00-00 00:00:00" ? "Not Set": dayjs(data.pms_startdate).format("MMMM D, YYYY, h:mm A")}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{data.pms_enddate === "0000-00-00 00:00:00" ? "Not Set": dayjs(data.pms_enddate).format("MMMM D, YYYY, h:mm A")}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenEdit(data)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <EditRoundedIcon />
                      </Button>
                      <Button 
                        variant="contained"
                        onClick={() => handleDelete(data)}
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
          count={pms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Paper>
    </div>    

    {/* --- ADD PMS SCHED MODAL --- */}
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"> 
      <DialogTitle className="addemp-title">
        <img className="addpms-logo" src="/images/addpms_logo.png" />
        <div className="addpms-title-content">
          <h1>Add New PMS Schedule</h1>
          <p>To add a new PMS Schedule, please enter the details in the designated input field.</p>         
        </div>
        <Button onClick={handleClose} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
          <CloseRoundedIcon />
        </Button>
      </DialogTitle>
      <hr className="addpms-hr" /> 
      <DialogContent>
        <div>
          <div className='addpms-field'>
            <label className='addpms-label' htmlFor="month-select">Select Month</label>
            <br />
            <select
              id="month-select"
              value={month}
              onChange={handleChange}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>
          <div className='addpms-field'>
            <label className='addpms-label' htmlFor="vehicle-select">Select Vehicle</label>
            <br />
            <select
              id="vehicle-select"
              value={selectedVehicle}
              onChange={handleVehicleChange}
            >
                <option>--Select Vehicle--</option>
              {
                
              vehicles.map((vehicle) => (
                <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                  {vehicle.vehicle_name}
                </option>
              ))
              }
            </select>
          </div>
        </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>Cancel</Button>
          <CustomButton variant="save_button" text="Save" color="primary" onClick={() => addPms(selectedVehicle)} />
        </DialogActions>
      </Dialog>
  
      {/* --- EDIT PMS MODAL --- */}
      <Dialog open={openEdit} onClose={CloseEdit} fullWidth maxWidth="sm">
        <DialogTitle className="editpms-title">
          <img className="editpms-logo" src="/images/updatepms_logo.png" />
          <div className="editpms-title-content">
            <h1>Update PMS Schedule</h1>
            <p>Change the PMS Schedule below</p>         
          </div>
          <Button onClick={CloseEdit} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>
        <hr className="editpms-hr" /> 
        <DialogContent>
          <div>
            <div className='pmsstart-label'>
              PMS Start Date
            </div>
            <div className='pmsstart-container'> 
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker 
                orientation="landscape"
                value={editPmsStartdate || dayjs()} 
                onChange={(newValue) => {
                  setEditPmsStartdate(newValue);
                }}
              />
              </LocalizationProvider>
            </div>
            <div className='pmsend-label'>
              PMS End Date
            </div>
            <div className='pmsend-container'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDateTimePicker
                  orientation="landscape"
                  label="PMS End Date"
                  value={editPmsEnddate || dayjs()} 
                  onChange={(newValue) => {
                    setEditPmsEnddate(newValue);
                  }}
                />
              </LocalizationProvider>
            </div>
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker label="Basic date time picker" />
                </DemoContainer>
              </LocalizationProvider> */}
          </div>
        </DialogContent>
        <DialogActions>
        <Button onClick={CloseEdit} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>Cancel</Button>
          <CustomButton variant="save_button" text="Save" color="primary" onClick={handleUpdate} />
        </DialogActions>
      </Dialog>
  
      {/* --- CANCEL PMS MODAL --- */}
      <Dialog open={cancel} fullWidth maxWidth="xs">
        <DialogContent>
          <div className='delete-icon'>
            <img className="delete-svg" src="/svg/delete_icon.svg" />
          </div>
          <DialogContentText>
            <div className='delete-title'>Are you sure?</div>
            <div className='delete-subtitle'>Do you really want to cancel this PMS? This process cannot be undone.</div>
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