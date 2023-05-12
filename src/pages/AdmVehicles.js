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



export default function AdmVehicle() {
  const UID = uuidv4();

  //insert
  const [vehicle_number, setVehicleNumber] = useState("");
  const [vehicle_name, setVehicleName] = useState("");
  

  //defaultValue
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [vehicles, setVehicle] = useState([]);
  
  //update
  const [editVehicleName, setEditVehicleName] = useState("");
  const [editVehicleNumber, setEditVehicleNumber] = useState("");
  const [editVehicleStatus, setEditVehicleStatus] = useState("");

  
  
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
    setEditVehicleNumber(vehicle.vehicle_number);
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
    fData.append("vehicle_number", vehicle_number);
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
  function handleUpdate() {
    const url = "http://localhost/vreserv_admin_api/edit_vehicle.php";
  
    let fData = new FormData();
    fData.append("vehicle_id", selectedVehicle.vehicle_id);
    fData.append("vehicle_name", editVehicleName);
    fData.append("vehicle_number", editVehicleNumber);
    fData.append("vehicle_status", editVehicleStatus);
    fData.append("selected_vehicle_name", selectedVehicle.vehicle_name);
    fData.append("selected_vehicle_number", selectedVehicle.vehicle_number);
    fData.append("selected_vehicle_status", selectedVehicle.vehicle_status);
  
    axios
      .post(url, fData)
      .then((response) => {
        alert("Vehicle updated successfully!!");
        CloseEdit();
      })
      .catch((error) => {
        alert(error);
      });
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
            id="vehicle_number"
            label="Plate Number"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setVehicleNumber(e.target.value)}
          />
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
      <table>
        <thead>
          <tr>
            {/* <th>Vehicle ID</th> */}
            <th>Vehicle Number</th>
            <th>Vehicle Name</th>
            <th>Vehicle Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.vehicle_id}>
              {/* <td>{vehicle.vehicle_id}</td> */}
              <td>{vehicle.vehicle_number}</td>
              <td>{vehicle.vehicle_name}</td>
              <td>{vehicle.vehicle_status}</td>
              <td>
                  <Button variant="contained" onClick={() => handleOpenView(vehicle)}>
                    View
                  </Button>  
                </td>
                <td>
                  <Button variant="contained" onClick={() => handleOpenEdit(vehicle)}>
                    Edit
                  </Button> 
                </td>
                <td>
                  <Button variant="contained" onClick={() => deleteVehicle(vehicle.vehicle_id)}>
                    Delete
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
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Vehicle Number"
                    type="text"
                    fullWidth
                    variant="filled"
                    defaultValue={selectedVehicle.vehicle_number}
                    InputProps={{
                      readOnly: true,
                    }}
                />
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
                        label="Plate Number"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedVehicle.vehicle_number}
                        onChange={(event) => setEditVehicleNumber(event.target.value)}
                    />
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
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Vehicle Status"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedVehicle.vehicle_status}
                        onChange={(event) => setEditVehicleStatus(event.target.value)}
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
