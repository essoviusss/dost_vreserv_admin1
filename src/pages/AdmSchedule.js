import { useState, useEffect } from "react";
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Header from "./Header";
import jwtDecode from 'jwt-decode';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function AdmSchedule() {
    const isLoggedIn = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [pms, setPMS] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

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

  return (
    <div>
      <Header/>
      <Button variant="contained" onClick={handleClickOpen}>
        + Add Vehicle PMS
      </Button>
      <Dialog open={open} onClose={handleClose}>
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
      
      <table>
        <thead>
          <tr>
            <th>Vehicle Name</th>
            <th>Initial PMS</th>
            <th>PMS Start Date</th>
            <th>PMS End Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pms.map((data) => (
            <tr key={data.pms_id}>
              <td>{data.vehicle_name}</td>
              <td>{data.initial_pms}</td>
              <td>{data.pms_startdate === "0000-00-00 00:00:00" ? "Not Set": data.pms_startdate}</td>
              <td>{data.pms_enddate === "0000-00-00 00:00:00" ? "Not Set" : data.pms_enddate}</td>
              <td><span><Button>Delete</Button></span><span><Button>Update</Button></span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
