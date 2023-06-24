import { useNavigate } from "react-router";
import { useEffect, useState } from 'react';
import useAuth from "../hooks/useAuth";
import Header from "./Header";
import jwtDecode from 'jwt-decode';
import './GlobalCSS/content.css';
import './Components/AdmDashboard.css'
import { BASE_URL } from "../constants/api_url";
import axios from "axios";
import DonutChart from "react-donut-chart";
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from "react-chartjs-2";

export default function AdmDashboard(){
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const isLoggedIn = useAuth();
    const [currentMonth, setCurrentMonth] = useState('');
    const [totalPerMonthReq, setTotalPerMonthReq] = useState([]);
    const [accomplishedReq, setAccomplishedReq] = useState([]);
    const [cancelledReq, setCancelledReq] = useState([]);

    //read status
    const [pendingCount, setPendingCount] = useState(0);
    const [forApprovalCount, setForApprovalCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [accomplishedCount, setAccomplishedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [cancelledCount, setCancelledCount] = useState(0);

    const [vehicleOnPMS, setVehicleOnPMS] = useState(0);
    const [driverOnTravel, setDriverOnTravel] = useState(0);
    const [vehicleOnTravel, setVehicleOnTravel] = useState(0);

    const totalCount = pendingCount + forApprovalCount + approvedCount + accomplishedCount + cancelledCount + rejectedCount;

    const penPercent = (pendingCount / totalCount) * 100;
    const forPercent = (forApprovalCount / totalCount) * 100;
    const appPercent = (approvedCount / totalCount) * 100;
    const accPercent = (accomplishedCount / totalCount) * 100;
    const canPercent = (cancelledCount / totalCount) * 100;
    const rejPercent = (rejectedCount / totalCount) * 100;

    // Ensure that the sum of all percentages is 100%
    const sumPercentages = penPercent + forPercent + appPercent + accPercent + canPercent + rejPercent;
    const adjustmentFactor = 100 / sumPercentages;

    const adjustedPenPercent = penPercent * adjustmentFactor;
    const adjustedForPercent = forPercent * adjustmentFactor;
    const adjustedAppPercent = appPercent * adjustmentFactor;
    const adjustedAccPercent = accPercent * adjustmentFactor;
    const adjustedCanPercent = canPercent * adjustmentFactor;
    const adjustedRejPercent = rejPercent * adjustmentFactor;



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

    useEffect(() =>{
        const fetchData = async () => {
            try{
                const url = `${BASE_URL}/status_count.php`;

                let pendingData = new FormData();
                pendingData.append("status", "Pending");

                let forApprovalData = new FormData();
                forApprovalData.append("status", "For Approval");

                let approvedData = new FormData();
                approvedData.append("status", "Approved");

                let accomplishedData = new FormData();
                accomplishedData.append("status", "Accomplished");

                let onTravelData = new FormData();
                onTravelData.append("status", "Cancelled");

                let onPMSData = new FormData();
                onPMSData.append("status", "Rejected");


                const response1 = await axios.post(url, pendingData);
                setPendingCount(response1.data.totalcount);

                const response2 = await axios.post(url, forApprovalData);
                setForApprovalCount(response2.data.totalcount);

                const response3 = await axios.post(url, approvedData);
                setApprovedCount(response3.data.totalcount);

                const response4 = await axios.post(url, accomplishedData);
                setAccomplishedCount(response4.data.totalcount);

                const response5 = await axios.post(url, onTravelData);
                setCancelledCount(response5.data.totalcount);
                
                const response6 = await axios.post(url, onPMSData);
                setRejectedCount(response6.data.totalcount);

            }catch(e){
                alert(e);
            }
        }
        fetchData();
    },[
        pendingCount, 
        forApprovalCount, 
        approvedCount, 
        accomplishedCount, 
        cancelledCount, 
        rejectedCount
    ])

    useEffect(() => {
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        setCurrentMonth(month);
      }, []);

      useEffect(() => {
        
            setData([
              {
                value: penPercent,
                label: "Pending",
              },
              {
                value: forPercent,
                label: "For Approval",
              },
              {
                value: appPercent,
                label: "Approved",
              },
              {
                value: accPercent,
                label: "Accomplished",
              },
              {
                value: canPercent,
                label: "Cancelled",
              },
              {
                value: rejPercent,
                label: "Rejected",
              },
            ]);
       
      }, [pendingCount, 
        forApprovalCount, 
        approvedCount, 
        accomplishedCount, 
        cancelledCount, 
        rejectedCount
    ]);

      useEffect(() => {
        const fetchData = async () => {
            try{
                const url = `${BASE_URL}/permonth_request.php`;
                
                let fData = new FormData();
                fData.append('status', '');

                let fData1 = new FormData();
                fData1.append('status', 'Accomplished');

                let fData2 = new FormData();
                fData2.append('status', 'Cancelled');

                const response = await axios.post(url, fData);
                const response1 = await axios.post(url, fData1);
                const response2 = await axios.post(url, fData2);


                setTotalPerMonthReq(response.data.total);
                setAccomplishedReq(response1.data.request);
                setCancelledReq(response2.data.request);

            }catch(e){
                alert(e);
            }
        }
        fetchData();
      },[])

      const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'];
      
      ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Total Request',
                data: totalPerMonthReq,
                
                backgroundColor: 'blue',
            },
            {
                label: 'Accomplished Request',
                data: accomplishedReq,
                backgroundColor: 'red',
            },
            {
                label: 'Cancelled Request',
                data: cancelledReq,
                backgroundColor: 'green',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' ,
          },
          title: {
            display: true,
            text: `Current Month ${currentMonth}`,
          },
        },
      };

      useEffect(() => {
        const fetchData = async () => {
            try{
                const url = `${BASE_URL}/driver_vehicle_status.php`;

                const response = await axios.get(url);
                setVehicleOnPMS(response.data.vehicle_count);
                setDriverOnTravel(response.data.driver_count);
                setVehicleOnTravel(response.data.vehicle_count1);


            }catch(e){
                alert(e);
            }
        }   
        fetchData();
      },[vehicleOnPMS, vehicleOnTravel, driverOnTravel])
      
    return(
        <div>
            <Header/>
            <div className="dash-container">
                <h1>AdmDashboard</h1>
                {/* top */}
                <div className="upper">
                    <div className="top1Left">
                        <div className="top1Above">
                            <div className="above-child">Pending {pendingCount}</div>
                            <div className="above-child">For Approval {forApprovalCount}</div>
                            <div className="above-child">Approved {approvedCount}</div>
                        </div>
                        <div className="top1Below">
                            <div className="below-child">Accomplished {accomplishedCount}</div>
                            <div className="below-child">Cancelled {cancelledCount}</div>
                            <div className="below-child">Rejected {rejectedCount}</div>
                        </div>
                    </div>
                    <div className="top2Right">
                        <p>On-Travel Vehicle/s {vehicleOnTravel}</p>
                        <p>On-Travel Driver/s {driverOnTravel}</p>
                        <p>On-PMS Vehicle/s {vehicleOnPMS}</p>
                    </div>
                </div>
                {/* below */}
                <div className="middle">
                    <div className="below1Left">
                        <Bar options={options} data={data1} />
                    </div>
                    <div className="below2Right">
                    <div className="donut-chart-container">
                        <DonutChart
                            data={data}
                            label="Percentage"
                            valueLabel="Value"
                            strokeWidth={100}
                            className="custom-donut-chart"
                            legend={false}
                            colors={['#025BAD', '#D9D9D9', '#FFC300', '#9C27B0', '#00BCD4', '#FF5722']}
                            hoverColors={['#025BAD', '#D9D9D9']}
                        />
                        <div className="donut-icon">
                            <DirectionsCarRoundedIcon style={{ fontSize: 40, color: '#025BAD' }} />
                        </div>
                        </div>
                        <div className="donut-legends">
                        <div className="donut-title">Status Percentage</div>
                        <div className="donut-accomplished">
                            <CircleRoundedIcon style={{ fontSize: 20, color: '#025BAD' }} /> &nbsp;
                            <div className="percentage">{adjustedPenPercent.toFixed(2)}%</div> &nbsp;
                            <div className="per-label">Pending</div>
                            <div className="count-label">({pendingCount} Request/s)</div>
                        </div>
                        <div className="donut-unaccomplished">
                        <CircleRoundedIcon style={{ fontSize: 20, color: '#D9D9D9' }} />  &nbsp;
                            <div className="percentage">{adjustedForPercent.toFixed(2)}%</div> &nbsp;
                            <div className="per-label">For Approval</div>
                            <div className="count-label">({forApprovalCount} Request/s)</div>
                        </div>
                        <div className="donut-accomplished">
                            <CircleRoundedIcon style={{ fontSize: 20, color: '#FFC300' }} /> &nbsp;
                            <div className="percentage">{adjustedAppPercent.toFixed(2)}%</div> &nbsp;
                            <div className="per-label">Approved</div>
                            <div className="count-label">({approvedCount} Request/s)</div>
                        </div>
                        <div className="donut-unaccomplished">
                        <CircleRoundedIcon style={{ fontSize: 20, color: '#9C27B0' }} />  &nbsp;
                            <div className="percentage">{adjustedAccPercent.toFixed(2)}%</div> &nbsp;
                            <div className="per-label">Accomplished</div>
                            <div className="count-label">({accomplishedCount} Request/s)</div>
                        </div>
                        <div className="donut-accomplished">
                            <CircleRoundedIcon style={{ fontSize: 20, color: '#00BCD4' }} /> &nbsp;
                            <div className="percentage">{adjustedCanPercent.toFixed(2)}%</div> &nbsp;
                            <div className="per-label">Cancelled</div>
                            <div className="count-label">({cancelledCount} Request/s)</div>
                        </div>
                        <div className="donut-unaccomplished">
                        <CircleRoundedIcon style={{ fontSize: 20, color: '#FF5722' }} />  &nbsp;
                            <div className="percentage">{adjustedRejPercent.toFixed(2)}%</div> &nbsp;
                            <div className="per-label">Rejected</div>
                            <div className="count-label">({rejectedCount} Request/s)</div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

