import * as React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';
import Header from "./Header";
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs from 'dayjs';


import jwtDecode from 'jwt-decode';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function AdmSchedule() {
    const isLoggedIn = useAuth();
    const navigate = useNavigate();
  
  //modal
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

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
      return pms.filter(pms => pms.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return pms;
  }

  //insert
  function addPms(id) {
    const url = "http://localhost/vreserv_admin_api/add_pms.php";
    alert(id);
    let fData = new FormData();
    
    fData.append("pmsId", selectedVehicle);
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
function deleteSchedule(pms_id) {
  const url = "http://localhost/vreserv_admin_api/delete_pms.php";
  
  let fData = new FormData();
  fData.append("pms_id", pms_id);
  
  axios
    .post(url, fData)
    .then(response => {
      alert("Schedule deleted successfully!!");
      setPMS(pms.filter(item => item.pms_id !== pms_id));
    })
    .catch(error => {
      alert(error);
    });
}
    // update
const handleUpdate = () => {
  const url = "http://localhost/vreserv_admin_api/edit_pms.php";
  let fData = new FormData();
  fData.append("pms_id", selectedPMS.pms_id);
  
  // Format date and time values
  const formattedStartDate = editPmsStartdate.format("YYYY-MM-DD HH:mm:ss");
  const formattedEndDate = editPmsEnddate.format("YYYY-MM-DD HH:mm:ss");
  
  fData.append("pms_startdate", formattedStartDate);
  fData.append("pms_enddate", formattedEndDate);
  
  axios
    .post(url, fData)
    .then((response) => {
      console.log("Response data:", response.data); // Logging the response data
      if(response.data === "Success"){
        alert("PMS updated successfully!!");
        CloseEdit();
      } else{
        alert("Error");
      }
    })
    .catch((error) => {
      console.log("Error:", error); // Logging the error
      alert(error);
    });
}
  return (
    <div>
      <Header/>
      <Button variant="contained" onClick={handleClickOpen}>
        + Add Vehicle PMS
      </Button>  
      <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search employee' }}
        value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>    
      <table>
        <thead>
          <tr>
            <th>Plate Number</th>
            <th>Vehicle Name</th>
            <th>Initial PMS</th>
            <th>PMS Start Date</th>
            <th>PMS End Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filterPMS(pms).map((data) => (
            <tr key={data.pms_id}>
              <td>{data.vehicle_number}</td>
              <td>{data.vehicle_name}</td>
              <td>{data.initial_pms}</td>
              <td>{data.pms_startdate === "0000-00-00 00:00:00" ? "Not Set": data.pms_startdate}</td>
              <td>{data.pms_enddate === "0000-00-00 00:00:00" ? "Not Set" : data.pms_enddate}</td>
              <td>
                  <Button variant="contained" onClick={() => handleOpenEdit(data)}>
                    Edit
                  </Button> 
              </td> 
              <td>
              <Button variant="contained" onClick={() => deleteSchedule(data.pms_id)}>
                Cancel
              </Button>
              </td> 
            </tr>
          ))}
        </tbody>
      </table>
      <div>

      </div>
      {/* insert modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"> 
        <DialogTitle>Add New PMS</DialogTitle>
        <DialogContent>
          <DialogContentText>
          To add a new vehicle pms, please enter the details in the designated input field.
          </DialogContentText>
          <div>
        <label htmlFor="month-select">Select Month</label>
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

        <label htmlFor="vehicle-select">Select Vehicle</label>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => addPms(selectedVehicle)}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* edit modal */}
      <Dialog open={openEdit} onClose={CloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit PMS</DialogTitle>
        <DialogContent>
          <div>
            <div>
              <h6>PMS Start Date</h6>
            </div>
            <div> 
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateTimePicker 
              orientation="landscape"
              value={editPmsStartdate || dayjs()} 
              onChange={(newValue) => {
                setEditPmsStartdate(newValue);
              }}
            />
          </LocalizationProvider>

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

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={CloseEdit}>Cancel</Button>
          <Button onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>


  );
}
