import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";

//material ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';

export default function AdmVehicleRequest(){
  //defaultValue
  const [selectedRequest, setSelectedRequest] = useState({});
  const [request, setRequest] = useState([]);
  const [vehicle, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]); 


  //update
  const [editVehicleName, setEditVehicleName] = useState("");
  const [editDriverName, setEditDriverName] = useState("");
  const [editRequestStatus, setEditRequestStatus] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editPMOfficer, setEditPMOfficer] = useState("");

  //search
  const [searchQuery, setSearchQuery] = useState('');

  //modal
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  //dialog
  const handleOpenView = (request) => {
    setSelectedRequest(request);
    setOpenView(true);
  };

  const handleOpenEdit = (request) => {
    setSelectedRequest(request);
    setEditVehicleName(request.vehicle_name);
    setEditDriverName(request.driver_name);
    setEditRequestStatus(request.request_status);
    setEditPMOfficer(request.pm_officer);
    setEditReason(request.reason);
    setOpenEdit(true);
  };

  const CloseView = () => {
    setOpenView(false);
  };
  
  const CloseEdit = () => {
    setOpenEdit(false);
  };
  
  //update
  const STATUSES = [
    { value: 'Pending', label: 'Pending' },
    { value: 'For Approval', label: 'For Approval' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Disapproved', label: 'Disapproved' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  //read available vehicle
useEffect(() => {
  axios
    .get("http://localhost/vreserv_api/available_vehicle.php")
    .then((response) => {
      if (Array.isArray(response.data)) {
        setVehicles(response.data); 
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}, []);
  

  // read available driver
useEffect(() => {
  axios
    .get("http://localhost/vreserv_api/available_driver.php")
    .then((response) => {
      if (Array.isArray(response.data)) {
        setDrivers(response.data); 
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}, []);


  //read - request
  useEffect(() => {
    axios
      .get("http://localhost/vreserv_admin_api/read_request.php")
      .then((response) => {
        if(Array.isArray(response.data)){
          setRequest(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [request]);

   //update
   function handleUpdate() {
    const url = "http://localhost/vreserv_admin_api/edit_vehicleRequest.php";
  
    let fData = new FormData();
    fData.append("request_id", selectedRequest.request_id);
    fData.append("vehicle_name", editVehicleName);
    fData.append("driver_name", editDriverName);
    fData.append("pm_officer", editPMOfficer);
    fData.append("request_status", editRequestStatus);
    fData.append("selected_vehicle_name", selectedRequest.vehicle_name);
    fData.append("selected_driver_name", selectedRequest.driver_name);
    fData.append("selected_request_status", selectedRequest.request_status);
    fData.append("selected_PMOfficer", selectedRequest.pm_officer);
    if(editRequestStatus === 'Cancelled') {
      fData.append("reason", editReason);
    } else {
      fData.append("reason", "");
    }
  
    axios
      .post(url, fData)
      .then((response) => {
        alert("Request updated successfully!!");
        CloseEdit();
      })
      .catch((error) => {
        alert(error);
      });
  }

   //search
   function filterRequest(request) {
    if(searchQuery) {
      return request.filter(request => request.requested_by.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return request;
  }



    return(
        <div>
            <Header />
            <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search request' }}
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
            <th>Vehicle Name</th>
            <th>Driver Name</th>
            <th>Request Date</th>
            <th>Requested by</th>
            <th>PM Officer</th>
            <th>Request Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filterRequest(request).map((request) => (
            <tr key={request.request_id}>
              <td>{request.vehicle_name}</td>
              <td>{request.driver_name}</td>
              <td>{request.request_date}</td>
              <td>{request.requested_by}</td>
              <td>{request.pm_officer}</td>
              <td>{request.request_status}</td>
              <td>
                  <Button variant="contained" onClick={() => handleOpenView(request)}>
                    View
                  </Button>  
                </td>
                <td>
                  <Button variant="contained" onClick={() => handleOpenEdit(request)}>
                    Edit
                  </Button> 
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* view modal*/}
      <Dialog open={openView} onClose={CloseView} fullWidth maxWidth="sm">
            <DialogTitle>View Details</DialogTitle>
            <DialogContent>
                        <DialogContentText>
                            {/* To add a new employee account, please enter the details in the designated input field. */}
                        </DialogContentText>
                            <div>
                            <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Vehicle to be Requested"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    defaultValue={selectedRequest.vehicle_name}
                                    InputProps={{
                                        readOnly: true,
                                      }}
                                />
                            </div>
                            <div>
                            <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Driver Name"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    defaultValue={selectedRequest.driver_name}
                                    InputProps={{
                                        readOnly: true,
                                      }}
                                />
                            

                            </div>
                            <div>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Status"
                                type="text"
                                fullWidth
                                variant="filled"
                                defaultValue={selectedRequest.request_status}
                                InputProps={{
                                    readOnly: true,
                                  }}
                              />
                              {selectedRequest.request_status === 'Cancelled' && (
                                <TextField
                                  autoFocus
                                  margin="dense"
                                  id="name"
                                  label="Reason"
                                  type="text"
                                  fullWidth
                                  variant="filled"
                                  defaultValue={selectedRequest.reason}
                                  InputProps={{
                                      readOnly: true,
                                    }}
                                />
                              )}
                            </div>
                            <div>
                            <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Preventive Maintenance Officer"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    defaultValue={selectedRequest.pm_officer}
                                    InputProps={{
                                        readOnly: true,
                                      }}
                                />
                            </div>
                            <div>
                                <h6>Schedule of Travel</h6>
                            </div>                                
                                
                            <div>
                                <label>Date: {selectedRequest.request_date}</label>
                            </div>

                            <div>
                                <label>Time of Departure: {selectedRequest.departure_time}</label>
                            </div>
                            <div>
                                <label>Time of Return to Garage: {selectedRequest.arrival_time}</label>
                            </div>
                            <div>
                                <label>Destination: {selectedRequest.destination}</label>
                            </div>
                            <div>
                                <h6>Other Details</h6>
                            </div>
                            <div>
                                <label>Total No. of Passenger/s : {selectedRequest.passenger_count}</label>
                            </div>
                            <div>
                                <label>Name of Passenger/s: </label>
                                {selectedRequest.passenger_names && Array.isArray(selectedRequest.passenger_names) && selectedRequest.passenger_names.map((passenger, index) => (
                                  <div key={index}>{passenger}</div>
                                ))}
                            </div>
                            <div>
                                <label>Purpose: {selectedRequest.purpose}</label>
                            </div>
                            <div>
                                <label>Requested by: {selectedRequest.requested_by}</label>
                            </div>   
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
                    <div>
                    <FormControl fullWidth variant="standard" margin="dense">
                        <InputLabel id="vehicle-select-label">Vehicle</InputLabel>
                        <Select
                            labelId="vehicle-select-label"
                            id="vehicle-select"
                            value={editVehicleName}
                            onChange={(event) => setEditVehicleName(event.target.value)}
                        >
                            <MenuItem value="">Select Vehicle</MenuItem>
                            {vehicle.map((vehicle) => (
                                <MenuItem key={vehicle.vehicle_id} value={vehicle.vehicle_name}>
                                    {vehicle.vehicle_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                    <div>
                    <FormControl fullWidth variant="standard" margin="dense">
                        <InputLabel id="driver-select-label">Driver</InputLabel>
                        <Select
                            labelId="driver-select-label"
                            id="driver-select"
                            value={editDriverName}
                            onChange={(event) => setEditDriverName(event.target.value)}
                        >
                            <MenuItem value="">Select Driver</MenuItem>
                            {drivers.map((driver) => (
                                <MenuItem key={driver.driver_id} value={driver.driver_name}>
                                    {driver.driver_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
  

                     <div>
                      <FormControl fullWidth variant="standard" margin="dense">
                          <InputLabel id="request-status-label">Request Status</InputLabel>
                          <Select
                            labelId="request-status-label"
                            id="request-status-select"
                            value={editRequestStatus}
                            label="Request Status"
                            onChange={(event) => setEditRequestStatus(event.target.value)}
                          >
                            {STATUSES.map((status) => (
                              <MenuItem key={status.value} value={status.value}>
                                {status.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {editRequestStatus === 'Cancelled' && (
                          <>
                            <FormLabel>Reason for Cancellation</FormLabel>
                            <Textarea 
                              placeholder="" 
                              minRows={2} 
                              value={editReason}
                              onChange={(event) => setEditReason(event.target.value)}
                            />
                          </>
                        )}
                      </div>
                      <div>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Preventive Maintenance Officer"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRequest.pm_officer}
                        onChange={(event) => setEditPMOfficer(event.target.value)}
                    />
                      </div>
                      <div>
                      
                      </div>
                    <div>
                      <h6>Schedule of Travel</h6>
                    </div>   

                    <div>
                      <label>Date: {selectedRequest.request_date}</label>
                    </div>
                    
                    <div>
                      <label>Time of Departure: {selectedRequest.departure_time}</label>
                    </div>
                    <div>
                      <label>Time of Return to Garage: {selectedRequest.arrival_time}</label>
                    </div>
                    <div>
                      <label>Destination: {selectedRequest.destination}</label>
                    </div>
                    <div>
                      <h6>Other Details</h6>
                    </div>
                    <div>
                      <label>Total No. of Passenger/s : {selectedRequest.passenger_count}</label>
                    </div>
                    <div>
                      <label>Name of Passenger/s: </label>
                        {selectedRequest.passenger_names && Array.isArray(selectedRequest.passenger_names) && selectedRequest.passenger_names.map((passenger, index) => (
                      <div key={index}>{passenger}</div>
                        ))}
                    </div>
                    <div>
                      <label>Purpose: {selectedRequest.purpose}</label>
                    </div>
                    <div>
                      <label>Requested by: {selectedRequest.requested_by}</label>
                    </div>              
          </DialogContent>
          <DialogActions>
            <Button onClick={CloseEdit}>Close</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogActions>
        </Dialog>

        </div>
    );
}