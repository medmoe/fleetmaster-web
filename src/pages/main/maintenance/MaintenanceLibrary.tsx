import {
    Box, Button, Card, CardContent, CircularProgress, Container, FormControl,
    Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Tab, Tabs,
    Typography, useTheme
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {API} from "@/constants/endpoints.ts";
import axios from "axios";
import {CoreMetricsResponse, GroupedMetricsResponse, VehicleHealthMetrics} from "@/types/maintenance.ts";
import {initialFleetWideOverview, initialGroupedMetrics} from "./initialStates.ts"

// Component to display the maintenance library dashboard
const MaintenanceLibrary = () => {
    const {t} = useTranslation();
    const theme = useTheme();

    // State for filters
    const [vehicleType, setVehicleType] = useState<string>("ALL");
    const [dateRange, setDateRange] = useState<Date | null>(null);
    const [groupBy, setGroupBy] = useState<string>("MONTHLY");
    const [serviceTab, setServiceTab] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

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
        if (vehicleType === "ALL" && !dateRange && groupBy === "MONTHLY") {
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
                if (dateRange) {
                    params.append("date", dateRange.toISOString().split('T')[0]);
                }
                params.append("group_by", groupBy.toLowerCase());

                // Make API request with params
                const response = await axios.get(`${API}/maintenance/grouped-metrics/`, {
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
    }, [vehicleType, dateRange, groupBy]);

    // Handler functions
    const handleVehicleTypeChange = (event: SelectChangeEvent<string>) => {
        setVehicleType(event.target.value);
    };

    const handleGroupByChange = (event: SelectChangeEvent<string>) => {
        setGroupBy(event.target.value);
    };

    const handleServiceTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setServiceTab(newValue);
    };

    const handleResetFilters = () => {
        setVehicleType("ALL");
        setDateRange(null);
        setGroupBy("MONTHLY");
        setIsFiltered(false);
    };

    // Helper function to format currency
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Helper to format percentage
    const formatPercentage = (value: number): string => {
        const sign = value > 0 ? "+" : "";
        return `${sign}${value.toFixed(1)}%`;
    };

    // Get relevant health metrics based on current view
    const getHealthMetrics = (): VehicleHealthMetrics => {
        return isFiltered
            ? groupedMetrics.vehicle_health_metrics
            : standardMetrics.vehicle_health_metrics;
    };

    // Get data for summary cards based on current view
    const getSummaryData = () => {
        if (isFiltered) {
            // Process grouped metrics data for cards
            const periods = Object.keys(groupedMetrics.grouped_metrics);
            const totalSpend = periods.length > 0
                ? formatCurrency(Object.values(groupedMetrics.grouped_metrics)
                    .reduce((sum, item: any) => sum + (item.total || 0), 0))
                : '$0';

            return {
                totalSpend,
                yoyChange: "N/A", // Grouped view may not have YoY comparison
                avgCostPerVehicle: periods.length > 0
                    ? formatCurrency(Object.values(groupedMetrics.grouped_metrics)
                        .reduce((sum, item: any) => sum + (item.vehicle_avg || 0), 0) / periods.length)
                    : '$0',
                overdueCount: serviceAlerts.overdue.length // Mock data for now
            };
        } else {
            // Use standard metrics
            return {
                totalSpend: formatCurrency(standardMetrics.total_maintenance_cost.year.total),
                yoyChange: formatPercentage(standardMetrics.yoy),
                avgCostPerVehicle: formatCurrency(standardMetrics.total_maintenance_cost.year.vehicle_avg),
                overdueCount: serviceAlerts.overdue.length // Mock data for now
            };
        }
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

    // Get chart data for cost trends
    const getChartData = () => {
        if (isFiltered) {
            // Process grouped metrics for chart
            const periods = Object.keys(groupedMetrics.grouped_metrics).sort();
            const values = periods.map(period => {
                const data = groupedMetrics.grouped_metrics[period];
                return data || 0;
            });

            // Normalize values for display (as percentages)
            const maxValue = Math.max(...values, 1);
            const normalizedValues = values.map(val => (val / maxValue) * 100);

            return {
                labels: periods,
                values: normalizedValues
            };
        } else {
            // Mock data for standard view
            if (groupBy === "MONTHLY") {
                return {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [65, 80, 55, 70, 90, 75]
                };
            } else {
                return {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    values: [70, 80, 65, 85]
                };
            }
        }
    };

    // Get health status data
    const getHealthStatusData = () => {
        const healthMetrics = getHealthMetrics();
        return {
            good: healthMetrics.vehicle_avg_health.good,
            warning: healthMetrics.vehicle_avg_health.warning,
            critical: healthMetrics.vehicle_avg_health.critical
        };
    };

    // Variables for UI rendering
    const summaryData = getSummaryData();
    const recurringIssues = getRecurringIssues();
    const chartData = getChartData();
    const healthStatus = getHealthStatusData();

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            {/* 1. Header Section */}
            <Box sx={{mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}}>
                    {isFiltered ? 'Filtered Maintenance Overview' : 'Fleet Maintenance Overview'}
                </Typography>

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

                    {/* Date Range Picker */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Date Range"
                            value={dateRange}
                            onChange={(newValue) => setDateRange(newValue)}
                            slotProps={{
                                openPickerIcon: {sx: {color: theme.palette.custom.accent[500]}}
                            }}
                        />
                    </LocalizationProvider>

                    {/* Group By Selector */}
                    <FormControl variant="outlined" size="medium" sx={{minWidth: 120}}>
                        <InputLabel>Group By</InputLabel>
                        <Select
                            value={groupBy}
                            onChange={handleGroupByChange}
                            label="Group By"
                        >
                            <MenuItem value="MONTHLY">Monthly</MenuItem>
                            <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                        </Select>
                    </FormControl>

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
                        {dateRange ? `, period: ${dateRange.toLocaleDateString()}` : ''}
                        {`, grouped ${groupBy.toLowerCase()}`}
                    </Typography>
                </Box>
            )}

            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <CircularProgress color="primary" size={40} thickness={5}/>
                </Box>
            ) : (
                <>
                    {/* 2. Core Metrics (Summary Cards) */}
                    <Grid container spacing={3} sx={{mb: 4}}>
                        <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Spend
                                    </Typography>
                                    <Typography variant="h4" component="div" sx={{mt: 1}}>
                                        {summaryData.totalSpend}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        YoY Cost Change
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        sx={{
                                            mt: 1,
                                            color: summaryData.yoyChange.includes('+') ? theme.palette.error.main : theme.palette.success.main
                                        }}
                                    >
                                        {summaryData.yoyChange}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Avg Cost/Vehicle
                                    </Typography>
                                    <Typography variant="h4" component="div" sx={{mt: 1}}>
                                        {summaryData.avgCostPerVehicle}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Overdue Services
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        sx={{
                                            mt: 1,
                                            color: summaryData.overdueCount > 0 ? theme.palette.error.main : theme.palette.success.main
                                        }}
                                    >
                                        {summaryData.overdueCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* 3. Vehicle Health Overview */}
                    <Paper elevation={3} sx={{p: 3, mb: 4}}>
                        <Typography variant="h6" gutterBottom>
                            Vehicle Health Overview
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                                {/* Donut Chart for Health Status */}
                                <Box sx={{height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <Box sx={{textAlign: 'center'}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Health Status Distribution
                                        </Typography>
                                        {/* Donut chart visualization */}
                                        <Box sx={{
                                            width: 200,
                                            height: 200,
                                            borderRadius: '50%',
                                            background: `conic-gradient(
                        ${theme.palette.success.main} 0% ${healthStatus.good}%,
                        ${theme.palette.warning.main} ${healthStatus.good}% ${healthStatus.good + healthStatus.warning}%,
                        ${theme.palette.error.main} ${healthStatus.good + healthStatus.warning}% 100%
                      )`,
                                            margin: '0 auto',
                                            mt: 2
                                        }}/>
                                        <Box sx={{display: 'flex', justifyContent: 'space-around', mt: 2}}>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <Box sx={{width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main', mr: 1}}/>
                                                <Typography variant="body2">Good: {healthStatus.good}%</Typography>
                                            </Box>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <Box sx={{width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main', mr: 1}}/>
                                                <Typography variant="body2">Warning: {healthStatus.warning}%</Typography>
                                            </Box>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <Box sx={{width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main', mr: 1}}/>
                                                <Typography variant="body2">Critical: {healthStatus.critical}%</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Top Recurring Issues
                                </Typography>
                                {/* Horizontal bar chart for top issues */}
                                {recurringIssues.map((issue, index) => (
                                    <Box key={index} sx={{mb: 2}}>
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
                                                    bgcolor: theme.palette.primary.main
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                    </Paper>

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

                    {/* 5. Trend Analytics Panel */}
                    <Paper elevation={3} sx={{p: 3}}>
                        <Typography variant="h6" gutterBottom>
                            Maintenance Cost Trends
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                            {isFiltered
                                ? `Filtered ${groupBy.toLowerCase()} breakdown of maintenance costs`
                                : `${groupBy === 'MONTHLY' ? 'Monthly' : 'Quarterly'} breakdown of fleet maintenance costs`}
                        </Typography>

                        {/* Line/bar chart for cost over time */}
                        <Box sx={{height: 300, width: '100%'}}>
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    p: 2
                                }}
                            >
                                {/* Chart visualization */}
                                <Box sx={{width: '100%', height: '100%', position: 'relative'}}>
                                    {/* X-axis labels */}
                                    <Box sx={{position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between'}}>
                                        {chartData.labels.map((label) => (
                                            <Typography key={label} variant="caption" sx={{px: 1}}>{label}</Typography>
                                        ))}
                                    </Box>

                                    {/* Chart bars */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 20,
                                        left: 0,
                                        right: 0,
                                        height: 'calc(100% - 40px)',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'space-around'
                                    }}>
                                        {chartData.values.map((value, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    width: `${100 / Math.max(chartData.values.length * 2, 1)}%`,
                                                    height: `${value}%`,
                                                    bgcolor: isFiltered ? theme.palette.custom.secondary[600] : theme.palette.primary.main,
                                                    borderRadius: '4px 4px 0 0'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </>
            )}
        </Container>
    );
};

export default MaintenanceLibrary;