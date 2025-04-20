// src/components/maintenance/YearlyComparisonChart.tsx
import React, {useMemo} from 'react';
import {Box, Paper} from '@mui/material';
import {parseISO} from 'date-fns';
import {MaintenanceReportWithStringsType} from "@/types/maintenance";
import {useTranslation} from "react-i18next";

interface YearlyComparisonChartProps {
    currentYearData: MaintenanceReportWithStringsType[];
    prevYearData: MaintenanceReportWithStringsType[];
    selectedYear: number;
}

const YearlyComparisonChart: React.FC<YearlyComparisonChartProps> = ({
                                                                         currentYearData,
                                                                         prevYearData,
                                                                         selectedYear
                                                                     }) => {
    // Prepare data for chart - monthly costs for current and previous year
    const chartData = useMemo(() => {
        const months = Array.from({length: 12}, (_, i) => i);

        // Initialize monthly costs
        const currentYearMonthlyCosts = Array(12).fill(0);
        const prevYearMonthlyCosts = Array(12).fill(0);

        // Aggregate current year data by month
        currentYearData.forEach(report => {
            const date = parseISO(report.start_date);
            const month = date.getMonth();
            const cost = parseFloat(report.total_cost || '0') || 0;
            currentYearMonthlyCosts[month] += cost;
        });

        // Aggregate previous year data by month
        prevYearData.forEach(report => {
            const date = parseISO(report.start_date);
            const month = date.getMonth();
            const cost = parseFloat(report.total_cost || '0') || 0;
            prevYearMonthlyCosts[month] += cost;
        });

        // Find maximum value for scaling
        const maxValue = Math.max(
            ...currentYearMonthlyCosts,
            ...prevYearMonthlyCosts,
            1  // Ensure at least 1 to avoid division by zero
        );

        return {
            months,
            currentYearMonthlyCosts,
            prevYearMonthlyCosts,
            maxValue,
            currentYear: selectedYear,
            prevYear: selectedYear - 1
        };
    }, [currentYearData, prevYearData, selectedYear]);

    const monthAbbreviations = [
        'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ]
    const {t} = useTranslation();

    return (
        <Paper className="p-4">
            <Box className="flex flex-col h-64">
                <Box className="flex h-full">
                    {/* Y-axis */}
                    <Box className="w-16 flex flex-col justify-between pr-2 text-right text-sm text-gray-500">
                        <span>${chartData.maxValue.toFixed(0)}</span>
                        <span>${(chartData.maxValue * 0.75).toFixed(0)}</span>
                        <span>${(chartData.maxValue * 0.5).toFixed(0)}</span>
                        <span>${(chartData.maxValue * 0.25).toFixed(0)}</span>
                        <span>$0</span>
                    </Box>

                    {/* Chart bars */}
                    <Box className="flex-1 flex items-end">
                        {chartData.months.map(month => {
                            const currentYearHeight =
                                (chartData.currentYearMonthlyCosts[month] / chartData.maxValue) * 100;

                            const prevYearHeight =
                                (chartData.prevYearMonthlyCosts[month] / chartData.maxValue) * 100;

                            return (
                                <Box key={month} className="flex-1 flex justify-center gap-1">
                                    <Box
                                        className="w-5 bg-blue-500"
                                        style={{height: `${currentYearHeight}%`}}
                                        title={`${chartData.currentYear}: $${chartData.currentYearMonthlyCosts[month].toFixed(2)}`}
                                    />
                                    <Box
                                        className="w-5 bg-gray-300"
                                        style={{height: `${prevYearHeight}%`}}
                                        title={`${chartData.prevYear}: $${chartData.prevYearMonthlyCosts[month].toFixed(2)}`}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* X-axis month labels */}
                <Box className="flex mt-2 text-xs text-gray-500">
                    <Box className="w-16"></Box>
                    <Box className="flex-1 flex">
                        {chartData.months.map(month => (
                            <Box key={month} className="flex-1 text-center">
                                {t(`pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.${monthAbbreviations[month]}`)}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Legend */}
                <Box className="flex justify-center mt-4 gap-4">
                    <Box className="flex items-center">
                        <Box className="w-4 h-4 bg-blue-500 mr-2"></Box>
                        <span>{chartData.currentYear} {t('pages.vehicle.maintenance.overview.yearlyComparisonChart.legend.currentYear')}</span>
                    </Box>
                    <Box className="flex items-center">
                        <Box className="w-4 h-4 bg-gray-300 mr-2"></Box>
                        <span>{chartData.prevYear} {t('pages.vehicle.maintenance.overview.yearlyComparisonChart.legend.prevYear')}</span>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default YearlyComparisonChart;