import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FormDataProvider } from './pages/FormDataContext';

import Login from './pages/Auth/Login';
import AdmDashboard from './pages/AdmDashboard';
import AdmSchedule from './pages/AdmSchedule';
import AdmVehicleRequest from './pages/AdmVehicleRequest';
import Sidebar from './pages/Sidebar';
import AdmVehicles from './pages/AdmVehicles';
import AdmDrivers from './pages/AdmDrivers';
import AdmEmployee from './pages/AdmEmployee';


function MainContent() {
  const location = useLocation();

  if (location.pathname === '/') {
    return <Login />;
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content" style={{ flex: 1 }}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Sidebar" element={<Sidebar />} />
                <Route path="/AdmDashboard" element={<AdmDashboard />} />
                <Route path="/AdmSchedule" element={<AdmSchedule />} />
                <Route path="/AdmVehicleRequest" element={<AdmVehicleRequest />} />
                <Route path="/AdmVehicles" element={<AdmVehicles />} />
                <Route path="/AdmDrivers" element={<AdmDrivers />} />
                <Route path="/AdmEmployee" element={<AdmEmployee />} />
            </Routes>
      </div>
    </div>
  );
}
function App() {
  return (
    <Router>
      <FormDataProvider>
        <MainContent />
      </FormDataProvider>
    </Router>
  );
}

export default App;