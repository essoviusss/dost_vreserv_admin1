import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="black">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            VRESERV
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/AdmDashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/AdmVehicleRequest" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Vehicle Requests</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/AdmVehicles" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">Vehicles</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/AdmDrivers" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">Drivers</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/AdmEmployee" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">Employee</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/AdmSchedule" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="exclamation-circle">PMS Schedule</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            Logout
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;