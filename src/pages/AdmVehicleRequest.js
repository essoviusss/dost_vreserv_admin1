import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import Header from "./Header";

export default function AdmVehicleRequest(){
    const [requestData, setRequestData] = useState([]);

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
                            <td><span><Button>View</Button></span></td>
                        </tr>
                        <tr>
                            <td><span><Button>Accept</Button></span></td>
                        </tr>
                        <tr>
                            <td><span><Button>Reject</Button></span></td>
                        </tr>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      );
}