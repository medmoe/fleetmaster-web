// src/components/layout/DashboardLayout.tsx
import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {
    BarChart as ReportsIcon,
    Build as MaintenanceIcon,
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    DirectionsCar as VehiclesIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Person as DriversIcon,
} from '@mui/icons-material';
import {useMediaQuery} from '@mui/material';
import {NavigationItem} from "../components";
import LogoutButton from "../pages/auth/Logout.tsx";

const DashboardLayout: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile sidebar toggle */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"
                >
                    {sidebarOpen ? <CloseIcon/> : <MenuIcon/>}
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0`}>
                <div className="p-6">
                    <h1 className="text-2xl font-merriweather-bold text-primary-500">Fleet Master</h1>
                </div>

                <nav className="mt-4 px-2 space-y-2">
                    <NavigationItem to="/dashboard" icon={<DashboardIcon/>} label="Dashboard"/>
                    <NavigationItem to="/vehicles" icon={<VehiclesIcon/>} label="Vehicles"/>
                    <NavigationItem to="/drivers" icon={<DriversIcon/>} label="Drivers"/>
                    <NavigationItem to="/maintenance" icon={<MaintenanceIcon/>} label="Maintenance"/>
                    <NavigationItem to="/reports" icon={<ReportsIcon/>} label="Reports"/>
                    <div className={"border-t border-gray-200 my-4"}></div>
                    <LogoutButton icon={<LogoutIcon/>} label="Logout"/>
                </nav>
            </div>

            {/* Main content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
                <main className="p-6">
                    <Outlet/>
                </main>
            </div>

            {/* Overlay for mobile */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;