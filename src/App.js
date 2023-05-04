import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import AdmAvailability from './pages/AdmAvailability';
import AdmDashboard from './pages/AdmDashboard';
import AdmNavbar from './pages/AdmNavbar';
import AdmSchedule from './pages/AdmSchedule';
import AdmTravelRequest from './pages/AdmTravelRequest';




function App() {
  return (
    <Router>
      {/* <FormDataProvider> */}
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/AdmAvailability" element={<AdmAvailability />} />
            <Route path="/AdmDashboard" element={<AdmDashboard />} />
            <Route path="/AdmNavbar" element={<AdmNavbar />} />
            <Route path="/AdmSchedule" element={<AdmSchedule />} />
            <Route path="/AdmTravelRequest" element={<AdmTravelRequest />} />

            {/* <Route path="/EmpHome" element={<RoleGuard requiredRole="Employee" />}>
              <Route index element={<EmpHome />} />
            </Route>
            <Route path="/DriverHome" element={<RoleGuard requiredRole="Driver" />}>
              <Route index element={<DriverHome />} />
            </Route> */}


        </Routes>
      {/* </FormDataProvider> */}
    </Router>
    
  );
}

export default App;