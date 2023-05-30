import * as React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Header from './Header';
// import  './Components/ViewModal.css'
// import '../pages/Components/EmployeeTable.css'

//material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import jwtDecode from 'jwt-decode';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';

export default function AdmEmployee() {
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
  const [open, setOpen] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [cancel, setCancel] = useState(false);

  //inserting employee
  const [employee_name, setEmployeeName] = useState("");
  const [email, setEmployeeEmail] = useState("");
  const [employee_password, setEmployeePassword] = useState("");
  const [employee_unit, setEmployeeUnit] = useState("");
  const [employees, setEmployees] = useState([]);

  //read
  const [selectedEmployee, setSelectedEmployee] = useState({});

  //update
  const [editEmployeeName, setEditEmployeeName] = useState("");
  const [editEmployeeEmail, setEditEmployeeEmail] = useState("");
  const [editEmployeeUnit, setEditEmployeeUnit] = useState("");

  //modals
  const handleOpenView = (employee) => {
    setSelectedEmployee(employee);
    setOpenView(true);
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditEmployeeName(employee.employee_name);
    setEditEmployeeEmail(employee.email);
    setEditEmployeeUnit(employee.employee_unit);
    setOpenEdit(true);
  };

  //delete
  const [selectedRow, setSelectedRow] = useState(null);

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

  //dialog
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }; 

  const CloseView = () => {
    setOpenView(false);
  };
  
  const CloseEdit = () => {
    setOpenEdit(false);
  };
  
  const handleDelete = (employee) => {
    setSelectedRow(employee);
    setCancel(true);
  };
  
  const handleConfirmDelete = () => {
    if (selectedRow) {
      deleteEmployee(selectedRow.employee_id);
      setCancel(false);
    }
  };
  
  const handleCancelDelete = () => {
    setSelectedRow(null);
    setCancel(false);
  };


//update
async function handleUpdate() {
  const url = "http://localhost/vreserv_admin_api/edit_employee.php";

  let fData = new FormData();
  fData.append("employee_id", selectedEmployee.employee_id);
  fData.append("employee_name", editEmployeeName);
  fData.append("email", editEmployeeEmail);
  fData.append("employee_unit", editEmployeeUnit);
  fData.append("selected_employee_name", selectedEmployee.employee_name);
  fData.append("selected_email", selectedEmployee.email);
  fData.append("selected_employee_unit", selectedEmployee.employee_unit);

  const response = await axios.post(url, fData);
  if(response.data.message === "Success"){
    alert("Updated");
  } else{
    alert("Error");
  }
  CloseEdit();
}
 
  //insert
  function addEmployee(){
    const url = "http://localhost/vreserv_admin_api/add_employee.php";

    let fData = new FormData();
    fData.append("user_id", UID);
    fData.append("employee_name", employee_name);
    fData.append("employee_email", email);
    fData.append("employee_password", employee_password);
    fData.append("employee_unit", employee_unit);


    axios.post(url, fData)
      .then(response => {
        if(response.data === "Success"){
          alert("Employee added successfully!!");
        }
        handleClose();
      })
      .catch(error => {
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

  //read table
  useEffect(() => {
    axios.get('http://localhost/vreserv_admin_api/read_employee.php')
      .then(response => {
        if(Array.isArray(response.data)){
          setEmployees(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [employees]);

  //delete
  async function deleteEmployee(employee_id){
    const url = "http://localhost/vreserv_admin_api/delete_employee.php";
  
    let fData = new FormData();
    fData.append("employee_id", employee_id);
  
    const response = await axios.post(url, fData);
    if(response.data.message === "Success"){
      alert("Employee deleted successfully.");
    } else{
      alert("Error");
    }
  }

  return (
    <div className='page-container'>
      <Header/>
      <div className="rlogs-text">Employees</div>

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
        />
        <Button
          variant="contained"
          onClick={handleOpen}
          style={{
            fontFamily: 'Poppins, sans-serif',
            backgroundColor: '#025BAD',
            marginLeft: '1%',
            padding: '1%',
            height: '100%',
            width: '30%',
          }}
        >
          + Add New Employee
        </Button>
      </Paper>

      {/* --- ADD EMPLOYEE MODAL --- */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Employee</DialogTitle>
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
      
      {/* --- EMPLOYEE TABLE --- */}
      <Paper sx={{ borderRadius: '10px', marginTop: '2%' }}>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Employee Name</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Employee Email</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Employee Unit</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <TableBody>
              {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{employee.employee_name}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{employee.email}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{employee.employee_unit}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenView(employee)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <RemoveRedEyeRoundedIcon />
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenEdit(employee)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <EditRoundedIcon />
                      </Button>
                      <Button 
                        variant="contained"
                        onClick={() => handleDelete(employee)}
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
            count={employees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>

      {/* --- VIEW MODAL --- */}
      <Dialog open={openView} onClose={CloseView}>
        <DialogTitle>View Details</DialogTitle>
        <DialogContent>
        <DialogContentText>
        {/* To add a new employee account, please enter the details in the designated input field. */}
        </DialogContentText>
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Fullname"
            type="text"
            fullWidth
            variant="filled"
            defaultValue={selectedEmployee.employee_name}
            InputProps={{
              readOnly: true,
            }}
        />
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            variant="filled"
            defaultValue={selectedEmployee.email}
            InputProps={{
              readOnly: true,
            }}
        />
        
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Employee Unit"
            type="text"
            fullWidth
            variant="filled"
            defaultValue={selectedEmployee.employee_unit}
            InputProps={{
              readOnly: true,
            }}
        />              
        </DialogContent>
        <DialogActions>
        <Button onClick={CloseView}>Close</Button>
        {/* <Button onClick={addEmployee}>Save</Button> */}
        </DialogActions>
    </Dialog>
            {/* edit modal */}
            <Dialog open={openEdit} onClose={CloseEdit}>
                    <DialogTitle>Edit Details</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                    {/* To add a new employee account, please enter the details in the designated input field. */}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Fullname"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedEmployee.employee_name}
                        onChange={(event) => setEditEmployeeName(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedEmployee.email}
                        onChange={(event) => setEditEmployeeEmail(event.target.value)}
                    />
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Employee Unit"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedEmployee.employee_unit}
                        onChange={(event) => setEditEmployeeUnit(event.target.value)}
                    />              
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={CloseEdit}>Close</Button>
                    <Button onClick={handleUpdate}>Save</Button>
                    </DialogActions>
                </Dialog>
        
        {/* delete modal */}
        <Dialog open={cancel} fullWidth maxWidth="sm">
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>No</Button>
          <Button onClick={handleConfirmDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}