import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import DashboardLayout from "./layouts/DashboardLayout";
import MaintenanceLayout from "./layouts/MaintenanceLayout";
import {ProtectedRoute} from "./components";
import WebFont from "webfontloader";

const LoginPage = React.lazy(() => import ('./pages/auth/LoginPage'))
const SignUp = React.lazy(() => import ('./pages/auth/SignUp'))
const Dashboard = React.lazy(() => import ('./pages/main/Dashboard'))
const Vehicles = React.lazy(() => import ('./pages/main/vehicle/Vehicles'));
const MaintenanceOverview = React.lazy(() => import ('./pages/main/vehicle/maintenance/MaintenanceOverview'));
const Parts = React.lazy(() => import ('./pages/main/vehicle/maintenance/Parts'));
const PartProviders = React.lazy(() => import ('./pages/main/vehicle/maintenance/PartProviders'));
const ServiceProviders = React.lazy(() => import ('./pages/main/vehicle/maintenance/ServiceProviders'));
const Reports = React.lazy(() => import ('./pages/main/vehicle/maintenance/Reports'));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

WebFont.load({
    google: {
        families: ["Roboto:300,400,500,700&display=swap", "Merriweather:300,400,700", "Open Sans:300,400,600,700"],
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/register" element={<SignUp/>}/>

                    <Route element={<ProtectedRoute/>}>
                        <Route element={<DashboardLayout/>}>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/vehicles" element={<Vehicles/>}/>
                        </Route>
                        <Route element={<MaintenanceLayout/>}>
                            <Route path="/maintenance-overview" element={<MaintenanceOverview/>}/>
                            <Route path="/parts" element={<Parts/>}/>
                            <Route path="/part-providers" element={<PartProviders/>}/>
                            <Route path="/service-providers" element={<ServiceProviders/>}/>
                            <Route path={"/reports"} element={<Reports/>}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
);