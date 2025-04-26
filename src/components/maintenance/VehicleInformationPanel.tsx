import {Chip, Grid, Paper, Typography} from '@mui/material';
import {VehicleType} from "@/types/types";
import {useTranslation} from "react-i18next";

interface VehicleInformationPanelProps {
    vehicle: VehicleType | null;
}

const VehicleInformationPanel = ({vehicle}: VehicleInformationPanelProps) => {
    const {t} = useTranslation();
    const vehicleType = vehicle ? t(`pages.vehicle.dialog.type.types.${vehicle.type}`) : "N/A"
    return (
        <Paper elevation={0} variant="outlined" className="p-4 mb-6">
            <Grid container spacing={2}>
                <Grid size={{xs: 12}}>
                    <Typography variant="h6" className="font-medium mb-2">
                        {t('pages.vehicle.maintenance.overview.vehiclePanel.title')}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.vehiclePanel.registration')}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                        {vehicle?.registration_number || t('pages.vehicle.maintenance.overview.vehiclePanel.notAvailable')}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.vehiclePanel.vehicle')}
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.make} {vehicle?.model} ({vehicle?.year})
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.vehiclePanel.vin')}
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.vin || t('pages.vehicle.maintenance.overview.vehiclePanel.notAvailable')}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.vehiclePanel.type')}
                    </Typography>
                    <Typography variant="body1" className="capitalize">
                        {vehicleType}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.vehiclePanel.mileage')}
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.mileage || t('pages.vehicle.maintenance.overview.vehiclePanel.notAvailable')} {t('pages.vehicle.maintenance.overview.vehiclePanel.km')}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.vehiclePanel.status')}
                    </Typography>
                    <Chip
                        label={vehicle?.status || t('pages.vehicle.maintenance.overview.vehiclePanel.notAvailable')}
                        color={vehicle?.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                    />
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.vehiclePanel.lastService')}
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.last_service_date || t('pages.vehicle.maintenance.overview.vehiclePanel.notAvailable')}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('pages.vehicle.maintenance.overview.vehiclePanel.nextServiceDue')}
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.next_service_due || t('pages.vehicle.maintenance.overview.vehiclePanel.notAvailable')}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>

    )
}

export default VehicleInformationPanel;