import * as React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import axios from "axios";
// import '../pages/Components/EmployeeTable.css'
//material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AdmEmployee() {
//inserting employee
  const [open, setOpen] = React.useState(false);
  const [employee_name, setEmployeeName] = useState("");
  const [employee_email, setEmployeeEmail] = useState("");
  const [employee_username, setEmployeeUsername] = useState("");
  const [employee_password, setEmployeePassword] = useState("");
  const [employee_unit, setEmployeeUnit] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }; 

  function addEmployee(){
    const url = "http://localhost/vreserv_admin_api/add_employee.php";

    let fData = new FormData();
    fData.append("employee_name", employee_name);
    fData.append("employee_email", employee_email);
    fData.append("employee_username", employee_username);
    fData.append("employee_password", employee_password);
    fData.append("employee_unit", employee_unit);


    axios.post(url, fData)
      .then(response => {
        alert(response.data.data);
      })
      .catch(error => {
       alert(error);
      });
  }

  //read table
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/vreserv_admin_api/available_employee.php')
      .then(response => {
        setResponseData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                + Add New Employee
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogContent>
                <DialogContentText>
                To add a new employee account, please enter the details in the designated input field.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Fullname"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={e => setEmployeeName(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="standard"
                    onChange={e => setEmployeeEmail(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={e => setEmployeeUsername(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    onChange={e => setEmployeePassword(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Employee Unit"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={e => setEmployeeUnit(e.target.value)}
                />             
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={addEmployee}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
        <div className='employee-tbl'>
        <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Employee Unit</th>
          </tr>
        </thead>
        <tbody>
          {responseData && responseData.map((data, index) => (
            <tr key={index}>
              <td>{data.employee_id}</td>
              <td>{data.employee_name}</td>
              <td>{data.employee_unit}</td>
            </tr>
          ))}
        </tbody>
      </table>

        </div>
    </div>
  );
}
