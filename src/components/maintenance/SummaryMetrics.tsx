// src/components/maintenance/SummaryMetrics.tsx
import React, {useMemo, useState} from 'react';
import {Box, Grid, IconButton, Paper, Tab, Tabs, Typography} from '@mui/material';
import {
    Build as BuildIcon,
    ChevronLeft,
    ChevronRight,
    MedicalServices as MedicalServicesIcon,
    TrendingDown as TrendingDownIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {MaintenanceReportWithStringsType} from "@/types/maintenance";
import {isValid, parse} from 'date-fns';
import {useTranslation} from 'react-i18next';

interface SummaryMetricsProps {
    currentYearData: MaintenanceReportWithStringsType[];
    prevYearData: MaintenanceReportWithStringsType[];
    selectedYear: number;
}

// View mode for metrics display
type ViewMode = 'yearly' | 'monthly';

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({
                                                           currentYearData,
                                                           prevYearData,
                                                           selectedYear
                                                       }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('yearly');
    const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(new Date().getMonth());
    const {t} = useTranslation();

    const metrics = useMemo(() => {
        // Calculate total costs
        const currentYearTotal = currentYearData.reduce(
            (sum, report) => sum + (parseFloat(report.total_cost || '0') || 0),
            0
        );

        const prevYearTotal = prevYearData.reduce(
            (sum, report) => sum + (parseFloat(report.total_cost || '0') || 0),
            0
        );

        // Calculate preventive/curative costs for the selected year
        const selectedYearData = selectedYear === new Date().getFullYear()
            ? currentYearData
            : prevYearData;

        const preventiveCost = selectedYearData
            .filter(report => report.maintenance_type === 'PREVENTIVE')
            .reduce((sum, report) => sum + (parseFloat(report.total_cost || '0') || 0), 0);

        const curativeCost = selectedYearData
            .filter(report => report.maintenance_type === 'CURATIVE')
            .reduce((sum, report) => sum + (parseFloat(report.total_cost || '0') || 0), 0);

        // Calculate year-over-year change percentage
        let changePercent = 0;
        if (prevYearTotal > 0) {
            changePercent = ((currentYearTotal - prevYearTotal) / prevYearTotal) * 100;
        }

        // Group data by month for selected year
        const monthlyData = Array(12).fill(null).map(() => ({
            total: 0,
            preventive: 0,
            curative: 0,
            events: 0
        }));

        // Group data by month for previous year (for comparison)
        const prevYearMonthlyData = Array(12).fill(null).map(() => ({
            total: 0,
            preventive: 0,
            curative: 0,
            events: 0
        }));

        // Process current year data by month
        selectedYearData.forEach(report => {
            if (report.start_date) {
                const date = parse(report.start_date, 'yyyy-MM-dd', new Date());

                if (isValid(date)) {
                    const month = date.getMonth();
                    const cost = parseFloat(report.total_cost || '0') || 0;

                    monthlyData[month].total += cost;
                    monthlyData[month].events += 1;

                    if (report.maintenance_type === 'PREVENTIVE') {
                        monthlyData[month].preventive += cost;
                    } else if (report.maintenance_type === 'CURATIVE') {
                        monthlyData[month].curative += cost;
                    }
                }
            }
        });

        // Process previous year data by month (for comparison)
        const comparisonData = selectedYear === new Date().getFullYear()
            ? prevYearData
            : currentYearData;

        comparisonData.forEach(report => {
            if (report.start_date) {
                const date = parse(report.start_date, 'yyyy-MM-dd', new Date());

                if (isValid(date)) {
                    const month = date.getMonth();
                    const cost = parseFloat(report.total_cost || '0') || 0;

                    prevYearMonthlyData[month].total += cost;
                    prevYearMonthlyData[month].events += 1;

                    if (report.maintenance_type === 'PREVENTIVE') {
                        prevYearMonthlyData[month].preventive += cost;
                    } else if (report.maintenance_type === 'CURATIVE') {
                        prevYearMonthlyData[month].curative += cost;
                    }
                }
            }
        });

        // Calculate month-over-month changes
        const monthlyChangeData = monthlyData.map((month, index) => {
            const prevMonth = index > 0 ? monthlyData[index - 1].total : 0;
            let monthOverMonthChange = 0;

            if (prevMonth > 0) {
                monthOverMonthChange = ((month.total - prevMonth) / prevMonth) * 100;
            }

            // Calculate year-over-year monthly change
            const prevYearSameMonth = prevYearMonthlyData[index].total;
            let yearOverYearMonthlyChange = 0;

            if (prevYearSameMonth > 0) {
                yearOverYearMonthlyChange = ((month.total - prevYearSameMonth) / prevYearSameMonth) * 100;
            }

            return {
                ...month,
                monthOverMonthChange,
                yearOverYearMonthlyChange,
                isMoMIncrease: monthOverMonthChange >= 0,
                isYoYIncrease: yearOverYearMonthlyChange >= 0
            };
        });

        return {
            currentYearTotal,
            prevYearTotal,
            preventiveCost,
            curativeCost,
            changePercent,
            isIncrease: changePercent >= 0,
            selectedYearTotal: selectedYear === new Date().getFullYear() ? currentYearTotal : prevYearTotal,
            selectedYearData,
            monthlyData: monthlyChangeData
        };
    }, [currentYearData, prevYearData, selectedYear]);

    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    const handlePrevMonth = () => {
        setCurrentMonthIndex(prev => (prev > 0 ? prev - 1 : 11));
    };

    const handleNextMonth = () => {
        setCurrentMonthIndex(prev => (prev < 11 ? prev + 1 : 0));
    };

    const currentMonthMetrics = metrics.monthlyData[currentMonthIndex];
    const prevMonthIndex = currentMonthIndex > 0 ? currentMonthIndex - 1 : 11;
    const prevMonthName = monthNames[prevMonthIndex];

    return (
        <Box>
            <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
                <Tabs
                    value={viewMode}
                    onChange={(_, newValue) => setViewMode(newValue)}
                    aria-label="metrics view mode"
                >
                    <Tab label={t('pages.vehicle.maintenance.overview.summaryMetrics.tabs.yearly')} value="yearly"/>
                    <Tab label={t('pages.vehicle.maintenance.overview.summaryMetrics.tabs.monthly')} value="monthly"/>
                </Tabs>
            </Box>

            {viewMode === 'yearly' ? (
                <Grid container spacing={3}>
                    <Grid sx={{width: {xs: '100%', sm: '50%', md: '33.33%'}}}>
                        <Paper sx={{p: 3, height: '100%'}}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{mb: 2}}>
                                {t('pages.vehicle.maintenance.overview.summaryMetrics.yearly.totalCost.title')}
                            </Typography>
                            <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                                ${metrics.selectedYearTotal.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" sx={{mt: 2}}>
                                {selectedYear} • {metrics.selectedYearData.length} {t('pages.vehicle.maintenance.overview.summaryMetrics.yearly.totalCost.events')}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid sx={{width: {xs: '100%', sm: '50%', md: '33.33%'}}}>
                        <Paper sx={{p: 3, height: '100%'}}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{mb: 2}}>
                                {t('pages.vehicle.maintenance.overview.summaryMetrics.yearly.byType.title')}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                <BuildIcon color="primary" sx={{mr: 1}}/>
                                <Typography variant="body1">
                                    {t('pages.vehicle.maintenance.overview.summaryMetrics.yearly.byType.preventive')}:
                                    ${metrics.preventiveCost.toFixed(2)}
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <MedicalServicesIcon color="error" sx={{mr: 1}}/>
                                <Typography variant="body1">
                                    {t('pages.vehicle.maintenance.overview.summaryMetrics.yearly.byType.curative')}:
                                    ${metrics.curativeCost.toFixed(2)}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid sx={{width: {xs: '100%', sm: '50%', md: '33.33%'}}}>
                        <Paper sx={{p: 3, height: '100%'}}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{mb: 2}}>
                                {t('pages.vehicle.maintenance.overview.summaryMetrics.yearly.yearComparison.title')}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="h4" sx={{fontWeight: 'bold', mr: 2}}>
                                    {Math.abs(metrics.changePercent).toFixed(1)}%
                                </Typography>
                                {metrics.isIncrease ? (
                                    <TrendingUpIcon color="error" fontSize="large"/>
                                ) : (
                                    <TrendingDownIcon color="success" fontSize="large"/>
                                )}
                            </Box>
                            <Typography variant="body2" sx={{mt: 2}}>
                                {metrics.isIncrease ? t('pages.vehicle.maintenance.overview.summaryMetrics.yearly.yearComparison.higher') : t('pages.vehicle.maintenance.overview.summaryMetrics.yearly.yearComparison.lower')}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                <Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography variant="h6">{monthNames[currentMonthIndex]} {selectedYear}</Typography>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <IconButton onClick={handlePrevMonth}>
                                <ChevronLeft/>
                            </IconButton>
                            <IconButton onClick={handleNextMonth}>
                                <ChevronRight/>
                            </IconButton>
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid sx={{width: {xs: '100%', sm: '50%', md: '33.33%'}}}>
                            <Paper sx={{p: 3, height: '100%'}}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{mb: 2}}>
                                    {t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.title')}
                                </Typography>
                                <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                                    ${currentMonthMetrics.total.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" sx={{mt: 2}}>
                                    {currentMonthMetrics.events} {t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.events')}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid sx={{width: {xs: '100%', sm: '50%', md: '33.33%'}}}>
                            <Paper sx={{p: 3, height: '100%'}}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{mb: 2}}>
                                    {t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.breakdown.title')}
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <BuildIcon color="primary" sx={{mr: 1}}/>
                                    <Typography variant="body1">
                                        {t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.breakdown.preventive')}:
                                        ${currentMonthMetrics.preventive.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <MedicalServicesIcon color="error" sx={{mr: 1}}/>
                                    <Typography variant="body1">
                                        {t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.breakdown.curative')}:
                                        ${currentMonthMetrics.curative.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid sx={{width: {xs: '100%', sm: '50%', md: '33.33%'}}}>
                            <Paper sx={{p: 3, height: '100%'}}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{mb: 2}}>
                                    {t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.monthChange.title')}
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Typography variant="h4" sx={{fontWeight: 'bold', mr: 2}}>
                                        {Math.abs(currentMonthMetrics.monthOverMonthChange).toFixed(1)}%
                                    </Typography>
                                    {currentMonthMetrics.isMoMIncrease ? (
                                        <TrendingUpIcon color="error" fontSize="large"/>
                                    ) : (
                                        <TrendingDownIcon color="success" fontSize="large"/>
                                    )}
                                </Box>
                                <Typography variant="body2" sx={{mt: 2}}>
                                    {currentMonthMetrics.isMoMIncrease ? t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.monthChange.higher') : t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.monthChange.lower')} {t(`pages.vehicle.maintenance.overview.summaryMetrics.months.${prevMonthName}`)}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid sx={{width: {xs: '100%', sm: '50%', md: '33.33%'}}}>
                            <Paper sx={{p: 3, height: '100%'}}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{mb: 2}}>
                                    {t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.yearChange.title')}
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Typography variant="h4" sx={{fontWeight: 'bold', mr: 2}}>
                                        {Math.abs(currentMonthMetrics.yearOverYearMonthlyChange).toFixed(1)}%
                                    </Typography>
                                    {currentMonthMetrics.isYoYIncrease ? (
                                        <TrendingUpIcon color="error" fontSize="large"/>
                                    ) : (
                                        <TrendingDownIcon color="success" fontSize="large"/>
                                    )}
                                </Box>
                                <Typography variant="body2" sx={{mt: 2}}>
                                    {currentMonthMetrics.isYoYIncrease ? t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.yearChange.higher') : t('pages.vehicle.maintenance.overview.summaryMetrics.monthly.yearChange.lower')}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default SummaryMetrics;