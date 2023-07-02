import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import './Components/AdmVehicleRequest.css'
import styles from './Components/AdmVehicleRequest.css'
import { BASE_URL } from "../constants/api_url";

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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import CustomButton from './StyledComponents/CustomButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import { URL } from "../constants/api_url";


export default function AdmVehicleRequest(){
  //defaultValue
  const [selectedRequest, setSelectedRequest] = useState({});
  const [requests, setRequest] = useState([]);
  const [vehicle, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]); 

  //jwt
  const role = localStorage.getItem("admin_role");

  //update
  const [editVehicleName, setEditVehicleName] = useState("");
  const [editDriverName, setEditDriverName] = useState("");
  const [editRequestStatus, setEditRequestStatus] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editPMOfficer, setEditPMOfficer] = useState("");
  const [editApprovedBy, setEditApprovedBy] = useState("");
  const [editCAOfficer, setEditCAOfficer] = useState("");
  const [editDeparture, setEditDeparture] = useState("");
  const [editArrival, setEditArrival] = useState("");

  const [avVehicle, setAvVehicle] = useState([]);
  const [avDriver, setAvDriver] = useState([]);

  //search
  const [searchQuery, setSearchQuery] = useState('');

  //modal
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openORDApproved, setOpenORDApproved] = React.useState(false);
  const [openORDNotApproved, setOpenORDNotApproved] = React.useState(false);
  const [openManApproved, setOpenManApproved] = useState(false);
  const [openManReject, setOpenManReject] = useState(false);

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
    setEditVehicleName(request.vehicle_name);
    setEditDriverName(request.driver_name);
    setEditPMOfficer(request.pm_officer);
    setEditCAOfficer(request.ca_officer);  
    setEditRequestStatus(request.request_status);
    setEditReason(request.reason);
    setEditDeparture(request.departure_time);
    setEditArrival(request.arrival_time);
    setOpenEdit(true);
  };

  const handleORDApproved = (request) => {
    setSelectedRequest(request);
    setEditApprovedBy(request.approved_by);
    setEditRequestStatus(request.request_status);
    setOpenORDApproved(true);
  }

  const handleORDNotApproved = (request) => {
    setSelectedRequest(request);
    setEditRequestStatus(request.request_status);
    setEditReason(request.reason);
    setOpenORDNotApproved(true);
  }

  const CloseView = () => {
    setOpenView(false);
  };
  
  const CloseEdit = () => {
    setOpenEdit(false);
    setOpenORDApproved(false);
    setOpenORDNotApproved(false);
    setOpenManApproved(false);
    setOpenManReject(false);
  };
  
  const CloseORD = () => {
    setOpenORDApproved(false);
    setOpenORDNotApproved(false);
  };

  //date
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hours = '' + d.getHours(),
        minutes = '' + d.getMinutes(),
        seconds = '' + d.getSeconds();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    if (hours.length < 2) 
        hours = '0' + hours;
    if (minutes.length < 2) 
        minutes = '0' + minutes;
    if (seconds.length < 2) 
        seconds = '0' + seconds;
  
    return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':');
  }
  

  //read available vehicle
useEffect(() => {
  const url = `${URL}/available_vehicle.php`;
  axios
    .get(url)
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
  const url = `${URL}/available_driver.php`;
  axios
    .get(url)
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
        const url = `${BASE_URL}/read_request.php`;

        let formData = new FormData();
        formData.append('admin_role', admin_role);

        const response = await axios.post(url, formData);

        if (Array.isArray(response.data.data)) {
          setRequest(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [requests]);


  //update-edit-details-for-approval-MANAGER
  async function handleUpdate() {
  const url = `${BASE_URL}/edit_vehicleRequest.php`;
  
  let fData = new FormData();
  fData.append("request_id", selectedRequest.request_id);
  fData.append("vehicle_name", editVehicleName);
  fData.append("driver_name", editDriverName);
  fData.append("pm_officer", editPMOfficer);
  fData.append("ca_officer", editCAOfficer); 
  fData.append("request_status", "For Approval");
  fData.append("departure_time", editDeparture);
  fData.append("arrival_time", editArrival);
  fData.append("selected_vehicle_name", selectedRequest.vehicle_name);
  fData.append("selected_driver_name", selectedRequest.driver_name);
  fData.append("selected_PMOfficer", selectedRequest.pm_officer);
  fData.append("selected_CAOfficer", selectedRequest.ca_officer);
  fData.append("selected_departure_time", selectedRequest.departure_time);
  fData.append("selected_arrival_time", selectedRequest.arrival_time);  
  
  const response = await axios.post(url, fData);
  console.log(response.data);
  if (response.data.message === "Success") {
    alert("For Approval");
  } else {
    alert("Ayaw");
  }
  CloseEdit();
}

  //update-edit-details-reject-MANAGER
  async function handleUpdateReject() {
    const url = `${BASE_URL}/edit_vehicleRequest.php`;
    
    let fData = new FormData();
    fData.append("request_id", selectedRequest.request_id);
    fData.append("vehicle_name", editVehicleName);
    fData.append("driver_name", editDriverName);
    fData.append("pm_officer", editPMOfficer);
    fData.append("ca_officer", editCAOfficer);
    fData.append("reason", editReason);
    fData.append("departure_time", editDeparture);
    fData.append("arrival_time", editArrival); 
    fData.append("request_status", "Cancelled");
    fData.append("selected_vehicle_name", selectedRequest.vehicle_name);
    fData.append("selected_driver_name", selectedRequest.driver_name);
    fData.append("selected_PMOfficer", selectedRequest.pm_officer);
    fData.append("selected_CAOfficer", selectedRequest.ca_officer);
    fData.append("selected_departure_time", selectedRequest.departure_time);
    fData.append("selected_arrival_time", selectedRequest.arrival_time); 
    
    const response = await axios.post(url, fData);
    console.log(response.data);
    if (response.data.message === "Success") {
      alert("Cancelled");
    } else {
      alert("Ayaw");
    }
    CloseEdit();
  }
  //update-ORD
  async function handleUpdateORD() {
    const url = `${BASE_URL}/edit_ord_approved.php`;
    
    let fData = new FormData();
    fData.append("request_id", selectedRequest.request_id);
    fData.append("approved_by", editApprovedBy);
    fData.append("request_status", "Approved");

    const response = await axios.post(url, fData);
    if (response.data.message === "Success") {
      alert("Approved");
    } else {
      alert("Madi");
    }
    CloseEdit();
  }

    //update-ORD
    async function handleUpdateORDNotApproved() {
      const url = `${BASE_URL}/edit_ord_disapproved.php`;
      
      let fData = new FormData();
      fData.append("request_id", selectedRequest.request_id);
      fData.append("reason", editReason);
      fData.append("request_status", "Disapproved");
      
      const response = await axios.post(url, fData);
      if (response.data.message === "Success") {
        alert("Disapproved");
      } else {
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

  useEffect(() => {
    const fetchData = async () => {
      try{
        const url = `${URL}/pms_condition.php`;
        let fData = new FormData();
        console.log(editDeparture);
        console.log(editArrival);
        fData.append("selectedDate1", editDeparture);
        fData.append("selectedDate2", editArrival);

        const response = await axios.post(url, fData);
        if(Array.isArray(response.data.data.vehicles)){
          setAvDriver(response.data.data.vehicles);
          setAvVehicle(response.data.data.drivers);
        }

      }catch(e){
        alert(e);
      }
    }
    fetchData();
  },[])

    return(
      <div className="page-container">
        <Header/>
        <div className="rlogs-text">Requests</div>

        {/* --- SEARCH BAR --- */}
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
                    <TableCell style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', wordBreak: 'break-word', maxWidth: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenView(request)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <RemoveRedEyeRoundedIcon />
                      </Button>

                      {/* buttons for manager */}
                      {role === "Manager" && ( 
                      <Button
                        variant="contained"
                        onClick={() => handleOpenEdit(request)}
                        style={{ backgroundColor: '#025BAD' }}
                      >
                        <EditRoundedIcon />
                      </Button>)}

                    {/* buttons for ORD */}
                      {role === "ORD" && (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: '#025BAD' }}
                          onClick={() => handleORDApproved(request)}
                        >
                          /
                        </Button>
                      )}

                      {role === "ORD" && (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: '#025BAD' }}
                          onClick={() => handleORDNotApproved(request)}
                        >
                          X
                        </Button>
                      )}

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

      {/* --- VIEW MODAL --- */}
      <Dialog open={openView} onClose={CloseView} fullWidth maxWidth="md">
      <Button onClick={CloseView} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
        <CloseRoundedIcon />
      </Button>
      <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <div className="div-admreq">
              <div className="div1-admreq">
                <div className="div1-admreq">
                  <img className="summary-logo" src="/images/summary_logo.png"/>
                </div>
              </div>
              <div className="div2-admreq">
                <p className="header-admreq">{selectedRequest.vehicle_name}</p>
                <p className="header-label-admreq">Vehicle to be requested</p>
              </div>
              <div className="div3-admreq">
                <p className="header-admreq">{selectedRequest.driver_name}</p>
                <p className="header-label-admreq">Name of the driver</p>
              </div>
              <div className="status-button-container">
                {selectedRequest && selectedRequest.request_status && (
                  <button className={`status-button ${selectedRequest.request_status.replace(/\s+/g, '')}`}>
                    {selectedRequest.request_status}
                  </button>
                )}
              </div>
              <div className="div5-admreq">
                <hr class="admreq-hr"/>
              </div>
              <div className="div55-admreq">
                <div className="div55table-admreq">
                  <table>
                    <tbody>
                      <tr>
                        <td className="table-label-admreq">
                          <p className="header-label-admreq">Preventive Maintenance Officer:</p>
                        </td>
                        <td>
                          <p className="admreq-details">
                          {selectedRequest.pm_officer}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label-admreq">
                          <p className="header-label-admreq">Chief Administrative Officer:</p>
                        </td>
                        <td>
                        <p className="admreq-details">
                          {selectedRequest.ca_officer}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="div6-admreq">
                <p className="schedlabel-admreq">SCHEDULE OF TRAVEL</p>
              </div>
              <div className="div7-admreq">
                <div className="div7table-admreq">
                  <table>
                    <tbody>
                      <tr>
                        <td className="table-label-admreq">
                          <p className="header-label-admreq">Departure Date and Time:</p>
                        </td>
                        <td>
                          <p className="admreq-details">
                          {selectedRequest.departure_time}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label-admreq">
                          <p className="header-label-admreq">Arrival Date and Time:</p>
                        </td>
                        <td>
                        <p className="admreq-details">
                          {selectedRequest.arrival_time}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label-admreq">
                          <p className="header-label-admreq">Destination:</p>
                        </td>
                        <td>
                        <p className="admreq-details">
                        {selectedRequest.destination}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="div9-admreq">
                <p className="schedlabel-admreq">OTHER DETAILS</p>
              </div>
              <div className="div10-admreq">
              <div className="div10table-admreq">
                <table>
                  <tbody>
                    <tr>
                      <td className="table-label-admreq">
                        <p className="header-label-admreq">Total No. of Passenger/s:</p>
                      </td>
                      <td>
                        <p className="admreq-details">
                          {selectedRequest.passenger_count}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-label-admreq">
                        <p className="header-label-admreq">Name of Passenger/s:</p>
                      </td>
                      <td>
                        <p className="admreq-details">
                          {selectedRequest.passenger_names}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-label-admreq">
                        <p className="header-label-admreq">Purpose:</p>
                      </td>
                      <td>
                      <p className="admreq-details">
                        {selectedRequest.purpose}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-label-admreq">
                        <p className="header-label-admreq">Requested By:</p>
                      </td>
                      <td>
                      <p className="admreq-details">
                      {selectedRequest.requested_by}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
              <div className="div11-admreq">
                <Button onClick={generatePDF} variant="contained" color="primary" style={{ fontFamily: 'Poppins, sans-serif', textTransform: 'none', backgroundColor: '#025BAD' }}>
                  Generate Request Form
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>

      {/* --- EDIT MODAL --- */}
      <Dialog open={openEdit} onClose={CloseEdit} fullWidth maxWidth="sm">
      <DialogTitle className="dialog-title">
        <img className="edit-logo" src="/images/edit_logo.png" />
        <div className="dialog-title-content">
          <h1>Edit Details</h1>
          <p>Update the necessary changes to the request</p>         
        </div>
        <Button onClick={CloseView} style={{ color: 'gray', position: 'absolute', top: 10, right: 0, paddingLeft: 0, paddingRight: 0 }}>
          <CloseRoundedIcon />
        </Button>
      </DialogTitle>
      <hr className="dtitle-hr" /> 
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <div className='edit-fields'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker 
              label="Departure Time"
              value={dayjs(selectedRequest.departure_time)}
              onChange={(date) => {
                const formattedDate = formatDate(date);
                setEditDeparture(formattedDate);
              }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker 
              label="Estimated Time of Arrival"
              value={dayjs(selectedRequest.arrival_time)}
              onChange={(date) => {
                const formattedDate = formatDate(date);
                setEditArrival(formattedDate);
              }}
               />
            </LocalizationProvider>
          </div>
          <div className="edit-fields">
            <FormControl fullWidth variant="standard" margin="dense" style={{ fontFamily: 'Poppins' }}>
              <InputLabel id="vehicle-select-label" style={{ lineHeight: '2' }}>VEHICLE</InputLabel>
              <Select
                labelId="vehicle-select-label"
                id="vehicle-select"
                value={editVehicleName}
                onChange={(event) => setEditVehicleName(event.target.value)}
                style={{ height: '40px', fontFamily: 'Poppins', fontSize: '14px' }}
                MenuProps={{ PaperProps: { style: { maxHeight: '200px' } } }}
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
          <div className="edit-fields">
            <FormControl fullWidth variant="standard" margin="dense" style={{ fontFamily: 'Poppins' }}>
              <InputLabel id="driver-select-label" style={{ lineHeight: '2' }}>DRIVER</InputLabel>
              <Select
                labelId="driver-select-label"
                id="driver-select"
                value={editDriverName}
                onChange={(event) => setEditDriverName(event.target.value)}
                style={{ height: '40px', fontFamily: 'Poppins', fontSize: '14px' }}
                MenuProps={{ PaperProps: { style: { maxHeight: '200px' } } }}
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
          <div className="edit-fields">
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
              InputLabelProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                  color: 'black',
                  fontSize: '120%',
                  fontWeight: '600',
                  textTransform: 'uppercase',
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
          <div className="edit-fields">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="CHIEF ADMINISTRATIVE OFFICER"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={selectedRequest.ca_officer}
              onChange={(event) => setEditCAOfficer(event.target.value)}
              InputLabelProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                  color: 'black',
                  fontSize: '120%',
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
          <div className="edit-tablemain">
            <div className="edit-tabletitle">
              Schedule of Travel
            </div>
            <div>
              <table className="edit-tablecontent">
                <tbody>
                  <tr>
                    <td>Departure Date and Time:</td>
                    <td>{selectedRequest.departure_time}</td>
                  </tr>
                  <tr>
                    <td>Arrival Date and Time:</td>
                    <td>{selectedRequest.arrival_time}</td>
                  </tr>
                  <tr>
                    <td>Destination:</td>
                    <td>{selectedRequest.destination}</td>
                  </tr>
                </tbody>
              </table>
            </div>   
          </div>
          <div className="edit-tablemain">
            <div className="edit-tabletitle">
              Other Details
            </div>
            <div>
              <table className="edit-tablecontent">
                <tbody>
                  <tr>
                    <td>Total No. of Passenger/s:</td>
                    <td>{selectedRequest.passenger_count}</td>
                  </tr>
                  <tr>
                    <td>Name of Passenger/s:</td>
                    <td>{selectedRequest.passenger_names}
                    </td>
                  </tr>
                  <tr>
                    <td>Purpose:</td>
                    <td>{selectedRequest.purpose}</td>
                  </tr>
                  <tr>
                    <td>Requested by:</td>
                    <td>{selectedRequest.requested_by}</td>
                  </tr>
                </tbody>
              </table>
            </div> 
          </div>              
        </DialogContent>
        <DialogActions>
          <Button onClick={CloseEdit} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>Cancel</Button>
          <CustomButton variant="save_button" text="Reject" color="primary" onClick={() => setOpenManReject(true)} />
          <CustomButton variant="save_button" text="Approve" color="primary" onClick={() => setOpenManApproved(true)} />
        </DialogActions>
      </Dialog>

      {/* approved modal by ORD */}
      <Dialog open={openORDApproved} onClose={CloseORD} fullWidth maxWidth="sm">
      <DialogTitle className="dialog-title">
        <img className="edit-logo" src="/images/edit_logo.png" />
        <div className="dialog-title-content">
          <h1>Approved</h1>
          <p>Are you sure you want to approve this request?</p>         
        </div>
      </DialogTitle>
      <hr className="dtitle-hr" /> 
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <div className="edit-fields">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Approved by:"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={selectedRequest.approved_by}
              onChange={(event) => setEditApprovedBy(event.target.value)}
              InputLabelProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                  color: 'black',
                  fontSize: '120%',
                  fontWeight: '600',
                  textTransform: 'uppercase',
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
        </DialogContent>
        <DialogActions>
          <Button onClick={CloseORD} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>Cancel</Button>
          <CustomButton variant="save_button" text="Save" color="primary" onClick={handleUpdateORD} />
        </DialogActions>
      </Dialog>

        {/* disapproved modal by ORD */}
        <Dialog open={openORDNotApproved} onClose={CloseORD} fullWidth maxWidth="sm">
      <DialogTitle className="dialog-title">
        <img className="edit-logo" src="/images/edit_logo.png" />
        <div className="dialog-title-content">
          <h1>Disapproved</h1>
          <p>Are you sure you want to disapprove this request?</p>         
        </div>
      </DialogTitle>
      <hr className="dtitle-hr" /> 
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <div className="edit-fields">
            <FormLabel>
                  Remarks
                </FormLabel>
                <Textarea 
                  minRows={2} 
                  onChange={(event) => setEditReason(event.target.value)}
                />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={CloseORD} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>Cancel</Button>
          <CustomButton variant="save_button" text="Save" color="primary" onClick={handleUpdateORDNotApproved} />
        </DialogActions>
      </Dialog>

      {/* MANAGER Modal (Approved) */}
      <Dialog open={openManApproved} onClose={() => setOpenManApproved(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to perform this action?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenManApproved(false)} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>
            No
          </Button>
          <Button onClick={handleUpdate} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* MANAGER Modal (Reject) */}
      <Dialog open={openManReject} onClose={() => setOpenManReject(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to perform this action?
          </DialogContentText>
          <FormLabel>
                  Remarks
          </FormLabel>
            <Textarea 
              minRows={2} 
              onChange={(event) => setEditReason(event.target.value)}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenManReject(false)} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>
            No
          </Button>
          <Button onClick={handleUpdateReject} style={{ color: '#025BAD', fontFamily: 'Poppins' }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </div>

    
  );
}