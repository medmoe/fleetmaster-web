import React from 'react';
import {Avatar, Box, Card, CardContent, Chip, Divider, IconButton, Tooltip, Typography} from '@mui/material';
import {
    AirlineSeatReclineNormal as CapacityIcon,
    CalendarMonth as CalendarIcon,
    Delete as DeleteIcon,
    DriveEta as VehicleIcon,
    Edit as EditIcon,
    EventAvailable as ServiceIcon,
    Handyman as MaintenanceIcon,
    Speed as SpeedIcon
} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';
import {VehicleType} from "@/types/types";

interface VehicleCardProps {
    vehicle: VehicleType;
    handleMaintenance: () => void;
    handleVehicleEdition: () => void;
    handleVehicleDeletion: () => void;
}

const VehicleCardComponent: React.FC<VehicleCardProps> = ({
                                                              vehicle,
                                                              handleMaintenance,
                                                              handleVehicleEdition,
                                                              handleVehicleDeletion
                                                          }) => {
    const {t} = useTranslation();

    // Map status to MUI color
    const getStatusColor = () => {
        if (vehicle.status === 'ACTIVE') return 'success';
        if (vehicle.status === 'IN_MAINTENANCE') return 'warning';
        if (vehicle.status === 'OUT_OF_SERVICE') return 'error';
        return 'default';
    };

    return (
        <Card
            sx={{
                mb: 3,
                boxShadow: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)'
                }
            }}
        >
            {/* Card Header with Vehicle Icon and Status */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                    color: 'white'
                }}
            >
                <Avatar
                    sx={{width: 64, height: 64, border: '2px solid white', bgcolor: 'primary.dark'}}
                >
                    <VehicleIcon sx={{fontSize: 32}}/>
                </Avatar>

                <Box sx={{ml: 2, flexGrow: 1}}>
                    <Typography variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
                        {`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                    </Typography>
                    <Chip
                        label={vehicle.status.toLowerCase().replace('_', ' ')}
                        size="small"
                        color={getStatusColor()}
                        sx={{mt: 1}}
                    />
                </Box>

                {/* Action Buttons */}
                <Box>
                    <Tooltip title={t('common.edit')}>
                        <IconButton onClick={handleVehicleEdition} color="inherit" data-testid={"edit-vehicle-button"}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                        <IconButton onClick={handleVehicleDeletion} color="inherit" data-testid={"delete-vehicle-button"}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('pages.vehicle.card.maintenance')}>
                        <IconButton onClick={handleMaintenance} color="inherit" data-testid={"maintenance-vehicle-button"}>
                            <MaintenanceIcon/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <CardContent>
                {/* Vehicle Information */}
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, mb: 2}}>
                    <Box sx={{flex: 1, mb: {xs: 2, sm: 0}}}>
                        <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1}}>
                            {t('pages.vehicle.card.generalInfo')}
                        </Typography>

                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                            <CalendarIcon fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                            <Typography variant="body2">
                                {t('pages.vehicle.card.purchaseDate')}: {vehicle.purchase_date}
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                            <CapacityIcon fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                            <Typography variant="body2">
                                {t('pages.vehicle.card.capacity')}: {vehicle.capacity}
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                            <SpeedIcon fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                            <Typography variant="body2">
                                {t('pages.vehicle.card.mileage')}: {vehicle.mileage}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Maintenance Information */}
                    <Box sx={{flex: 1}}>
                        <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1}}>
                            {t('pages.vehicle.card.maintenanceInfo')}
                        </Typography>

                        {vehicle.next_service_due && (
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                <ServiceIcon fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                                <Typography variant="body2">
                                    {t('pages.vehicle.card.nextServiceDue')}: {vehicle.next_service_due}
                                </Typography>
                            </Box>
                        )}

                        {vehicle.last_service_date && (
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                <MaintenanceIcon fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                                <Typography variant="body2">
                                    {t('pages.vehicle.card.lastServiceDate')}: {vehicle.last_service_date}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Documentation Information */}
                {(vehicle.license_expiry_date || vehicle.insurance_expiry_date) && (
                    <>
                        <Divider sx={{my: 2}}/>
                        <Box>
                            <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1}}>
                                {t('pages.vehicle.card.documentation')}
                            </Typography>

                            {vehicle.license_expiry_date && (
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <CalendarIcon fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                                    <Typography variant="body2">
                                        {t('pages.vehicle.card.licenseExpiry')}: {vehicle.license_expiry_date}
                                    </Typography>
                                </Box>
                            )}

                            {vehicle.insurance_expiry_date && (
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <CalendarIcon fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                                    <Typography variant="body2">
                                        {t('pages.vehicle.card.insuranceExpiry')}: {vehicle.insurance_expiry_date}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </>
                )}

                {/* Notes Section */}
                {vehicle.notes && (
                    <>
                        <Divider sx={{my: 2}}/>
                        <Box>
                            <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1}}>
                                {t('pages.vehicle.card.notes')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {vehicle.notes}
                            </Typography>
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default VehicleCardComponent;