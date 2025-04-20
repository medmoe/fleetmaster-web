import React, {useState} from 'react';
import {useMediaQuery} from '@mui/material';
import {
    Assessment as AssessmentIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon,
    ExitToApp as ExitIcon,
    LocalShipping as ShippingIcon,
    Menu as MenuIcon,
    Settings as SettingsIcon,
    Dashboard as DashboardIcon,
} from '@mui/icons-material';
import {NavigationItem} from "../components";
import {Outlet} from "react-router-dom";
import {useTranslation} from "react-i18next";

const MaintenanceLayout: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const {t} = useTranslation();
    return (
        <div className={"flex min-h-screen bg-gray-50"}>
            {isMobile && (
                <button onClick={toggleSidebar} className={"fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"}>
                    {sidebarOpen ? <CloseIcon/> : <MenuIcon/>}
                </button>
            )}
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0`}>
                <div className="p-6">
                    <h1 className="text-2xl font-merriweather-bold text-primary-500">{t('layout.maintenance.title')}</h1>
                </div>

                <nav className="mt-4 px-2 space-y-2">
                    <NavigationItem to={"/maintenance-overview"} icon={<DashboardIcon />} label={t('layout.maintenance.overview')}/>
                    <NavigationItem to="/parts" icon={<SettingsIcon />} label={t('layout.maintenance.parts')}/>
                    <NavigationItem to="/part-providers" icon={<ShippingIcon />} label={t('layout.maintenance.partProviders')}/>
                    <NavigationItem to="/service-providers" icon={<EngineeringIcon />} label={t('layout.maintenance.serviceProviders')}/>
                    <NavigationItem to="/reports" icon={<AssessmentIcon />} label={t('layout.maintenance.reports')}/>
                    <NavigationItem to="/vehicles" icon={<ExitIcon />} label={t('layout.maintenance.exit')}/>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)}/>
            )}
        </div>
    );
};

export default MaintenanceLayout;