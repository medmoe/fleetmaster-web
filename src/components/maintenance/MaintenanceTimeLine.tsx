// src/components/maintenance/MaintenanceTimeline.tsx
import React, {useMemo} from 'react';
import {Box, Paper, Tooltip, Typography} from '@mui/material';
import {format, parseISO} from 'date-fns';
import {MaintenanceReportWithStringsType} from "@/types/maintenance";

interface MaintenanceTimelineProps {
    reports: MaintenanceReportWithStringsType[];
    selectedYear: number;
}

const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({
                                                                     reports,
                                                                     selectedYear
                                                                 }) => {
    // Filter reports to show only the selected year and previous year
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const reportYear = new Date(report.start_date).getFullYear();
            return reportYear === selectedYear || reportYear === selectedYear - 1;
        }).sort((a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );
    }, [reports, selectedYear]);

    // Get date range for the timeline
    const timelineData = useMemo(() => {
        if (filteredReports.length === 0) {
            // Default date range if no reports
            const defaultStart = new Date(selectedYear - 1, 0, 1);
            const defaultEnd = new Date(selectedYear, 11, 31);
            return {startDate: defaultStart, endDate: defaultEnd, timelineLength: defaultEnd.getTime() - defaultStart.getTime()};
        }

        const startDate = new Date(filteredReports[0].start_date);
        const endDate = new Date(filteredReports[filteredReports.length - 1].end_date);

        // Ensure the timeline spans at least the full selected year
        const yearStart = new Date(selectedYear, 0, 1);
        const yearEnd = new Date(selectedYear, 11, 31);

        const adjustedStart = startDate < yearStart ? startDate : yearStart;
        const adjustedEnd = endDate > yearEnd ? endDate : yearEnd;

        return {
            startDate: adjustedStart,
            endDate: adjustedEnd,
            timelineLength: adjustedEnd.getTime() - adjustedStart.getTime()
        };
    }, [filteredReports, selectedYear]);

    if (filteredReports.length === 0) {
        return (
            <Paper className="p-4">
                <Typography>No maintenance events found for the selected timeframe.</Typography>
            </Paper>
        );
    }

    return (
        <Paper className="p-4">
            <Box className="relative h-24 mb-2">
                {/* Timeline bar */}
                <Box className="absolute h-2 bg-gray-200 w-full top-1/2 transform -translate-y-1/2"></Box>

                {/* Year markers */}
                <Box
                    className="absolute w-1 h-4 bg-gray-400 top-1/2 transform -translate-y-1/2"
                    style={{
                        left: `${((new Date(selectedYear - 1, 0, 1).getTime() - timelineData.startDate.getTime()) / timelineData.timelineLength) * 100}%`
                    }}
                />
                <Box
                    className="absolute w-1 h-4 bg-gray-400 top-1/2 transform -translate-y-1/2"
                    style={{
                        left: `${((new Date(selectedYear, 0, 1).getTime() - timelineData.startDate.getTime()) / timelineData.timelineLength) * 100}%`
                    }}
                />

                {/* Maintenance events */}
                {filteredReports.map(report => {
                    const reportDate = new Date(report.start_date);
                    const position = ((reportDate.getTime() - timelineData.startDate.getTime()) / timelineData.timelineLength) * 100;

                    return (
                        <Tooltip
                            key={report.id}
                            title={
                                <React.Fragment>
                                    <Typography variant="body2">{format(parseISO(report.start_date), 'MMM d, yyyy')}</Typography>
                                    <Typography variant="body2">{report.maintenance_type}</Typography>
                                    <Typography variant="body2">${report.total_cost}</Typography>
                                    <Typography variant="body2">{report.description}</Typography>
                                </React.Fragment>
                            }
                        >
                            <Box
                                className={`absolute w-6 h-6 rounded-full -ml-3 flex items-center justify-center cursor-pointer
                  ${report.maintenance_type === 'PREVENTIVE' ? 'bg-blue-500' : 'bg-red-500'}`}
                                style={{left: `${position}%`, top: '50%', transform: 'translateY(-50%)'}}
                            >
                                <Typography variant="caption" className="text-white font-bold">
                                    {report.maintenance_type === 'PREVENTIVE' ? 'P' : 'C'}
                                </Typography>
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>

            {/* Timeline labels */}
            <Box className="flex justify-between text-xs text-gray-500">
                <span>{format(timelineData.startDate, 'MMM yyyy')}</span>
                <span>{format(new Date(selectedYear - 1, 6, 1), 'MMM yyyy')}</span>
                <span>{format(new Date(selectedYear, 6, 1), 'MMM yyyy')}</span>
                <span>{format(timelineData.endDate, 'MMM yyyy')}</span>
            </Box>

            {/* Legend */}
            <Box className="flex mt-4 gap-4 justify-center">
                <Box className="flex items-center">
                    <Box className="w-4 h-4 bg-blue-500 rounded-full mr-2"></Box>
                    <Typography variant="body2">Preventive</Typography>
                </Box>
                <Box className="flex items-center">
                    <Box className="w-4 h-4 bg-red-500 rounded-full mr-2"></Box>
                    <Typography variant="body2">Curative</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default MaintenanceTimeline;