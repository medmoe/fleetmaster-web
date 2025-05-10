import {Box, Button, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Tab, Tabs, Typography, useTheme} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {API} from "@/constants/endpoints.ts";
import axios from "axios";
import {CoreMetricsResponse, GroupedMetricsResponse, VehicleHealthMetrics} from "@/types/maintenance.ts";
import {initialFleetWideOverview, initialGroupedMetrics} from "./initialStates.ts"
import {DonutChartSegment} from "@/components/charts/DonutChart.tsx";
import {CoreMetricsCards, DateRangePicker, DonutChart, GroupedMetricsChart} from "@/components";

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


    // State for metrics data
    const [standardMetrics, setStandardMetrics] = useState<CoreMetricsResponse>(initialFleetWideOverview);
    const [groupedMetrics, setGroupedMetrics] = useState<GroupedMetricsResponse>(initialGroupedMetrics);

    // Filtered state - if any filter is applied, show grouped view
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    // Service alerts mock data
    const serviceAlerts = {
        overdue: [
            {id: 1, vehicle: "Truck #123", service: "Oil Change", urgency: "HIGH"},
            {id: 2, vehicle: "Van #456", service: "Brake Inspection", urgency: "MEDIUM"},
        ],
        upcoming: [
            {id: 3, vehicle: "Car #789", service: "Tire Rotation", dueIn: 7},
            {id: 4, vehicle: "Truck #234", service: "Battery Check", dueIn: 14},
        ]
    };

    // Fetch standard metrics data on initial load
    useEffect(() => {
        const fetchStandardMetrics = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API}/maintenance/fleet-wide-overview/`, {withCredentials: true});
                setStandardMetrics(response.data);
            } catch (error) {
                console.error("Error fetching standard metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStandardMetrics();
    }, []);

    // Fetch grouped metrics when filters change
    useEffect(() => {
        // Skip the initial render
        if (vehicleType === "ALL" && !startDate && !endDate && groupBy === "none") {
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
                if (startDate) {
                    params.append("start_date", startDate.toISOString().split('T')[0]);
                }
                if (endDate) {
                    params.append("end_date", endDate.toISOString().split('T')[0]);
                }
                params.append("group_by", groupBy);

                // Make API request with params
                const response = await axios.get(`${API}/maintenance/fleet-wide-overview/`, {
                    params,
                    withCredentials: true
                });

                setGroupedMetrics(response.data);
            } catch (error) {
                console.error("Error fetching grouped metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredData();
    }, [vehicleType, startDate, endDate, groupBy]);

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
        setGroupBy("none");
        setIsFiltered(false);
    };


    // Get relevant health metrics based on current view
    const getHealthMetrics = (): VehicleHealthMetrics => {
        return isFiltered
            ? groupedMetrics.vehicle_health_metrics
            : standardMetrics.vehicle_health_metrics;
    };

    // Get recurring issues based on current view
    const getRecurringIssues = () => {
        if (isFiltered) {
            // Grouped view might have different top issues
            // This would need to be implemented based on your API response structure
            return [
                {issue: "Engine Issues", count: 8},
                {issue: "Tire Replacements", count: 7},
                {issue: "AC Repairs", count: 5}
            ];
        } else {
            return standardMetrics.top_recurring_issues.map(issue => ({
                issue: issue.part__name,
                count: issue.count
            }));
        }
    };

    const getDonutChartData = () => {
        const healthMetrics = getHealthMetrics();

        const overallHealthSegments: DonutChartSegment[] = [
            {label: 'Good', value: healthMetrics.vehicle_avg_health.good, color: theme.palette.success.main},
            {label: 'Warning', value: healthMetrics.vehicle_avg_health.warning, color: theme.palette.warning.main},
            {label: 'Critical', value: healthMetrics.vehicle_avg_health.critical, color: theme.palette.error.main}
        ];

        const insuranceHealthSegments: DonutChartSegment[] = [
            {label: 'Good', value: healthMetrics.vehicle_insurance_health.good, color: theme.palette.success.main},
            {label: 'Warning', value: healthMetrics.vehicle_insurance_health.warning, color: theme.palette.warning.main},
            {label: 'Critical', value: healthMetrics.vehicle_insurance_health.critical, color: theme.palette.error.main}
        ];

        const licenseHealthSegments: DonutChartSegment[] = [
            {label: 'Good', value: healthMetrics.vehicle_license_health.good, color: theme.palette.success.main},
            {label: 'Warning', value: healthMetrics.vehicle_license_health.warning, color: theme.palette.warning.main},
            {label: 'Critical', value: healthMetrics.vehicle_license_health.critical, color: theme.palette.error.main}
        ];

        return {
            overallHealthSegments,
            insuranceHealthSegments,
            licenseHealthSegments
        };
    };


    // Variables for UI rendering
    const recurringIssues = getRecurringIssues();

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            {/* 1. Header Section */}
            <Box sx={{mb: 4}}>
                <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}}>
                    {isFiltered ? 'Filtered Maintenance Overview' : 'Fleet Maintenance Overview'}
                </Typography>
            </Box>
            <Box sx={{mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    {/* Vehicle Type Filter */}
                    <FormControl variant="outlined" size="medium" sx={{minWidth: 150}}>
                        <InputLabel>Vehicle Type</InputLabel>
                        <Select
                            value={vehicleType}
                            onChange={handleVehicleTypeChange}
                            label="Vehicle Type"
                        >
                            <MenuItem value="ALL">All Vehicles</MenuItem>
                            <MenuItem value="TRUCK">Trucks</MenuItem>
                            <MenuItem value="VAN">Vans</MenuItem>
                            <MenuItem value="CAR">Cars</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Group By Selector */}
                    <FormControl variant="outlined" size="medium" sx={{minWidth: 120}}>
                        <InputLabel>Group By</InputLabel>
                        <Select
                            value={groupBy}
                            onChange={handleGroupByChange}
                            label="Group By"
                        >
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="quarterly">Quarterly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Date Range Picker */}
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        startLabel="Start Date"
                        endLabel="End Date"
                        size="medium"
                    />

                    {/* Reset filters button - only show when filtered */}
                    {isFiltered && (
                        <Button
                            variant="outlined"
                            onClick={handleResetFilters}
                            sx={{minWidth: 120}}
                        >
                            Reset Filters
                        </Button>
                    )}
                </Box>
            </Box>

            {/* View indicator - only show when filtered */}
            {isFiltered && (
                <Box sx={{mb: 2, p: 1, bgcolor: theme.palette.custom.primary[100], borderRadius: 1}}>
                    <Typography variant="body2">
                        Showing filtered view: {vehicleType !== "ALL" ? vehicleType.toLowerCase() : "all"} vehicles
                        {startDate && endDate ?
                            `, period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` :
                            startDate ?
                                `, from: ${startDate.toLocaleDateString()}` :
                                endDate ?
                                    `, until: ${endDate.toLocaleDateString()}` :
                                    ''}
                        {`, grouped ${groupBy}`}
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
                                             title={"Filtered Maintenance Cost Analysis"}/>
                    ) : (
                        <CoreMetricsCards standardMetrics={standardMetrics}/>
                    )}


                    {/* 3. Vehicle Health Overview */}
                    <Paper elevation={3} sx={{p: 3, mb: 4}}>
                        <Typography variant="h6" gutterBottom>
                            Vehicle Health Overview
                        </Typography>

                        {/* First row: Three donut charts */}
                        <Grid container spacing={3} sx={{mb: 4}}>
                            <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                                <DonutChart
                                    title="Overall Vehicle Health"
                                    segments={getDonutChartData().overallHealthSegments}
                                    customLabels={{'Good': 'Good', 'Warning': 'Warning', 'Critical': 'Critical'}}
                                />
                            </Grid>

                            <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                                <DonutChart
                                    title="Insurance Status"
                                    segments={getDonutChartData().insuranceHealthSegments}
                                    customLabels={{'Good': 'Valid', 'Warning': 'Expiring', 'Critical': 'Expired'}}
                                />
                            </Grid>

                            <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                                <DonutChart
                                    title="License Status"
                                    segments={getDonutChartData().licenseHealthSegments}
                                    customLabels={{'Good': 'Valid', 'Warning': 'Expiring', 'Critical': 'Expired'}}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Second row: Top recurring issues */}
                    {recurringIssues.length > 0 && (
                        <Paper elevation={3} sx={{p: 3, mb: 4}}>
                            <Typography variant="subtitle1" gutterBottom>
                                Top Recurring Issues
                            </Typography>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
                                {recurringIssues.map((issue, index) => (
                                    <Box key={index} sx={{width: {xs: '100%', sm: '48%', md: '31%'}}}>
                                        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 0.5}}>
                                            <Typography variant="body2">{issue.issue}</Typography>
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
                            Service Alerts
                        </Typography>
                        <Tabs
                            value={serviceTab}
                            onChange={handleServiceTabChange}
                            sx={{mb: 2, borderBottom: 1, borderColor: 'divider'}}
                        >
                            <Tab label={`Overdue (${serviceAlerts.overdue.length})`}/>
                            <Tab label={`Upcoming (${serviceAlerts.upcoming.length})`}/>
                        </Tabs>

                        {serviceTab === 0 && (
                            <Box>
                                {serviceAlerts.overdue.map((alert) => (
                                    <Box
                                        key={alert.id}
                                        sx={{
                                            p: 2,
                                            mb: 1,
                                            borderLeft: 4,
                                            borderColor:
                                                alert.urgency === 'HIGH' ? theme.palette.error.main :
                                                    alert.urgency === 'MEDIUM' ? theme.palette.warning.main :
                                                        theme.palette.info.main,
                                            bgcolor: 'background.paper',
                                            borderRadius: 1
                                        }}
                                    >
                                        <Typography variant="subtitle1">
                                            {alert.vehicle} - {alert.service}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontSize: 12,
                                                bgcolor:
                                                    alert.urgency === 'HIGH' ? theme.palette.error.light :
                                                        alert.urgency === 'MEDIUM' ? theme.palette.warning.light :
                                                            theme.palette.info.light,
                                                color: 'white',
                                                mt: 1
                                            }}
                                        >
                                            {alert.urgency} PRIORITY
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        {serviceTab === 1 && (
                            <Box>
                                {serviceAlerts.upcoming.map((alert) => (
                                    <Box
                                        key={alert.id}
                                        sx={{
                                            p: 2,
                                            mb: 1,
                                            bgcolor: 'background.paper',
                                            borderRadius: 1,
                                            border: 1,
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Typography variant="subtitle1">
                                            {alert.vehicle} - {alert.service}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Due in {alert.dueIn} days
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Box>
            )}
        </Container>
    );
}
export default MaintenanceLibrary;