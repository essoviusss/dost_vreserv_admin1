import React from 'react';
import './pdf.css'

const GeneratePDF = () => {
  const selectedRequest = {
    // Add the necessary properties from the selectedRequest object
  };

  const passengerNames = Array.isArray(selectedRequest.passenger_names)
    ? selectedRequest.passenger_names.join(", ")
    : selectedRequest.passenger_names || "No passengers";

  return (
    <div className="pdf-container">
      <div className="page-title">
        Republic of the Philippines<br />
        DEPARTMENT OF SCIENCE AND TECHNOLOGY<br />
        Regional Office No. 1<br />
        DMMMSU MLUC Campus, City of San Fernando, La Union
      </div>

      <div className="subtitle">REQUEST FOR THE USE OF VEHICLE</div>

      <div className="content">
        <div className="content-line">
          Vehicle to be requested: {selectedRequest.vehicle_name}
        </div>
        <div className="content-line">
          Name of Driver: {selectedRequest.driver_name}
        </div>
        <div className="content-line">
          Schedule of Travel<br />
          Time of Departure: {selectedRequest.departure_time}<br />
          Time of Return to Garage: {selectedRequest.arrival_time}
        </div>
        <div className="content-line">
          Destination: {selectedRequest.destination}
        </div>
        <div className="content-line">
          Passenger/s: {passengerNames}
        </div>
        <div className="content-line">
          Total No. of Passengers: {selectedRequest.passenger_count}
        </div>
        <div className="content-line">
          Purpose(Attach gate pass if applicable): {selectedRequest.purpose}
        </div>
        <div className="content-line">
          Requested by:<br />
          {selectedRequest.requested_by}<br />
          ___________________________<br />
          Signature Over Printed Name
        </div>
        <div className="content-line">
          Date of Request: {selectedRequest.request_date}
        </div>
      </div>

      <div className="recommendation">
        <div className="recommendation-title">RECOMMENDATION</div>
        <div className="recommendation-content">
          Availability of requested Vehicle and Driver
        </div>
        <div className="checkbox-line">
          <input type="checkbox" id="checkbox1" />
          <label htmlFor="checkbox1">Available</label>
        </div>
        <div className="checkbox-line">
          <input type="checkbox" id="checkbox2" />
          <label htmlFor="checkbox2">Not Available</label>
        </div>
        <div className="checkbox-line">
          <input type="checkbox" id="checkbox3" />
          <label htmlFor="checkbox3">Schedule Maintenance</label>
        </div>
        <div className="checkbox-line">
          <input type="checkbox" id="checkbox4" />
          <label htmlFor="checkbox4">Breakdown</label>
        </div>
        <div className="checkbox-line">
          <input type="checkbox" id="checkbox5" />
          <label htmlFor="checkbox5">Other__________________________</label>
        </div>
        <div className="recommendation-signature">
          {selectedRequest.pm_officer}<br />
          Preventive Maintenance Officer for Vehicles
        </div>
        <div className="recommendation-date">Date: ___________________</div>
        <div className="recommendation-remarks">
          Remarks: _____________________________________
        </div>
      </div>

      <div className="action">
        <div className="action-title">ACTION OF REQUEST</div>
        <div className="checkbox-line">
          <input type="checkbox" id="checkbox6" />
          <label htmlFor="checkbox6">Approved</label>
        </div>
        <div className="checkbox-line">
          <input type="checkbox" id="checkbox7" />
          <label htmlFor="checkbox7">
            Disapproved, Reasons:____________________________________________________________
          </label>
        </div>
        <div className="action-signature">
          {selectedRequest.approved_by}<br />
          OIC, Regional Director
        </div>
        <div className="action-date">Date: ___________________</div>
      </div>
    </div>
  );
};

export default GeneratePDF;
