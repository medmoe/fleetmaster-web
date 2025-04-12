import React, {useState} from 'react';
import {Avatar, Box, Card, CardActions, CardContent, Chip, Collapse, Divider, Grid, IconButton, Stack, Tooltip, Typography} from '@mui/material';
import {
    AttachMoney as MoneyIcon,
    Build as BuildIcon,
    CalendarMonth as CalendarIcon,
    Delete as DeleteIcon,
    Description as DescriptionIcon,
    DirectionsCar as CarIcon,
    Edit as EditIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Speed as MileageIcon,
    Store as StoreIcon
} from '@mui/icons-material';
import {format, parseISO} from 'date-fns';
import {MaintenanceReportType, PartPurchaseEventType, ServiceProviderEventType} from "../../types/maintenance.ts";

interface MaintenanceReportCardProps {
    report: MaintenanceReportType;
    onEdit?: (report: MaintenanceReportType) => void;
    onDelete?: (report: MaintenanceReportType) => void;
}

const MaintenanceReportCard: React.FC<MaintenanceReportCardProps> = ({
                                                                         report,
                                                                         onEdit,
                                                                         onDelete
                                                                     }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Format dates nicely
    const startDate = report.start_date ? format(parseISO(report.start_date), 'MMM d, yyyy') : 'N/A';
    const endDate = report.end_date ? format(parseISO(report.end_date), 'MMM d, yyyy') : 'N/A';

    // Determine maintenance type color
    const typeColor = report.maintenance_type === 'PREVENTIVE' ? 'success' : 'error';

    // Calculate total parts cost
    const partsCost = report.part_purchase_events?.reduce((total: number, event: PartPurchaseEventType) => {
        return total + (parseFloat(event.cost || '0') || 0);
    }, 0);

    // Calculate total service cost
    const serviceCost = report.service_provider_events?.reduce((total: number, event: ServiceProviderEventType) => {
        return total + (parseFloat(event.cost || '0') || 0);
    }, 0);

    return (
        <Card
            sx={{
                mb: 2,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)'
                }
            }}
        >
            {/* Card Header with Vehicle and Maintenance Type */}
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Avatar
                        sx={{
                            bgcolor: report.vehicle_details?.color || 'primary.main',
                            width: 40,
                            height: 40
                        }}
                    >
                        <CarIcon/>
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="div">
                            {report.vehicle_details?.make || 'Unknown'} {report.vehicle_details?.model || 'Vehicle'}
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    icon={<BuildIcon fontSize="small"/>}
                    label={report.maintenance_type}
                    color={typeColor}
                    size="small"
                />
            </Box>

            {/* Main Card Content */}
            <CardContent sx={{pt: 2}}>
                <Grid container spacing={2}>
                    {/* Date Information */}
                    <Grid sx={{width: {xs: '100%', sm: '50%'}}}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                            <CalendarIcon color="action" sx={{mr: 1, fontSize: 20}}/>
                            <Typography variant="body2">
                                <strong>Period:</strong> {startDate} to {endDate}
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <MileageIcon color="action" sx={{mr: 1, fontSize: 20}}/>
                            <Typography variant="body2">
                                <strong>Mileage:</strong> {report.mileage || 'Not recorded'}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Cost Information */}
                    <Grid sx={{width: {xs: '100%', sm: '50%'}}}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                            <MoneyIcon color="action" sx={{mr: 1, fontSize: 20}}/>
                            <Typography variant="body2">
                                <strong>Total Cost:</strong> ${report.total_cost || 'N/A'}
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <StoreIcon color="action" sx={{mr: 1, fontSize: 20}}/>
                            <Typography variant="body2">
                                <strong>Providers:</strong> {report.service_provider_events?.length || 0}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Description Summary (Truncated) */}
                {report.description && (
                    <Box sx={{mt: 2, display: 'flex', alignItems: 'flex-start'}}>
                        <DescriptionIcon color="action" sx={{mr: 1, mt: 0.5, fontSize: 20}}/>
                        <Typography variant="body2" color="text.secondary" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: expanded ? 'unset' : 2,
                            WebkitBoxOrient: 'vertical',
                        }}>
                            {report.description}
                        </Typography>
                    </Box>
                )}
            </CardContent>

            {/* Card Actions */}
            <CardActions disableSpacing sx={{px: 2, pt: 0, pb: 1, justifyContent: 'space-between'}}>
                <Box>
                    {onEdit && (
                        <Tooltip title="Edit Report">
                            <IconButton onClick={() => onEdit(report)} size="small">
                                <EditIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {onDelete && (
                        <Tooltip title="Delete Report">
                            <IconButton onClick={() => onDelete(report)} size="small" color="error">
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                <Tooltip title={expanded ? "Show Less" : "Show More"}>
                    <IconButton
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        size="small"
                    >
                        {expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                    </IconButton>
                </Tooltip>
            </CardActions>

            {/* Expandable Section */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Divider sx={{mx: 2}}/>
                <CardContent>
                    {/* Parts Section */}
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                        Parts Used ({report.part_purchase_events?.length || 0})
                    </Typography>

                    {report.part_purchase_events && report.part_purchase_events.length > 0 ? (
                        <Box sx={{mb: 3}}>
                            <Grid container spacing={1}>
                                {report.part_purchase_events.map((part: PartPurchaseEventType, index: number) => (
                                    <Grid key={index}
                                          sx={{
                                              width: {
                                                  xs: '100%',
                                                  sm: '50%'
                                              }
                                          }}
                                    >
                                        <Card variant="outlined" sx={{p: 1}}>
                                            <Typography variant="body2">
                                                <strong>{part.part_details?.name || 'Unnamed Part'}</strong>
                                            </Typography>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" color="text.secondary">
                                                    Qty: 1
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ${part.cost || 'N/A'}
                                                </Typography>
                                            </Stack>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{mt: 1, textAlign: 'right'}}>
                                <Typography variant="body2">
                                    Parts Total: ${partsCost.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                            No parts used in this maintenance.
                        </Typography>
                    )}

                    {/* Service Providers Section */}
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                        Service Providers ({report.service_provider_events?.length || 0})
                    </Typography>

                    {report.service_provider_events && report.service_provider_events.length > 0 ? (
                        <Box>
                            <Grid container spacing={1}>
                                {report.service_provider_events.map((service: ServiceProviderEventType, index: number) => (
                                    <Grid key={index}
                                          sx={{
                                              width: {
                                                  xs: '100%',
                                                  sm: '50%'
                                              }
                                          }}
                                    >
                                        <Card variant="outlined" sx={{p: 1}}>
                                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Typography variant="body2">
                                                    <strong>{service.service_provider_details?.name || 'Unknown Provider'}</strong>
                                                </Typography>
                                                <Typography variant="body2">
                                                    ${service.cost || 'N/A'}
                                                </Typography>
                                            </Box>
                                            {service.description && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {service.description}
                                                </Typography>
                                            )}
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{mt: 1, textAlign: 'right'}}>
                                <Typography variant="body2">
                                    Services Total: ${serviceCost.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No external service providers used for this maintenance.
                        </Typography>
                    )}
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default MaintenanceReportCard;