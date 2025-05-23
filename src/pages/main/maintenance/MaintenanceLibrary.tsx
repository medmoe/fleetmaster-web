import {Box, Button, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Tab, Tabs, Typography, useTheme} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {API} from "@/constants/endpoints.ts";
import axios from "axios";
import {AlertTuple, CoreMetricsResponse, FormattedHealthAlerts, GroupedMetricsResponse, VehicleHealthAlerts, VehicleHealthMetrics} from "@/types/maintenance.ts";
import {initialFleetWideOverview, initialGroupedMetrics} from "./initialStates.ts"
import {DonutChartSegment} from "@/components/charts/DonutChart.tsx";
import {CoreMetricsCards, DateRangePicker, DonutChart, GroupedMetricsChart, NotificationBar} from "@/components";

// Component to display the maintenance library dashboard
const MaintenanceLibrary = () => {
    const {t} = useTranslation();
    const theme = useTheme();

    // State for filters
    const [vehicleType, setVehicleType] = useState<string>("ALL");
    const [groupBy, setGroupBy] = useState<'monthly' | 'quarterly' | 'yearly' | 'none'>('none');
    const [serviceTab, setServiceTab] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success" as "success" | "error"})


    // State for metrics data
    const [standardMetrics, setStandardMetrics] = useState<CoreMetricsResponse>(initialFleetWideOverview);
    const [groupedMetrics, setGroupedMetrics] = useState<GroupedMetricsResponse>(initialGroupedMetrics);
    const [serviceAlerts, setServiceAlerts] = useState<FormattedHealthAlerts>(null)

    // Filtered state - if any filter is applied, show grouped view
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    // Fetch standard metrics data on initial load
    useEffect(() => {
        const fetchStandardMetrics = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (vehicleType !== "ALL") {
                    params.append("vehicle_type", vehicleType);
                }
                const response = await axios.get(`${API}maintenance/fleet-wide-overview/`, {
                    params,
                    withCredentials: true
                });
                const {health_alerts, ...rest} = response.data;
                setStandardMetrics(rest);
                setServiceAlerts(formatHealthAlerts(health_alerts))
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    setSnackbar({open: true, message: t('pages.maintenance.library.errors.sessionExpired'), severity: "error"});
                } else {
                    setSnackbar({open: true, message: t('pages.maintenance.library.errors.standardMetrics'), severity: "error"});
                }
                console.error("Error fetching standard metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStandardMetrics();
    }, [vehicleType]);

    // Update range state when state/end range are updated
    useEffect(() => {
        if (startDate && endDate && startDate < endDate) {
            setRange([startDate, endDate]);
        }
    }, [startDate, endDate]);

    // Fetch grouped metrics when filters change
    useEffect(() => {
        // Skip the initial render
        if ((range[0] === null || range[1] == null) && groupBy === "none") {
            setIsFiltered(false);
            return;
        }

        const fetchFilteredData = async () => {
            setLoading(true);
            setIsFiltered(true);

            try {
                // Build query parameters
                const params = new URLSearchParams();
                if (vehicleType !== "ALL") {
                    params.append("vehicle_type", vehicleType);
                }
                if (range[0] && range[1]) {
                    params.append("start_date", range[0].toISOString().split('T')[0]);
                    params.append("end_date", range[1].toISOString().split('T')[0]);
                }
                if (groupBy !== "none") {
                    params.append("group_by", groupBy);
                }

                // Make API request with params
                const response = await axios.get(`${API}maintenance/fleet-wide-overview/`, {
                    params,
                    withCredentials: true
                });
                const {health_alerts, ...rest} = response.data;
                setGroupedMetrics(rest);
                setServiceAlerts(formatHealthAlerts(health_alerts))

            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    setSnackbar({open: true, message: t('pages.maintenance.library.errors.sessionExpired'), severity: "error"});
                } else {
                    setSnackbar({open: true, message: t('pages.maintenance.library.errors.groupedMetrics'), severity: "error"});
                }
                console.error("Error fetching grouped metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredData();
    }, [vehicleType, range, groupBy]);

    // Handler functions
    const handleVehicleTypeChange = (event: SelectChangeEvent<string>) => {
        setVehicleType(event.target.value);
    };

    const handleGroupByChange = (event: SelectChangeEvent<string>) => {
        setGroupBy(event.target.value as 'monthly' | 'quarterly' | 'yearly' | 'none');
    };

    const handleServiceTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setServiceTab(newValue);
    };

    const handleResetFilters = () => {
        setVehicleType("ALL");
        setStartDate(null);
        setEndDate(null);
        setRange([null, null]);
        setGroupBy("none");
        setIsFiltered(false);
    };

    const formatHealthAlerts = (alerts: VehicleHealthAlerts): FormattedHealthAlerts => {
        const formattedAlerts: FormattedHealthAlerts = {
            overdue: {total: 0, vehicles: []},
            upcoming: {total: 0, vehicles: []}
        }
        Object.entries(alerts).forEach(([key, value]) => {
            const health_type = key.split("_")[1];
            Object.entries(value).forEach(([key2, value2]) => {
                if (key2 === "warning") {
                    formattedAlerts.upcoming.total += value2.length;
                    const extendedTuples: AlertTuple[] = value2.map((tuple) => [...tuple, health_type]);
                    formattedAlerts.upcoming.vehicles.push(...extendedTuples);
                } else if (key2 == 'critical') {
                    formattedAlerts.overdue.total += value2.length;
                    const extendedTuples: AlertTuple[] = value2.map((tuple) => [...tuple, health_type]);
                    formattedAlerts.overdue.vehicles.push(...extendedTuples);
                }
            })
        })
        return formattedAlerts;
    }

    // Get relevant health metrics based on current view
    const getHealthMetrics = (): VehicleHealthMetrics => {
        return isFiltered
            ? groupedMetrics.vehicle_health_metrics
            : standardMetrics.vehicle_health_metrics;
    };

    const getDonutChartData = () => {
        const healthMetrics = getHealthMetrics();

        const overallHealthSegments: DonutChartSegment[] = [
            {label: t('pages.maintenance.library.vehicleHealth.status.good'), value: healthMetrics.vehicle_avg_health.good, color: theme.palette.success.main},
            {label: t('pages.maintenance.library.vehicleHealth.status.warning'), value: healthMetrics.vehicle_avg_health.warning, color: theme.palette.warning.main},
            {label: t('pages.maintenance.library.vehicleHealth.status.critical'), value: healthMetrics.vehicle_avg_health.critical, color: theme.palette.error.main}
        ];

        const insuranceHealthSegments: DonutChartSegment[] = [
            {label: t('pages.maintenance.library.vehicleHealth.status.good'), value: healthMetrics.vehicle_insurance_health.good, color: theme.palette.success.main},
            {label: t('pages.maintenance.library.vehicleHealth.status.warning'), value: healthMetrics.vehicle_insurance_health.warning, color: theme.palette.warning.main},
            {label: t('pages.maintenance.library.vehicleHealth.status.critical'), value: healthMetrics.vehicle_insurance_health.critical, color: theme.palette.error.main}
        ];

        const licenseHealthSegments: DonutChartSegment[] = [
            {label: t('pages.maintenance.library.vehicleHealth.status.good'), value: healthMetrics.vehicle_license_health.good, color: theme.palette.success.main},
            {label: t('pages.maintenance.library.vehicleHealth.status.warning'), value: healthMetrics.vehicle_license_health.warning, color: theme.palette.warning.main},
            {label: t('pages.maintenance.library.vehicleHealth.status.critical'), value: healthMetrics.vehicle_license_health.critical, color: theme.palette.error.main}
        ];

        return {
            overallHealthSegments,
            insuranceHealthSegments,
            licenseHealthSegments
        };
    };

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            {/* 1. Header Section */}
            <Box sx={{mb: 4}}>
                <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}}>
                    {isFiltered ? t('pages.maintenance.library.filteredOverview') : t('pages.maintenance.library.fleetOverview')}
                </Typography>
            </Box>
            <Box sx={{mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    {/* Vehicle Type Filter */}
                    <FormControl variant="outlined" size="medium" sx={{minWidth: 150}}>
                        <InputLabel>{t('pages.maintenance.library.filters.vehicleType')}</InputLabel>
                        <Select
                            value={vehicleType}
                            onChange={handleVehicleTypeChange}
                            label={t('pages.maintenance.library.filters.vehicleType')}
                        >
                            <MenuItem value="ALL">{t('pages.maintenance.library.filters.allVehicles')}</MenuItem>
                            <MenuItem value="TRUCK">{t('pages.maintenance.library.filters.trucks')}</MenuItem>
                            <MenuItem value="VAN">{t('pages.maintenance.library.filters.vans')}</MenuItem>
                            <MenuItem value="CAR">{t('pages.maintenance.library.filters.cars')}</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Group By Selector */}
                    <FormControl variant="outlined" size="medium" sx={{minWidth: 120}}>
                        <InputLabel>{t('pages.maintenance.library.filters.groupBy')}</InputLabel>
                        <Select
                            value={groupBy}
                            onChange={handleGroupByChange}
                            label={t('pages.maintenance.library.filters.groupBy')}
                        >
                            <MenuItem value="none">{t('pages.maintenance.library.filters.none')}</MenuItem>
                            <MenuItem value="monthly">{t('pages.maintenance.library.filters.monthly')}</MenuItem>
                            <MenuItem value="quarterly">{t('pages.maintenance.library.filters.quarterly')}</MenuItem>
                            <MenuItem value="yearly">{t('pages.maintenance.library.filters.yearly')}</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Date Range Picker */}
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        startLabel={t('pages.maintenance.library.filters.startDate')}
                        endLabel={t('pages.maintenance.library.filters.endDate')}
                        size="medium"
                    />

                    {/* Reset filters button - only show when filtered */}
                    {isFiltered && (
                        <Button
                            variant="outlined"
                            onClick={handleResetFilters}
                            sx={{minWidth: 120}}
                        >
                            {t('pages.maintenance.library.filters.resetFilters')}
                        </Button>
                    )}
                </Box>
            </Box>

            {/* View indicator - only show when filtered */}
            {isFiltered && (
                <Box sx={{mb: 2, p: 1, bgcolor: theme.palette.custom.primary[100], borderRadius: 1}}>
                    <Typography variant="body2">
                        {t('pages.maintenance.library.filteredView.showing')} {vehicleType !== "ALL" ? vehicleType.toLowerCase() : t('pages.maintenance.library.filteredView.allVehicles')}
                        {startDate && endDate ?
                            `, ${t('pages.maintenance.library.filteredView.period')} ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` :
                            startDate ?
                                `, ${t('pages.maintenance.library.filteredView.from')} ${startDate.toLocaleDateString()}` :
                                endDate ?
                                    `, ${t('pages.maintenance.library.filteredView.until')} ${endDate.toLocaleDateString()}` :
                                    ''}
                        {`, ${t('pages.maintenance.library.filteredView.grouped')} ${groupBy}`}
                    </Typography>
                </Box>

            )}

            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <CircularProgress color="primary" size={40} thickness={5}/>
                </Box>
            ) : (
                <Box>
                    {!isFiltered ? (
                        <CoreMetricsCards standardMetrics={standardMetrics}/>
                    ) : Object.keys(groupedMetrics.grouped_metrics).length > 0 ? (
                        <GroupedMetricsChart data={groupedMetrics.grouped_metrics}
                                             groupBy={groupBy}
                                             title={t('pages.maintenance.charts.groupedMetrics.title')}/>
                    ) : (
                        <CoreMetricsCards standardMetrics={standardMetrics}/>
                    )}


                    {/* 3. Vehicle Health Overview */}
                    <Paper elevation={3} sx={{p: 3, mb: 4}}>
                        <Typography variant="h6" gutterBottom>
                            {t('pages.maintenance.library.vehicleHealth.title')}
                        </Typography>

                        {/* First row: Three donut charts */}
                        <Grid container spacing={3} sx={{mb: 4}}>
                            <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                                <DonutChart
                                    title={t('pages.maintenance.library.vehicleHealth.overall')}
                                    segments={getDonutChartData().overallHealthSegments}
                                    customLabels={
                                        {
                                            'Good': t('pages.maintenance.library.vehicleHealth.status.good'),
                                            'Warning': t('pages.maintenance.library.vehicleHealth.status.warning'),
                                            'Critical': t('pages.maintenance.library.vehicleHealth.status.critical')
                                        }
                                    }
                                />
                            </Grid>

                            <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                                <DonutChart
                                    title={t('pages.maintenance.library.vehicleHealth.insurance')}
                                    segments={getDonutChartData().insuranceHealthSegments}
                                    customLabels={
                                        {
                                            'Good': t('pages.maintenance.library.vehicleHealth.status.valid'),
                                            'Warning': t('pages.maintenance.library.vehicleHealth.status.expiring'),
                                            'Critical': t('pages.maintenance.library.vehicleHealth.status.expired')
                                        }
                                    }
                                />
                            </Grid>

                            <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                                <DonutChart
                                    title={t('pages.maintenance.library.vehicleHealth.license')}
                                    segments={getDonutChartData().licenseHealthSegments}
                                    customLabels={
                                        {
                                            'Good': t('pages.maintenance.library.vehicleHealth.status.valid'),
                                            'Warning': t('pages.maintenance.library.vehicleHealth.status.expiring'),
                                            'Critical': t('pages.maintenance.library.vehicleHealth.status.expired')
                                        }
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Second row: Top recurring issues */}
                    {standardMetrics.top_recurring_issues.length > 0 && (
                        <Paper elevation={3} sx={{p: 3, mb: 4}}>
                            <Typography variant="subtitle1" gutterBottom>
                                {t('pages.maintenance.library.recurringIssues.title')}
                            </Typography>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
                                {standardMetrics.top_recurring_issues.map((issue, index) => (
                                    <Box key={index} sx={{width: {xs: '100%', sm: '48%', md: '31%'}}}>
                                        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 0.5}}>
                                            <Typography variant="body2">{issue.part__name}</Typography>
                                            <Typography variant="body2" fontWeight="bold">{issue.count}</Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                height: 8,
                                                borderRadius: 1,
                                                bgcolor: theme.palette.grey[200],
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    width: `${(issue.count / 15) * 100}%`,
                                                    bgcolor: theme.palette.custom.primary[500],
                                                    borderRadius: 1,
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    )}


                    {/* 4. Service Alerts */}
                    <Paper elevation={3} sx={{p: 3, mb: 4}}>
                        <Typography variant="h6" gutterBottom>
                            {t('pages.maintenance.library.serviceAlerts.title')}
                        </Typography>

                        <Tabs
                            value={serviceTab}
                            onChange={handleServiceTabChange}
                            sx={{mb: 2, borderBottom: 1, borderColor: 'divider'}}
                        >
                            <Tab label={`${t('pages.maintenance.library.serviceAlerts.overdue')} (${serviceAlerts?.overdue.total || 0})`}/>
                            <Tab label={`${t('pages.maintenance.library.serviceAlerts.upcoming')} (${serviceAlerts?.upcoming.total || 0})`}/>
                        </Tabs>

                        {/* Overdue Alerts Tab */}
                        {serviceTab === 0 && (
                            <Box>
                                {serviceAlerts?.overdue.vehicles.length === 0 ? (
                                    <Typography variant="body1" sx={{textAlign: 'center', py: 4, color: 'text.secondary'}}>
                                        {t('pages.maintenance.library.serviceAlerts.noAlerts')}
                                    </Typography>
                                ) : (
                                    serviceAlerts?.overdue.vehicles.map(([registration, make, model, year, health_type], index) => {
                                        return (
                                            <Box
                                                key={`${registration}-${index}`}
                                                sx={{
                                                    p: 2,
                                                    mb: 1,
                                                    borderLeft: 4,
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 1,
                                                    display: 'flex',
                                                    flexDirection: {xs: 'column', sm: 'row'},
                                                    justifyContent: 'space-between',
                                                    alignItems: {xs: 'flex-start', sm: 'center'}
                                                }}
                                            >
                                                <Box sx={{flex: 1}}>
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {registration}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {make} {model} ({year})
                                                    </Typography>
                                                </Box>

                                                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: {xs: 'flex-start', sm: 'flex-end'}, mt: {xs: 1, sm: 0}}}>
                                                    <Box
                                                        sx={{
                                                            display: 'inline-block',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: 12,
                                                            bgcolor: theme.palette.error.main,
                                                            color: 'white',
                                                            textTransform: 'uppercase'
                                                        }}
                                                    >
                                                        {health_type === 'avg' ? 'maintenance' : health_type}
                                                    </Box>
                                                    <Typography variant="caption" sx={{mt: 0.5}}>
                                                        {t('pages.maintenance.library.serviceAlerts.issueType')}: {health_type === "avg" ? "maintenance" : health_type}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })
                                )}
                            </Box>
                        )}

                        {/* Upcoming Alerts Tab */}
                        {serviceTab === 1 && (
                            <Box>
                                {serviceAlerts?.upcoming.vehicles.length === 0 ? (
                                    <Typography variant="body1" sx={{textAlign: 'center', py: 4, color: 'text.secondary'}}>
                                        {t('pages.maintenance.library.serviceAlerts.noAlerts')}
                                    </Typography>
                                ) : (
                                    serviceAlerts?.upcoming.vehicles.map(([registration, make, model, year, health_type], index) => (
                                        <Box
                                            key={`${registration}-${index}`}
                                            sx={{
                                                p: 2,
                                                mb: 1,
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                border: 1,
                                                borderColor: 'divider',
                                                display: 'flex',
                                                flexDirection: {xs: 'column', sm: 'row'},
                                                justifyContent: 'space-between',
                                                alignItems: {xs: 'flex-start', sm: 'center'}
                                            }}
                                        >
                                            <Box sx={{flex: 1}}>
                                                <Typography variant="subtitle1" fontWeight="medium">
                                                    {registration}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {make} {model} ({year})
                                                </Typography>
                                            </Box>

                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: {xs: 'flex-start', sm: 'flex-end'},
                                                mt: {xs: 1, sm: 0}
                                            }}>
                                                <Box
                                                    sx={{
                                                        display: 'inline-block',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        fontSize: 12,
                                                        bgcolor: theme.palette.warning.main,
                                                        color: 'white'
                                                    }}
                                                >
                                                    {health_type === 'avg' ? 'maintenance' : health_type}
                                                </Box>
                                                <Typography variant="caption" sx={{mt: 0.5}}>
                                                    {t('pages.maintenance.library.serviceAlerts.scheduledMaintenance')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))
                                )}
                            </Box>
                        )}
                    </Paper>

                </Box>
            )}
            <NotificationBar snackbar={snackbar} setSnackbar={setSnackbar}/>
        </Container>
    );
}
export default MaintenanceLibrary;