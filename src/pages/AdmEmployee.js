import * as React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Header from './Header';
import './Components/AdmEmployee.css'
import { BASE_URL } from '../constants/api_url';
// import  './Components/ViewModal.css'

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
import FormControl from '@mui/joy/FormControl';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CustomButton from './StyledComponents/CustomButton';

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

  //search
  const [searchQuery, setSearchQuery] = useState('');

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
  const url = `${BASE_URL}/edit_employee.php`;

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
    const url = `${BASE_URL}/add_employee.php`;

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

  //insert-employee-unit
  const UNIT = [
    { value: 'ORD/Records', label: 'ORD/Records' },
    { value: 'FAS', label: 'FAS' },
    { value: 'Reg. Director', label: 'Reg. Director' },
    { value: 'FO', label: 'FO' },
    { value: 'TSD', label: 'TSD' },
    { value: 'ITSM', label: 'ITSM' },
    { value: 'STLRC', label: 'STLRC' },
    { value: 'Supply', label: 'Supply' },
    { value: 'Chem Lab', label: 'Chem Lab' },
    { value: 'COA', label: 'COA' },
    { value: 'RSTL', label: 'RSTL' },
    { value: 'Micro Lab', label: 'Micro Lab' },
  ];

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
    const url = `${BASE_URL}/read_employee.php`;
    axios.get(url)
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
    const url = `${BASE_URL}/delete_employee.php`;
  
    let fData = new FormData();
    fData.append("employee_id", employee_id);
  
    const response = await axios.post(url, fData);
    if(response.data.message === "Success"){
      alert("Employee deleted successfully.");
    } else{
      alert("Error");
    }
  }

  //search
  function filterEmployee(employee) {
    if(searchQuery) {
      return employee.filter(employee => employee.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
      || employee.email.toLowerCase().includes(searchQuery.toLowerCase())
      || employee.employee_unit.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return employee;
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
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
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
        <DialogTitle className="addemp-title">
          <img className="addemp-logo" src="/images/addemp_logo.png" />
          <div className="addemp-title-content">
            <h1>Add New Employee</h1>
            <p>To add a new employee, please enter the details in the designated input field.</p>         
          </div>
          <Button onClick={handleClose} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>
        <hr className="addemp-hr" /> 
        <DialogContent>
          <div className='add-fields'>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Fullname"
              type="text"
              fullWidth
              variant="standard"
              onChange={e => setEmployeeName(e.target.value)}
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
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            onChange={e => setEmployeeEmail(e.target.value)}
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
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={e => setEmployeePassword(e.target.value)}
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
          <FormControl fullWidth variant="standard" margin="dense" style={{ marginTop: '16px' }}>
            <InputLabel
              id="unit-label"
              style={{
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Employee Unit
            </InputLabel>
            <Select
              labelId="unit-label"
              id="unit-select"
              label="Employee Unit"
              onChange={e => setEmployeeUnit(e.target.value)}
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
              style={{ height: '40px', fontFamily: 'Poppins', fontSize: '14px' }}
                MenuProps={{ PaperProps: { style: { maxHeight: '200px' } } }}
            >
              {UNIT.map((unit) => (
                <MenuItem key={unit.value} value={unit.value}>
                  {unit.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>         
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>Cancel</Button>
        <CustomButton variant="save_button" text="Save" color="primary" onClick={addEmployee} />
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
              {filterEmployee(employees).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{employee.employee_name}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{employee.email}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{employee.employee_unit}</TableCell>
                  <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>

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

      {/* --- EDIT MODAL --- */}
      <Dialog open={openEdit} onClose={CloseEdit} fullWidth maxWidth="sm">
        <DialogTitle className="editemp-title">
          <img className="editemp-logo" src="/images/editemp_logo.png" />
          <div className="editemp-title-content">
            <h1>Edit Employee Details</h1>
            <p>Update the necessary changes to the employee's details</p>         
          </div>
          <Button onClick={CloseEdit} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>
        <hr className="editemp-hr" /> 
        <DialogContent>
          <div className='editemp-fields'>
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
          <div className='editemp-fields'>
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
          <div className='editemp-fields'>
            <FormControl fullWidth variant="standard" margin="dense">
              <InputLabel
                id="unit-label"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '83%',
                  color: 'black',    
                  fontWeight: '600',
                }}
              >
                Employee Unit
              </InputLabel>
              <Select
                labelId="unit-label"
                id="unit-select"
                value={editEmployeeUnit}
                label="Employee Unit"
                onChange={(event) => setEditEmployeeUnit(event.target.value)}
                style={{ height: '40px', fontFamily: 'Poppins', fontSize: '14px' }}
                MenuProps={{ PaperProps: { style: { maxHeight: '200px' } } }}
              >
                {UNIT.map((unit) => (
                  <MenuItem key={unit.value} value={unit.value}>
                    {unit.label}
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