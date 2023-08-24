import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FormDataProvider } from './pages/FormDataContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Paths
import Login from './pages/Auth/Login';
import AdmDashboard from './pages/AdmDashboard';
import AdmSchedule from './pages/AdmSchedule';
import AdmVehicleRequest from './pages/AdmVehicleRequest';
import Sidebar from './pages/Sidebar';
import AdmVehicles from './pages/AdmVehicles';
import AdmDrivers from './pages/AdmDrivers';
import AdmEmployee from './pages/AdmEmployee';
import Approved from './pages/AdmComponents/Approved';
import Rejected from './pages/AdmComponents/Rejected';
import AdmOnTravel from './pages/AdmOnTravel';
import GeneratePDF from './utils/pdf';
import AdmGenerate from './pages/AdmGenerate';


function MainContent() {
  const location = useLocation();

  if (location.pathname === '/') {
    return <Login />;
  }

  return (
    <div className="App" style={{ display: 'flex', backgroundColor: '#F4F7FE', minHeight: '100vh' }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div
          className="main-content"
          style={{
            flex: 1,
            overflow: 'auto',
            paddingTop: 75,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 15,
            backgroundColor: '#F4F7FE',
            boxSizing: 'border-box',
            minHeight: '100%',
          }}
        >
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Sidebar" element={<Sidebar />} />
            <Route path="/AdmDashboard" element={<AdmDashboard />} />
            <Route path="/AdmSchedule" element={<AdmSchedule />} />
            <Route path="/AdmVehicleRequest" element={<AdmVehicleRequest />} />
            <Route path="/AdmOnTravel" element={<AdmOnTravel />} />
            <Route path="/AdmVehicles" element={<AdmVehicles />} />
            <Route path="/AdmDrivers" element={<AdmDrivers />} />
            <Route path="/AdmEmployee" element={<AdmEmployee />} />
            <Route path="/Approved" element={<Approved />} />
            <Route path="/Rejected" element={<Rejected />} />
            <Route path="/GeneratePDF" element={<GeneratePDF />} />
            <Route path="/AdmGenerate" element={<AdmGenerate />} />
        </Routes>
      </div>
    </div>
  );
}
function App() {
  return (
    <Router>
      <FormDataProvider>
      <ToastContainer />
        <MainContent />
      </FormDataProvider>
    </Router>
  );
}

export default App;