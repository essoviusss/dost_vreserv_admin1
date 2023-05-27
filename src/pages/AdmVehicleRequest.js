import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import './Components/AdmVehicleRequest.css'

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
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import jsPDF from 'jspdf';

export default function AdmVehicleRequest(){
  //defaultValue
  const [selectedRequest, setSelectedRequest] = useState({});
  const [requests, setRequest] = useState([]);
  const [vehicle, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]); 

  //jwt
  const role = localStorage.getItem("admin_role");

  //update
  const [editFormCode, setEditFormCode] = useState("");
  const [editRevCode, setEditRevCode] = useState("");
  const [editVehicleName, setEditVehicleName] = useState("");
  const [editDriverName, setEditDriverName] = useState("");
  const [editRequestStatus, setEditRequestStatus] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editPMOfficer, setEditPMOfficer] = useState("");
  const [editApprovedBy, setEditApprovedBy] = useState("");

  //search
  const [searchQuery, setSearchQuery] = useState('');

  //modal
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

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
  const handleOpenView = (request) => {
    setSelectedRequest(request);
    setOpenView(true);
  };

  const handleOpenEdit = (request) => {
    setSelectedRequest(request);
    setEditFormCode(request.form_code);
    setEditRevCode(request.rev_code);
    setEditVehicleName(request.vehicle_name);
    setEditDriverName(request.driver_name);
    setEditRequestStatus(request.request_status);
    setEditPMOfficer(request.pm_officer);
    setEditApprovedBy(request.approved_by);
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
    role === "Manager" ? { value: 'Pending', label: 'Pending' } : { value: 'For Approval', label: 'For Approval' },
    role === "Manager" ? { value: 'For Approval', label: 'For Approval' } : { value: 'Approved', label: 'Approved' }, 
    role === "Manager" ? { value: 'Cancelled', label: 'Cancelled' } : { value: 'Disapproved', label: 'Disapproved' },
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
    const fetchData = async () => {
      try {
        const admin_role = localStorage.getItem("admin_role");
        // Define the FormData
        let formData = new FormData();
        formData.append('admin_role', admin_role);

        const response = await axios.post("http://localhost/vreserv_admin_api/read_request.php", formData);

        if (Array.isArray(response.data.data) && response.data.message === "Success") {
          // Set the requests state
          setRequest(response.data.data);
          console.log("Very Nice");
        } else {
          console.log("Madi");
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [requests]);


   //update
   async function handleUpdate() {
    const url = "http://localhost/vreserv_admin_api/edit_vehicleRequest.php";
    
    let fData = new FormData();
    fData.append("request_id", selectedRequest.request_id);
    fData.append("form_code", editFormCode);
    fData.append("rev_code", editRevCode);
    fData.append("vehicle_name", editVehicleName);
    fData.append("driver_name", editDriverName);
    fData.append("pm_officer", editPMOfficer);
    fData.append("approved_by", editApprovedBy);
    fData.append("request_status", editRequestStatus);
    fData.append("selected_vehicle_name", selectedRequest.vehicle_name);
    fData.append("selected_driver_name", selectedRequest.driver_name);
    fData.append("selected_request_status", selectedRequest.request_status);
    fData.append("selected_PMOfficer", selectedRequest.pm_officer);
    fData.append("selected_ApprovedBy", selectedRequest.approved_by);
    if(editRequestStatus === 'Cancelled' || editRequestStatus === 'Disapproved' ) {
      fData.append("reason", editReason);
    } else {
      fData.append("reason", "");
    }
    
    const response = await axios.post(url, fData);
    if(response.data.message === "Success"){
      alert("Updated");
    } else{
      alert("Madi");
    }
    CloseEdit();
  }

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

  const generatePDF = () => {
    const doc = new jsPDF();
    const passengerNames = Array.isArray(selectedRequest.passenger_names)
      ? selectedRequest.passenger_names.join(", ")
      : selectedRequest.passenger_names || "No passengers";

    console.log("Passenger Names:", passengerNames);

    console.log("Passenger Names:", passengerNames);

    const pageTitle = `
    Republic of the Philippines
    DEPARTMENT OF SCIENCE AND TECHNOLOGY
    Regional Office No. 1
    DMMMSU MLUC Campus, City of San Fernando, La Union`;
  
    const subtitle = `
    REQUEST FOR THE USE OF VEHICLE`;
  
    const content1 = `
    Vehicle to be requested: ${selectedRequest.vehicle_name}
    Name of Driver: ${selectedRequest.driver_name}
    Schedule of Travel
        Time of Departure: ${selectedRequest.departure_time}
        Time of Return to Garage: ${selectedRequest.arrival_time}
    Destination: ${selectedRequest.destination}
  
    Passenger/s:  ${passengerNames}
    Total No. of Passengers: ${selectedRequest.passenger_count}
    Purpose(Attach gate pass if applicable): ${selectedRequest.purpose}
  
    Requested by:
  
              ${selectedRequest.requested_by}
          ___________________________
          Signature Over Printed Name
  
    Date of Request: ${selectedRequest.request_date}
    `;
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const textLines = pageTitle.split("\n");
    const textLines1 = subtitle.split("\n");
    const textLinesContent = content1.split("\n");
  
    const textHeight = doc.internal.getLineHeight() / doc.internal.scaleFactor;
  
    const centerX = pageWidth / 2;
    const topY = textHeight + 10;
  
    const centerX1 = pageWidth / 2;
    const topY1 = textHeight + 33;
  
    const topY2 = textHeight + 45;
  
    const fontSize = 10;
    const lineSpacingFactor1 = 0.6;
    const lineSpacingFactor2 = 0.6;
  
    textLines.forEach((line, index) => {
      const textWidth = doc.getStringUnitWidth(line) * fontSize / doc.internal.scaleFactor;
      const lineX = centerX - (textWidth / 2);
      const lineY = topY + (index * textHeight * lineSpacingFactor1);
  
      doc.setFontSize(fontSize);
      doc.text(line, lineX, lineY);
    });
  
    textLines1.forEach((line, index) => {
      const textWidth = doc.getStringUnitWidth(line) * fontSize / doc.internal.scaleFactor;
      const lineX = centerX1 - (textWidth / 2);
      const lineY = topY1 + (index * textHeight);
  
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "bold");
      doc.text(line, lineX, lineY);
    });
  
    const content1X = 15;
    const content1Y = topY2;
  
    textLinesContent.forEach((line, index) => {
      const splitLine = line.split(":");
      const label = splitLine[0] + (splitLine[1] ? ":" : "");
      const value = splitLine[1] || "";
  
      const lineX = content1X;
      const lineY = content1Y + (index * textHeight * lineSpacingFactor2);
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize);
      doc.text(label, lineX, lineY);
  
      if (value) {
        const labelWidth = doc.getStringUnitWidth(label) * fontSize / doc.internal.scaleFactor;
  
        doc.setFont("helvetica", "normal");
        doc.text(value, lineX + labelWidth, lineY);
      }
    });
  
    const contentTitle = "RECOMMENDATION";
    const contentContent = "Availability of requested Vehicle and Driver";

    const checkbox1Label = "Available";
    const checkbox2Label = "Not Available";
    const checkbox3Label = "Schedule Maintenance";
    const checkbox4Label = "Breakdown";
    const checkbox5Label = "Other__________________________";
    const bTitle = `
    ${selectedRequest.pm_officer}
    Preventive Maintenance Officer for Vehicles
    `;
    const bDate =  `

    Date:___________________
    `;
    const bRemarks = `Remarks:_____________________________________________________________________`;

    const contentTitle2 = "ACTION OF REQUEST";
    const checkbox1Label6 = "Approved";
    const checkbox2Label7 = "Disapproved, Reasons:____________________________________________________________";

    const bTitle2 = `
    ${selectedRequest.approved_by}
    OIC, Regional Director
    `;
    const bDate2 = "Date:___________________";

    const boxX = content1X;
    const boxY = content1Y + (textLinesContent.length * textHeight * lineSpacingFactor2) + 2;
    const boxWidth = pageWidth - 2 * content1X;
    const boxHeight = doc.internal.pageSize.getHeight() - boxY - 20;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);

    doc.rect(boxX, boxY, boxWidth, boxHeight, 'FD');

    const contentTitleWidth = doc.getStringUnitWidth(contentTitle) * fontSize / doc.internal.scaleFactor;
    const contentTitleX = boxX + (boxWidth - contentTitleWidth) / 2;
    const contentTitleY = boxY + 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.text(contentTitle, contentTitleX, contentTitleY);

    const contentContentX = boxX + 5;
    const contentContentY = contentTitleY + textHeight ;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.text(contentContent, contentContentX, contentContentY);

    const checkboxX = contentContentX;
    const checkboxY = contentContentY + textHeight + 2;
    const checkboxSize = 5;
    const checkboxSpacing = 50;

    doc.setFontSize(fontSize);
    doc.setLineWidth(0.1);
    doc.rect(checkboxX, checkboxY, checkboxSize, checkboxSize);
    doc.text(checkboxX + checkboxSize + 2, checkboxY + checkboxSize - 1, checkbox1Label);

    doc.setFontSize(fontSize);
    doc.setLineWidth(0.1);
    doc.rect(checkboxX + checkboxSpacing, checkboxY, checkboxSize, checkboxSize);
    doc.text(checkboxX + checkboxSpacing + checkboxSize + 2, checkboxY + checkboxSize - 1, checkbox2Label);

    const checkboxY2 = checkboxY + checkboxSize + 2;

    doc.setFontSize(fontSize);
    doc.setLineWidth(0.1);
    doc.rect(checkboxX, checkboxY2, checkboxSize, checkboxSize);
    doc.text(checkboxX + checkboxSize + 2, checkboxY2 + checkboxSize - 1, checkbox3Label);

    doc.setFontSize(fontSize);
    doc.setLineWidth(0.1);
    doc.rect(checkboxX + checkboxSpacing, checkboxY2, checkboxSize, checkboxSize);
    doc.text(checkboxX + checkboxSpacing + checkboxSize + 2, checkboxY2 + checkboxSize - 1, checkbox4Label);

    doc.setFontSize(fontSize);
    doc.setLineWidth(0.1);
    doc.rect(checkboxX + checkboxSpacing * 2, checkboxY2, checkboxSize, checkboxSize);
    doc.text(checkboxX + checkboxSpacing * 2 + checkboxSize + 2, checkboxY2 + checkboxSize - 1, checkbox5Label);

    const bTitleX = pageWidth / 2; 
    const bTitleY = checkboxY + checkboxSize + 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.text(bTitle, bTitleX, bTitleY, { align: "center" });

    const bDateX = pageWidth / 2; 
    const bDateY = bTitleY + textHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.text(bDate, bDateX, bDateY, { align: "center" });

    const bRemarksX = pageWidth / 2; // Calculate X-coordinate for center alignment
    const bRemarksY = bTitleY + textHeight + 17;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.text(bRemarks, bRemarksX, bRemarksY, { align: "center" });

    const lineStartX = content1X;
    const lineEndX = pageWidth - content1X;
    const lineY = bRemarksY + textHeight;

    doc.setLineWidth(0.3);
    doc.setDrawColor(0); // Set the line color to black
    doc.line(lineStartX, lineY, lineEndX, lineY);

    const contentTitle2X = pageWidth / 2;
    const contentTitle2Y = lineY + 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.text(contentTitle2, contentTitle2X, contentTitle2Y, { align: "center" });


    const checkboxX11 = contentContentX;
    const checkboxY11 = contentContentY + textHeight + 70; // Adjust the top margin value here
    const checkboxSize11 = 5;
    const checkboxSpacing11 = 2;

    // Checkbox 1: Approved
    doc.setFontSize(fontSize);
    doc.setLineWidth(0.1);
    doc.rect(checkboxX11, checkboxY11, checkboxSize11, checkboxSize11);
    doc.setFont("helvetica", "normal");
    doc.text(checkboxX11 + checkboxSize11 + 2, checkboxY11 + checkboxSize11 - 1, checkbox1Label6);

    // Checkbox 2: Disapproved
    doc.setFontSize(fontSize);
    doc.setLineWidth(0.1);
    doc.rect(checkboxX11, checkboxY11 + checkboxSize11 + checkboxSpacing11, checkboxSize11, checkboxSize11);
    doc.setFont("helvetica", "normal");
    doc.text(checkboxX11 + checkboxSize11 + 2, checkboxY11 + checkboxSize11 * 2  + checkboxSpacing11, checkbox2Label7);

    const bTitle2X = pageWidth / 2;
    const bTitle2Y = checkboxY11 + checkboxSize11 * 2 + 20; // Adjust the top margin value here

    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.text(bTitle2, bTitle2X, bTitle2Y, { align: "center" });

    const bDate2X = pageWidth / 2;
    const bDate2Y = bTitle2Y + textHeight + 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.text(bDate2, bDate2X, bDate2Y, { align: "center" });

    // Save the PDF
    doc.save(`${selectedRequest.requested_by}.VRESERV_Request_Report.pdf`);
};
    return(
      <div className="page-container">
        <Header/>
        <div className="rlogs-text">Requests</div>
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
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
      </Paper>
      <Paper sx={{ borderRadius: '10px', marginTop: '2%' }}>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Vehicle Name</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Driver Name</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Requested By</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Request Status</th>
                <th className='requestlog-th' style={{ textAlign: 'center' }}>Action</th>
              </tr>
              </thead>
              <TableBody>
                {filterRequest(requests)
                .map((request) => (
                  <TableRow key={request.request_id}>
                    <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '120px' }}>{request.vehicle_name}</TableCell>
                    <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '140px' }}>{request.driver_name}</TableCell>
                    <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '140px' }}>{request.requested_by}</TableCell>
                    <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', padding: 0 }}>
                      <div style={{ 
                        backgroundColor: 
                          request.request_status === "Pending" ? '#FDC858' :
                          request.request_status === "Approved" ? 'green' :
                          request.request_status === "Disapproved" ? '#b21127' :
                          request.request_status === "Cancelled" ? '#6e6e6e' :
                          request.request_status === "For Approval" ? '#025BAD' : 'inherit', 
                        color: 'white',
                        padding: '5px 5px',
                        borderRadius: '50px',
                        width: '80%', // Adjust as needed
                        margin: 'auto',
                        wordBreak: 'break-word',
                        maxWidth: '120px' // Adjust the width as needed
                      }}>
                        {request.request_status}
                      </div>
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '140px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '150px' }}>
                        <Button variant="contained" style={{ marginRight: '10px' }} onClick={() => handleOpenView(request)}>
                          View
                        </Button>
                        <Button variant="contained" onClick={() => handleOpenEdit(request)}>
                          Edit
                        </Button>
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
              {(selectedRequest.request_status === 'Cancelled' || selectedRequest.request_status === 'Disapproved') && (
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
            <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Approved By"
            type="text"
            fullWidth
            variant="filled"
            defaultValue={selectedRequest.approved_by}
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
              <label>Name of Passenger/s: {selectedRequest.passenger_names}</label>
            </div>
            <div>
              <label>Purpose: {selectedRequest.purpose}</label>
            </div>
            <div>
              <label>Requested by: {selectedRequest.requested_by}</label>
            </div>   
          </DialogContent>
          <DialogActions>
            <Button onClick={generatePDF}>Download PDF</Button>
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
                        {(editRequestStatus === 'Cancelled' || editRequestStatus === 'Disapproved') && (
                          <>
                            <FormLabel>
                              {editRequestStatus === 'Cancelled' ? 'Reason for Cancellation' : 'Reason for Disapproval'}
                            </FormLabel>
                            <Textarea 
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
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Approved by"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedRequest.approved_by}
                        onChange={(event) => setEditApprovedBy(event.target.value)}
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
            <Button onClick={CloseEdit}>Close</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogActions>
        </Dialog>

        </div>
    );
}