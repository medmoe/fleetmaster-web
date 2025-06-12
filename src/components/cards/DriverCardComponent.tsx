import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';
import ContactPhone from '@mui/icons-material/ContactPhone';
import DateRange from '@mui/icons-material/DateRange';
import Delete from '@mui/icons-material/Delete';
import DriveEta from '@mui/icons-material/DriveEta';
import Edit from '@mui/icons-material/Edit';
import Email from '@mui/icons-material/Email';
import Key from '@mui/icons-material/Key';
import LocationOn from '@mui/icons-material/LocationOn';
import Phone from '@mui/icons-material/Phone';
import Refresh from '@mui/icons-material/Refresh';

import {format} from 'date-fns';
import {useTranslation} from 'react-i18next';
import {DriverType} from '@/types/types.ts';

interface DriverCardProps {
    driver: DriverType;
    onEdit?: (driver: DriverType) => void;
    onDelete?: (driver: DriverType) => void;
    refreshAccessCode: (driverId?: string) => void;
}

const DriverCardComponent: React.FC<DriverCardProps> = ({driver, onEdit, onDelete, refreshAccessCode}) => {
    const {t} = useTranslation();
    const theme = useTheme();

    // Format dates if they exist
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    // Calculate license expiry status
    const getLicenseStatus = () => {
        if (!driver.license_expiry_date) return null;

        const expiryDate = new Date(driver.license_expiry_date);
        const today = new Date();
        const monthsRemaining = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));

        if (monthsRemaining < 0) {
            return {label: t('pages.driver.card.licenseStatus.expired'), color: 'error'};
        } else if (monthsRemaining < 3) {
            return {label: t('pages.driver.card.licenseStatus.expiringSoon'), color: 'warning'};
        } else {
            return {label: t('pages.driver.card.licenseStatus.valid'), color: 'success'};
        }
    };

    const licenseStatus = getLicenseStatus();

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
            {/* Card Header with Avatar and Status */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    background: `linear-gradient(45deg, ${theme.palette.custom.primary[700]} 30%, ${theme.palette.custom.primary[500]} 90%)`,
                    color: 'white'
                }}
            >
                <Avatar
                    src={driver.profile_picture}
                    alt={`${driver.first_name} ${driver.last_name}`}
                    sx={{width: 64, height: 64, border: `2px solid ${theme.palette.custom.primary[200]}`, bgcolor: theme.palette.custom.primary[800]}}
                >
                    {driver.first_name[0]}{driver.last_name[0]}
                </Avatar>

                <Box sx={{ml: 2, flexGrow: 1}}>
                    <Typography variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
                        {driver.first_name} {driver.last_name}
                    </Typography>
                    <Chip
                        label={driver.employment_status}
                        size="small"
                        color={driver.employment_status === 'ACTIVE' ? 'success' :
                            driver.employment_status === 'ON_LEAVE' ? 'warning' : 'error'}
                        sx={{mr: 1, mt: 1}}
                    />
                    {licenseStatus && (
                        <Chip
                            label={licenseStatus.label}
                            size="small"
                            color={licenseStatus.color as any}
                            sx={{mt: 1}}
                        />
                    )}
                </Box>

                {/* Action Buttons */}
                <Box>
                    {onEdit && (
                        <Tooltip title={t('common.edit')}>
                            <IconButton onClick={() => onEdit(driver)} color="inherit">
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {onDelete && (
                        <Tooltip title={t('common.delete')}>
                            <IconButton onClick={() => onDelete(driver)} color="inherit">
                                <Delete/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>

            <CardContent>
                {/* Contact Information */}
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, mb: 2}}>
                    <Box sx={{flex: 1, mb: {xs: 2, sm: 0}}}>
                        <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1}}>
                            {t('pages.driver.card.contactInfo')}
                        </Typography>

                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                            <Phone fontSize="small" sx={{mr: 1, color: '#3847a3'}}/>
                            <Typography variant="body2">{driver.phone_number}</Typography>
                        </Box>

                        {driver.email && (
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                <Email fontSize="small" sx={{mr: 1, color: '#3847a3'}}/>
                                <Typography variant="body2">{driver.email}</Typography>
                            </Box>
                        )}

                        {driver.address && (
                            <Box sx={{display: 'flex', alignItems: 'flex-start', mb: 1}}>
                                <LocationOn fontSize="small" sx={{mr: 1, mt: 0.5, color: '#3847a3'}}/>
                                <Typography variant="body2">
                                    {driver.address}
                                    {driver.city && `, ${driver.city}`}
                                    {driver.state && `, ${driver.state}`}
                                    {driver.zip_code && ` ${driver.zip_code}`}
                                    {driver.country && `, ${driver.country}`}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Driver Details */}
                    <Box sx={{flex: 1}}>
                        <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1}}>
                            {t('pages.driver.card.drivingInfo')}
                        </Typography>

                        {driver.license_number && (
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                <DriveEta fontSize="small" sx={{mr: 1, color: '#3847a3'}}/>
                                <Typography variant="body2">
                                    {t('pages.driver.card.license')}: {driver.license_number}
                                </Typography>
                            </Box>
                        )}

                        {driver.license_expiry_date && (
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                <DateRange fontSize="small" sx={{mr: 1, color: '#3847a3'}}/>
                                <Typography variant="body2">
                                    {t('pages.driver.card.licenseExpiry')}: {formatDate(driver.license_expiry_date)}
                                </Typography>
                            </Box>
                        )}
                        {driver.date_of_birth && (
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                <DateRange fontSize="small" sx={{mr: 1, color: '#3847a3'}}/>
                                <Typography variant="body2">
                                    {t('pages.driver.card.dob')}: {formatDate(driver.date_of_birth)}
                                </Typography>
                            </Box>
                        )}

                        {driver.hire_date && (
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                <DateRange fontSize="small" sx={{mr: 1, color: '#3847a3'}}/>
                                <Typography variant="body2">
                                    {t('pages.driver.card.hireDate')}: {formatDate(driver.hire_date)}
                                </Typography>
                            </Box>
                        )}
                        {driver.vehicle && (
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                <DriveEta fontSize={"small"} sx={{mr: 1, color: '#3847a3'}}/>
                                <Typography variant={"body2"}>
                                    {t('pages.driver.card.assignedVehicle')}: {driver.vehicle_details?.make} {driver.vehicle_details?.model} {driver.vehicle_details?.year}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Emergency Contact Information */}
                {(driver.emergency_contact_name || driver.emergency_contact_phone) && (
                    <>
                        <Divider sx={{my: 2, bgcolor: "#e3e6f7"}}/>
                        <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, mb: 2}}>
                            <Box sx={{flex: 1, mb: {xs: 2, sm: 0}}}>
                                <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1, color: '#20276d'}}>
                                    {t('pages.driver.card.emergencyContact')}
                                </Typography>

                                {driver.emergency_contact_name && (
                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                        <ContactPhone fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                                        <Typography variant="body2">
                                            {driver.emergency_contact_name}
                                        </Typography>
                                    </Box>
                                )}

                                {driver.emergency_contact_phone && (
                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                        <Phone fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                                        <Typography variant="body2">
                                            {driver.emergency_contact_phone}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{flex: 1}}>
                                <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1, color: '#20276d'}}>{t('pages.driver.card.driverPortal.title')}</Typography>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <Key fontSize="small" sx={{mr: 1, color: 'primary.main'}}/>
                                    <Typography variant={"body2"}>{t('pages.driver.card.driverPortal.accessCode')}: {driver.access_code? driver.access_code : 'N/A'}</Typography>
                                    <IconButton onClick={() => refreshAccessCode(driver.id)} color="primary" sx={{ml: 1}}>
                                        <Refresh/>
                                    </IconButton>
                                </Box>

                            </Box>
                        </Box>
                    </>
                )}

                {/* Notes Section */}
                {driver.notes && (
                    <>
                        <Divider sx={{my: 2, bgcolor: "#e3e6f7"}}/>
                        <Box>
                            <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1, color: '#20276d'}}>
                                {t('pages.driver.card.notes')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {driver.notes}
                            </Typography>
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default DriverCardComponent;