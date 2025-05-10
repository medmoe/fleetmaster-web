import React, {useMemo} from 'react';
import {Box, Paper, Typography, Grid, Tooltip, useTheme} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {format} from 'date-fns';

// Define the types for different period changes
type YearlyChange = { yoy_change: number; vehicle_avg: number };
type QuarterlyChange = { qoq_change: number; vehicle_avg: number };
type MonthlyChange = { mom_change: number; vehicle_avg: number };

// Define the props for the component
interface GroupedMetricsChartProps {
    data: {
        [key: string]: YearlyChange | QuarterlyChange | MonthlyChange;
    };
    groupBy: 'monthly' | 'quarterly' | 'yearly' | 'none';
    title?: string;
}

// Helper function to get change value based on groupBy
const getChangeValue = (
    data: YearlyChange | QuarterlyChange | MonthlyChange,
    groupBy: 'monthly' | 'quarterly' | 'yearly' | 'none'
): number => {
    if (groupBy === 'yearly' && 'yoy_change' in data) {
        return data.yoy_change;
    } else if (groupBy === 'quarterly' && 'qoq_change' in data) {
        return data.qoq_change;
    } else if (groupBy === 'monthly' && 'mom_change' in data) {
        return data.mom_change;
    }

    // Default case - if the property doesn't exist, return 0
    return 0;
};

// Helper function to get change label based on groupBy
const getChangeLabel = (groupBy: 'monthly' | 'quarterly' | 'yearly' | 'none'): string => {
    if (groupBy === 'yearly') return 'YoY';
    if (groupBy === 'quarterly') return 'QoQ';
    if (groupBy === 'monthly') return 'MoM';
    return 'Change';
};

// Helper function to format the period label
const formatPeriodLabel = (period: string, groupBy: 'monthly' | 'quarterly' | 'yearly' | 'none'): string => {
    if (groupBy === 'yearly' || !period.includes('-')) {
        return period; // Just return the year
    }

    if (groupBy === 'quarterly') {
        const [year, quarter] = period.split('-Q');
        return `Q${quarter} ${year}`;
    }

    if (groupBy === 'monthly') {
        const [year, month] = period.split('-');
        // Use a safer approach for parsing month numbers
        const monthNum = parseInt(month, 10);
        if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
            // Create date with the correct month (0-based index for months in JS)
            const date = new Date(parseInt(year), monthNum - 1, 1);
            return format(date, 'MMM yyyy');
        }
        return `${month} ${year}`; // Fallback
    }

    return period;
};

const GroupedMetricsChart: React.FC<GroupedMetricsChartProps> = ({
                                                                     data,
                                                                     groupBy,
                                                                     title = 'Maintenance Cost Analysis'
                                                                 }) => {
    const theme = useTheme();


    /**
     * Processes and calculates chart metrics from the input data.
     * Returns an object containing:
     * - periods: sorted array of time periods
     * - maxValue: maximum value for chart scaling
     * - avgChange: average change across all periods
     * - isIncreasing: boolean indicating if the overall trend is increasing
     * - formattedPeriods: periods formatted for display
     * - changeLabel: appropriate label for change type (YoY/QoQ/MoM)
     */
    const metrics = useMemo(() => {
        
        // Extract and sort periods
        const periods = Object.keys(data).sort((a, b) => {
            // Special sorting for different period formats
            if (groupBy === 'yearly') {
                return parseInt(a) - parseInt(b);
            } else if (groupBy === 'quarterly') {
                // Compare years first, then quarters
                const [yearA, quarterA] = a.split('-Q');
                const [yearB, quarterB] = b.split('-Q');
                if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
                return parseInt(quarterA) - parseInt(quarterB);
            } else if (groupBy === 'monthly') {
                // Compare years first, then months
                const [yearA, monthA] = a.split('-');
                const [yearB, monthB] = b.split('-');
                if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
                return parseInt(monthA) - parseInt(monthB);
            }
            return a.localeCompare(b);
        });

        // Extract values for vehicle averages
        const vehicleAvgs = periods.map(period => data[period]?.vehicle_avg || 0);

        // Calculate max value for chart scaling
        const maxValue = Math.max(...vehicleAvgs, 1); // Ensure we don't divide by zero

        // Get the change values for all periods
        const changeValues = periods.map(period =>
            getChangeValue(data[period], groupBy)
        );

        // Calculate average change value
        const avgChange = changeValues.length && periods.length > 1
            ? changeValues.reduce((sum, current) => sum + current, 0) / changeValues.length
            : (periods.length === 1 ? getChangeValue(data[periods[0]], groupBy) : 0);

        // Determine if the overall trend is increasing or decreasing
        const isIncreasing = avgChange > 0;

        return {
            periods,
            maxValue,
            avgChange,
            isIncreasing,
            formattedPeriods: periods.map(period => formatPeriodLabel(period, groupBy)),
            changeLabel: getChangeLabel(groupBy)
        };
    }, [data, groupBy]);

    // Format currency for display
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Format percentage for display
    const formatPercentage = (value: number): string => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}%`;
    };

    return (
        <Paper elevation={3} sx={{p: 3, mb: 4, overflow: 'hidden'}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="h6">{title}</Typography>

                {/* Overall trend indicator */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: metrics.isIncreasing
                        ? theme.palette.error.light
                        : theme.palette.success.light,
                    color: metrics.isIncreasing
                        ? theme.palette.error.main
                        : theme.palette.success.main,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1
                }}>
                    {metrics.isIncreasing
                        ? <TrendingUpIcon fontSize="small" sx={{mr: 0.5}}/>
                        : <TrendingDownIcon fontSize="small" sx={{mr: 0.5}}/>
                    }
                    <Typography variant="body2" fontWeight="medium" color={theme.palette.text.primary}>
                        {formatPercentage(metrics.avgChange)} {!metrics.isIncreasing && "savings"}
                    </Typography>
                </Box>
            </Box>

            {/* Period subtitle */}
            <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                {groupBy === 'yearly'
                    ? 'Yearly comparison'
                    : groupBy === 'quarterly'
                        ? 'Quarterly comparison'
                        : 'Monthly comparison'}
                {" of average maintenance costs per vehicle"}
            </Typography>

            {/* Bar chart visualization */}
            {metrics.periods.length > 0 ? (
                <Box sx={{height: 250, width: '100%', position: 'relative', mb: 4}}>
                    {/* Y-axis (values) */}
                    <Box sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 30,
                        width: 60,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRight: `1px dashed ${theme.palette.divider}`,
                        pr: 1
                    }}>
                        <Typography variant="caption" sx={{textAlign: 'right', width: '100%'}}>
                            {formatCurrency(metrics.maxValue)}
                        </Typography>
                        <Typography variant="caption" sx={{textAlign: 'right', width: '100%'}}>
                            {formatCurrency(metrics.maxValue / 2)}
                        </Typography>
                        <Typography variant="caption" sx={{textAlign: 'right', width: '100%'}}>
                            $0
                        </Typography>
                    </Box>

                    {/* Chart area */}
                    <Box sx={{
                        position: 'absolute',
                        left: 70,
                        right: 10,
                        top: 0,
                        bottom: 30,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-around',
                    }}>
                        {metrics.periods.map((period, index) => {
                            const currentData = data[period];
                            const height = (currentData?.vehicle_avg / metrics.maxValue) * 100;
                            const changeValue = getChangeValue(currentData, groupBy);

                            return (
                                <Tooltip
                                    key={period}
                                    title={
                                        <Box sx={{p: 1}}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {metrics.formattedPeriods[index]}
                                            </Typography>
                                            <Typography variant="body2">
                                                Average: {formatCurrency(currentData?.vehicle_avg || 0)}
                                            </Typography>
                                            <Typography variant="body2"
                                                        color={changeValue >= 0 ? theme.palette.error.main : theme.palette.success.main}>
                                                {metrics.changeLabel} Change: {formatPercentage(changeValue)}
                                            </Typography>
                                        </Box>
                                    }
                                    arrow
                                    placement="top"
                                >
                                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                                        <Box sx={{
                                            width: '50%',
                                            minWidth: 30,
                                            maxWidth: 60,
                                            height: `${height}%`,
                                            bgcolor: changeValue >= 0
                                                ? theme.palette.primary.main
                                                : theme.palette.success.main,
                                            borderRadius: '4px 4px 0 0',
                                            position: 'relative',
                                            transition: 'height 0.5s ease-in-out',
                                            '&:hover': {
                                                opacity: 0.8,
                                                cursor: 'pointer'
                                            }
                                        }}>
                                            {/* Change indicator at top of bar */}
                                            {changeValue !== 0 && (
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: -20,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    color: changeValue >= 0 ? theme.palette.error.main : theme.palette.success.main,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: 12
                                                }}>
                                                    {changeValue >= 0
                                                        ? <TrendingUpIcon fontSize="inherit"/>
                                                        : <TrendingDownIcon fontSize="inherit"/>
                                                    }
                                                    {formatPercentage(changeValue)}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </Tooltip>
                            );
                        })}
                    </Box>

                    {/* X-axis (periods) */}
                    <Box sx={{
                        position: 'absolute',
                        left: 70,
                        right: 10,
                        bottom: 0,
                        height: 30,
                        display: 'flex',
                        justifyContent: 'space-around',
                        borderTop: `1px solid ${theme.palette.divider}`
                    }}>
                        {metrics.formattedPeriods.map((label, index) => (
                            <Typography key={index} variant="caption" sx={{
                                width: '100%',
                                textAlign: 'center',
                                pt: 0.5
                            }}>
                                {label}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            ) : (
                <Box sx={{height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant="body2" color="text.secondary">
                        No data available for the selected filters
                    </Typography>
                </Box>
            )}

            {/* Detailed metrics cards */}
            {metrics.periods.length > 0 && (
                <Grid container spacing={2} sx={{mt: 1}}>
                    {metrics.periods.map((period, index) => {
                        const currentData = data[period];
                        const changeValue = getChangeValue(currentData, groupBy);

                        return (
                            <Grid sx={{width: {xs: "100%", sm:"50%", md:"25%"}}} key={period}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderLeft: `4px solid ${changeValue >= 0
                                            ? theme.palette.error.main
                                            : theme.palette.success.main}`,
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        {metrics.formattedPeriods[index]}
                                    </Typography>
                                    <Typography variant="h6" sx={{mt: 1}}>
                                        {formatCurrency(currentData?.vehicle_avg || 0)}
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 1,
                                        color: changeValue >= 0 ? theme.palette.error.main : theme.palette.success.main
                                    }}>
                                        {changeValue >= 0
                                            ? <TrendingUpIcon fontSize="small" sx={{mr: 0.5}}/>
                                            : <TrendingDownIcon fontSize="small" sx={{mr: 0.5}}/>
                                        }
                                        <Typography variant="body2">
                                            {metrics.changeLabel}: {formatPercentage(changeValue)}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Paper>
    );
};

export default GroupedMetricsChart;