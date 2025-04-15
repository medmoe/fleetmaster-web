import {Chip, Grid, Paper, Typography} from '@mui/material';
import {VehicleType} from "@/types/types";

interface VehicleInformationPanelProps {
    vehicle: VehicleType | null;
}

const VehicleInformationPanel = ({vehicle}: VehicleInformationPanelProps) => {
    return (
        <Paper elevation={0} variant="outlined" className="p-4 mb-6">
            <Grid container spacing={2}>
                <Grid size={{xs: 12}}>
                    <Typography variant="h6" className="font-medium mb-2">
                        Vehicle Details
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Registration
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                        {vehicle?.registration_number || 'N/A'}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Vehicle
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.make} {vehicle?.model} ({vehicle?.year})
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        VIN
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.vin || 'N/A'}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Type
                    </Typography>
                    <Typography variant="body1" className="capitalize">
                        {vehicle?.type || 'N/A'}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Mileage
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.mileage || 'N/A'} km
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Status
                    </Typography>
                    <Chip
                        label={vehicle?.status || 'N/A'}
                        color={vehicle?.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                    />
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Last Service
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.last_service_date || 'N/A'}
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Next Service Due
                    </Typography>
                    <Typography variant="body1">
                        {vehicle?.next_service_due || 'N/A'}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>

    )
}

export default VehicleInformationPanel;