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
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function AdmVehicleRequest(){
    const [requestData, setRequestData] = useState([]);
    
    //modal
    const [openRequest, setOpenRequest] = React.useState(false);
    const [editRequest, setEditRequest] = React.useState(false);

    //select status
    // const [age, setAge] = React.useState('');

    // const handleChange = (event: SelectChangeEvent) => {
    // setAge(event.target.value as string);
    // };
    //read
    const [selectedRequest, setSelectedRequest] = useState({});

    //view dialog
    const VehicleView = (request) => {
        setSelectedRequest(request);
        setOpenRequest(true);
      };
    
    //view dialog
    const CloseRequestView = () => {
        setOpenRequest(false);
        setSelectedRequest({});
      };
    
    //edit dialog
    const VehicleEdit = (request) => {
        setSelectedRequest(request);
        setEditRequest(true);
      };
    
    //edit dialog
    const CloseRequestEdit = () => {
        setEditRequest(false);
        setSelectedRequest({});
      };



    useEffect(() => {
        axios.get("http://localhost/vreserv_admin_api/read_request.php")
          .then(response => {
            setRequestData(response.data);
          })
          .catch(error => {
            console.log(error);
          });
      }, []);

      return (
        <div>
            <Header/>
            <table>
                <thead>
                    <tr>
                    <th>Vehicle Name</th>
                    <th>Driver Name</th>
                    <th>Request Date</th>
                    <th>Purpose</th>
                    <th>Requested By</th>
                    <th>Request Status</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requestData.map(request => (
                    <tr key={request.request_date}>
                        <td>{request.vehicle_name}</td>
                        <td>{request.driver_name}</td>
                        <td>{request.request_date}</td>
                        <td>{request.purpose}</td>
                        <td>{request.requested_by}</td>
                        <td>{request.request_status}</td>
                        <tr>
                        <td>
                            <Button variant="contained" onClick={() => VehicleView(request)}>
                                View
                            </Button>
                        </td>
                        <td>
                            <Button variant="contained" onClick={() => VehicleEdit(request)}>
                                Edit
                            </Button>
                            
                        </td>
                        
                        </tr>

                    </tr>
                    ))}
                </tbody>
            </table>

            {/* dialog for modals */}

            <Dialog open={openRequest} onClose={CloseRequestView} >
                <DialogTitle>View Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* To add a new employee account, please enter the details in the designated input field. */}
                        </DialogContentText>
                            <div>
                                <label>{selectedRequest.vehicle_name}</label>
                                <p>Vehicle to be requested</p>
                            </div>
                            <div>
                                <label>{selectedRequest.driver_name}</label>
                                <p>Name of the driver</p>
                            </div>

                            <div>{selectedRequest.request_status}</div>

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
                                <label>Name of Passenger/s: {selectedRequest.driver_name}</label>
                            </div>
                            <div>
                                <label>Purpose: {selectedRequest.purpose}</label>
                            </div>
                            <div>
                                <label>Requested by: {selectedRequest.requested_by}</label>
                            </div>
                                

                    </DialogContent>
                        <DialogActions>
                            <Button onClick={CloseRequestView}>Close</Button>
                                {/* <Button onClick={addEmployee}>Save</Button> */}
                        </DialogActions>
            </Dialog>

            <Dialog open={editRequest} onClose={CloseRequestEdit} >
                <DialogTitle>Edit Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* To add a new employee account, please enter the details in the designated input field. */}
                        </DialogContentText>
                            {/* <div>
                                <label>{selectedRequest.vehicle_name}</label>
                                <p>Vehicle to be requested</p>
                            </div>
                            <div>
                                <label>{selectedRequest.driver_name}</label>
                                <p>Name of the driver</p>
                            </div> */}
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // value={age}
                                    label="Status"
                                    // onChange={handleChange}
                                    >
                                    <MenuItem value={'Pending'}>Pending</MenuItem>
                                    <MenuItem value={'For Approval'}>For Approval</MenuItem>
                                    <MenuItem value={'Approved'}>Approved</MenuItem>
                                    <MenuItem value={'Disapproved'}>Disapproved</MenuItem>
                                    <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
                                </Select>

                            <div>{selectedRequest.request_status}</div>
                            <div>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Vehicle Name"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    defaultValue={selectedRequest.vehicle_name}
                                />
                            </div>
                                

                    </DialogContent>
                        <DialogActions>
                            <Button onClick={CloseRequestEdit}>Close</Button>
                                {/* <Button onClick={addEmployee}>Save</Button> */}
                        </DialogActions>
            </Dialog>
        </div>
      );
}