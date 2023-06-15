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

export default function AdmDashboard(){
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const isLoggedIn = useAuth();
    const [currentMonth, setCurrentMonth] = useState('');

    //read status
    const [pendingCount, setPendingCount] = useState(0);
    const [forApprovalCount, setForApprovalCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [accomplishedCount, setAccomplishedCount] = useState(0);
    const [onTravelCount, setOnTravelCount] = useState(0);
    const [onPMSCount, setOnPMSCount] = useState(0);
    const [totalRequestCount, setTotalRequestCount] = useState(0);

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
                onTravelData.append("status", "On-Travel");

                let onPMSData = new FormData();
                onPMSData.append("status", "On-PMS");


                const response1 = await axios.post(url, pendingData);
                setPendingCount(response1.data.totalcount);

                const response2 = await axios.post(url, forApprovalData);
                setForApprovalCount(response2.data.totalcount);

                const response3 = await axios.post(url, approvedData);
                setApprovedCount(response3.data.totalcount);

                const response4 = await axios.post(url, accomplishedData);
                setAccomplishedCount(response4.data.totalcount);

                const response5 = await axios.post(url, onTravelData);
                setOnTravelCount(response5.data.totalcount);
                
                const response6 = await axios.post(url, onPMSData);
                setOnPMSCount(response6.data.totalcount);

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
        onPMSCount, 
        onTravelCount
    ])

    useEffect(() => {
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        setCurrentMonth(month);
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const url = `http://localhost/vreserv_api/accomplished_request.php`;
            const userId = localStorage.getItem("userId");
            let fData = new FormData();
            fData.append("user_id", userId);
    
            const response = await axios.post(url, fData);
            const { data } = response.data;
            setData([
              {
                value: data.accomplished_percentage,
                label: "Accomplished",
              },
              {
                value: data.not_accomplished_percentage,
                label: "Not Accomplished",
              },
            ]);
          } catch (e) {
            alert(e);
          }
        };
    
        fetchData();
      }, []);

    return(
        <div>
            <Header/>
            <div className="dash-container">
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
                            <div className="below-child">On-Travel {onTravelCount}</div>
                            <div className="below-child">On-PMS {onPMSCount}</div>
                        </div>
                    </div>
                    <div className="top2Right">
                        <p>Total Request {totalRequestCount}</p>
                        
                    </div>
                </div>
                {/* below */}
                <div className="middle">
                    <div className="below1Left">
                        <p>Current Month: {currentMonth}</p> 
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
                            colors={['#025BAD', '#D9D9D9']}
                            hoverColors={['#025BAD', '#D9D9D9']}
                        />
                        <div className="donut-icon">
                            <DirectionsCarRoundedIcon style={{ fontSize: 40, color: '#025BAD' }} />
                        </div>
                        </div>
                        <div className="donut-legends">
                        <div className="donut-title">Scheduled Travels</div>
                        <div className="donut-accomplished">
                            <CircleRoundedIcon style={{ fontSize: 20, color: '#025BAD' }} /> &nbsp;
                            <div className="percentage">25%</div> &nbsp;
                            <div className="per-label">Accomplished</div>
                            <div className="count-label">(31 Travels)</div>
                        </div>
                        <div className="donut-unaccomplished">
                        <CircleRoundedIcon style={{ fontSize: 20, color: '#D9D9D9' }} />  &nbsp;
                            <div className="percentage">50%</div> &nbsp;
                            <div className="per-label">Unccomplished</div>
                            <div className="count-label">(15 Travels)</div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

