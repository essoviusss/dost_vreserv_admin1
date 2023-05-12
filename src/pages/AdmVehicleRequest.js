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

export default function AdmVehicleRequest(){
  //defaultValue
  const [selectedRequest, setSelectedRequest] = useState({});
  const [request, setRequest] = useState([]);

  //update
  const [editVehicleName, setEditVehicleName] = useState("");
  const [editDriverName, setEditDriverName] = useState("");
  const [editRequestStatus, setEditRequestStatus] = useState("");

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
    setOpenEdit(true);
  };

  const CloseView = () => {
    setOpenView(false);
  };
  
  const CloseEdit = () => {
    setOpenEdit(false);
  };
  
  //read
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
    fData.append("request_status", editRequestStatus);
    fData.append("selected_vehicle_name", selectedRequest.vehicle_name);
    fData.append("selected_driver_name", selectedRequest.driver_name);
    fData.append("selected_request_status", selectedRequest.request_status);
  
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



    return(
        <div>
            <Header />
            <table>
        <thead>
          <tr>
            <th>Vehicle Name</th>
            <th>Driver Name</th>
            <th>Request Date</th>
            <th>Request Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {request.map((request) => (
            <tr key={request.request_id}>
              <td>{request.vehicle_name}</td>
              <td>{request.driver_name}</td>
              <td>{request.request_date}</td>
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
                                    label="Name of the Driver"
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
                                <label>Name of Passenger/s: {selectedRequest.passenger_name}</label>
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
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Plate Number"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRequest.vehicle_name}
                        onChange={(event) => setEditVehicleName(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Driver Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRequest.driver_name}
                        onChange={(event) => setEditDriverName(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Request Status"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRequest.request_status}
                        onChange={(event) => setEditRequestStatus(event.target.value)}
                    />              
          </DialogContent>
          <DialogActions>
            <Button onClick={CloseEdit}>Close</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogActions>
        </Dialog>

        </div>
    );
}