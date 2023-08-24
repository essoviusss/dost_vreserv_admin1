import { useNavigate } from "react-router";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StyledComponents/ToastStyles.css';
import useAuth from "../hooks/useAuth";
import Header from "./Header";
import jwtDecode from 'jwt-decode';
import './GlobalCSS/content.css';
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { CSVLink } from 'react-csv';
import { BASE_URL } from "../constants/api_url";

// MUI

export default function AdmGenerate() {
  const navigate = useNavigate();
  const isLoggedIn = useAuth();
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // get the current time
      if (currentTime > decodedToken.exp) {
        localStorage.removeItem("token");
        toast.info('Token expired, please login again', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          className: 'custom-toast-info',
        });
        navigate('/');
      }
    } else if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    toast.info("You have been logged out!");
    navigate("/", { replace: true });
  };

  // table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // read
  useEffect(() => {
    const url = `${BASE_URL}/read_generate.php`;
    axios
      .get(url)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRequests(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const headers = [
    { label: 'Request Email', key: 'request_email' },
    { label: 'Request ID', key: 'request_id' },
    { label: 'Vehicle Name', key: 'vehicle_name' },
    { label: 'Driver Name', key: 'driver_name' },
    { label: 'Request Date', key: 'request_date' },
    { label: 'Departure Time', key: 'departure_time' },
    { label: 'Arrival Time', key: 'arrival_time' },
    { label: 'Request Date Range', key: 'request_date_range' },
    { label: 'Destination', key: 'destination' },
    { label: 'Passenger/s', key: 'passenger_names' },
    { label: 'Purpose', key: 'purpose' },
    { label: 'Requested By', key: 'requested_by' },
    { label: 'PM Officer', key: 'pm_officer' },
    { label: 'Approved By', key: 'approved_by' },
    { label: 'CA Officer', key: 'ca_officer' },
    { label: 'Request Status', key: 'request_status' }
  ];

   //search
   function filterRequest(request) {
    if(searchQuery) {
      return request.filter(request => request.requested_by.toLowerCase().includes(searchQuery.toLowerCase())
      || request.vehicle_name.toLowerCase().includes(searchQuery.toLowerCase())
      || request.driver_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return request;
  }

  return (
    <div className="page-container">
      <Header />
      <div className="rlogs-text">Generate</div>

      <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
          >
          <InputBase
            style={{ fontFamily: 'Poppins, sans-serif' }}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            inputProps={{ 'aria-label': 'search request' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button variant="contained" style={{
            fontFamily: 'Poppins, sans-serif',
            backgroundColor: '#025BAD',
            marginLeft: '1%',
            padding: '1%',
            height: '100%',
            width: '30%',
          }}>
          <CSVLink data={requests} headers={headers} filename="vehicle-requests.csv"
          style={{ color: 'white', textDecoration: 'none', }}>
            Export CSV
          </CSVLink>
        </Button>
        </Paper>



      <div>
        {/* --- VEHICLE REQUEST TABLE --- */}
        <Paper sx={{ borderRadius: '10px', marginTop: '2%' }}>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th className='requestlog-th' style={{ textAlign: 'center' }}>Vehicle Name</th>
                  <th className='requestlog-th' style={{ textAlign: 'center' }}>Driver Name</th>
                  <th className='requestlog-th' style={{ textAlign: 'center' }}>Requested By</th>
                  <th className='requestlog-th' style={{ textAlign: 'center' }}>Request Status</th>
                </tr>
              </thead>
              <TableBody>
                {filterRequest(requests)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow key={request.request_id}>
                      <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{request.vehicle_name}</TableCell>
                      <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '140px' }}>{request.driver_name}</TableCell>
                      <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '140px' }}>{request.requested_by}</TableCell>
                      <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', padding: 0 }}>
                        <div style={{
                          backgroundColor:
                            request.request_status === "Pending" ? '#FDC858' :
                              request.request_status === "Approved" ? '#006600' :
                                request.request_status === "Accomplished" ? '#006600' :
                                  request.request_status === "Disapproved" ? '#b21127' :
                                    request.request_status === "Not Accomplished" ? '#b21127' :
                                      request.request_status === "Cancelled" ? '#6e6e6e' :
                                        request.request_status === "For Approval" ? '#025BAD' : 'inherit',
                          color: 'white',
                          padding: '5px 5px',
                          borderRadius: '50px',
                          width: '80%',
                          margin: 'auto',
                          wordBreak: 'break-word',
                          maxWidth: '120px'
                        }}>
                          {request.request_status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 7, 25]}
            component="div"
            count={requests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
}
