import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { jsPDF } from "jspdf";


//material ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


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


  //pdf
  const generatePDF = () => {
    const doc = new jsPDF();
  
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
    
    Passenger/s: ${selectedRequest.passenger_names.join(", ")}
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
    
    const lineSpacingFactor1 = 0.8;
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
  
    const lineSpacingFactor2 = 0.8;

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
    
    // Save the PDF
    doc.save(`${selectedRequest.requested_by}.VRESERV_Request_Report.pdf`);
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
                <Button onClick={generatePDF}>Download PDF</Button>
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