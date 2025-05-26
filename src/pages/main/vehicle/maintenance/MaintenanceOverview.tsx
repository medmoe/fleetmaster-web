// src/pages/MaintenanceOverview.tsx
import React, {useEffect, useState} from 'react';
import {Container, Paper, Typography} from '@mui/material';
import useGeneralDataStore from "../../../../store/useGeneralDataStore";
import {useTranslation} from "react-i18next";
import {NotificationBar, VehicleInformationPanel, VehicleMaintenanceOverview} from "@/components";
import {VehicleMaintenanceDataType} from "@/types/maintenance.ts";
import {API} from '@/constants/endpoints';
import axios from 'axios';

const MaintenanceOverview: React.FC = () => {
    const {t} = useTranslation();
    const {vehicle, snackbar, setSnackbar} = useGeneralDataStore();
    const [vehicleMaintenanceData, setVehicleMaintenanceData] = useState<VehicleMaintenanceDataType>([]);
    const [loading, setLoading] = useState(false);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const options = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
                const response = await axios.get(`${API}maintenance/${vehicle?.id}/overview/`, options);
                setVehicleMaintenanceData(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    return (
        <Container maxWidth="lg" className="py-8">
            <Paper className="p-6 mb-6">
                <Typography variant="h4" component="h1" className="font-bold mb-6">{t('pages.vehicle.maintenance.overview.title')}</Typography>
                <VehicleInformationPanel vehicle={vehicle}/>
                <VehicleMaintenanceOverview data={vehicleMaintenanceData}/>
            </Paper>
            <NotificationBar snackbar={snackbar} setSnackbar={setSnackbar}/>
        </Container>
    );
};

export default MaintenanceOverview;