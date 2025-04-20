// src/components/maintenance/MaintenanceTimeline.tsx
import React, {useMemo} from 'react';
import {Box, Paper, Tooltip, Typography} from '@mui/material';
import {parseISO} from 'date-fns';
import {MaintenanceReportWithStringsType} from "@/types/maintenance";
import {useTranslation} from 'react-i18next';

interface MaintenanceTimelineProps {
    reports: MaintenanceReportWithStringsType[];
    selectedYear: number;
}

const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({
                                                                     reports,
                                                                     selectedYear
                                                                 }) => {
    const {t, i18n} = useTranslation();
    const isRtl = i18n.language === 'ar';

    // Month names array for translating dates
    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    // Format a date in a localized way
    const formatMonthYear = (date: Date) => {
        const month = monthNames[date.getMonth()].toLowerCase();
        return `${t(`pages.vehicle.maintenance.overview.summaryMetrics.months.${month}`)} ${date.getFullYear()}`;
    };

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
                <Typography>{t('pages.vehicle.maintenance.overview.timeline.noEvents')}</Typography>
            </Paper>
        );
    }

    // Format date for tooltip
    const formatDateForTooltip = (dateString: string) => {
        const date = parseISO(dateString);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        // Use the month name from translations
        const monthName = t(`pages.vehicle.maintenance.overview.summaryMetrics.months.${monthNames[monthIndex].toLowerCase()}`);

        // Format based on language direction
        return isRtl
            ? `${day} ${monthName} ${year}` // Arabic format
            : `${monthName} ${day}, ${year}`; // English format
    };

    return (
        <Paper className="p-4">
            {/* Timeline container */}
            <Box className="relative h-24 mb-2" dir={isRtl ? 'rtl' : 'ltr'}>
                {/* Timeline bar */}
                <Box className="absolute h-2 bg-gray-200 w-full top-1/2 transform -translate-y-1/2"></Box>

                {/* Year markers */}
                <Box
                    className="absolute w-1 h-4 bg-gray-400 top-1/2 transform -translate-y-1/2"
                    style={{
                        [isRtl ? 'right' : 'left']: `${((new Date(selectedYear - 1, 0, 1).getTime() - timelineData.startDate.getTime()) / timelineData.timelineLength) * 100}%`
                    }}
                />
                <Box
                    className="absolute w-1 h-4 bg-gray-400 top-1/2 transform -translate-y-1/2"
                    style={{
                        [isRtl ? 'right' : 'left']: `${((new Date(selectedYear, 0, 1).getTime() - timelineData.startDate.getTime()) / timelineData.timelineLength) * 100}%`
                    }}
                />

                {/* Maintenance events */}
                {filteredReports.map(report => {
                    const reportDate = new Date(report.start_date);
                    const position = ((reportDate.getTime() - timelineData.startDate.getTime()) / timelineData.timelineLength) * 100;
                    const isPreventive = report.maintenance_type === 'PREVENTIVE';

                    return (
                        <Tooltip
                            key={report.id}
                            title={
                                <div dir={isRtl ? 'rtl' : 'ltr'} style={{textAlign: isRtl ? 'right' : 'left'}}>
                                    <Typography variant="body2">
                                        {t('pages.vehicle.maintenance.overview.timeline.tooltip.date')}: {formatDateForTooltip(report.start_date)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {t('pages.vehicle.maintenance.overview.timeline.tooltip.type')}: {isPreventive ?
                                        t('pages.vehicle.maintenance.overview.timeline.legend.preventive') :
                                        t('pages.vehicle.maintenance.overview.timeline.legend.curative')}
                                    </Typography>
                                    <Typography variant="body2">
                                        {t('pages.vehicle.maintenance.overview.timeline.tooltip.cost')}:
                                        ${report.total_cost}
                                    </Typography>
                                    <Typography variant="body2">
                                        {t('pages.vehicle.maintenance.overview.timeline.tooltip.description')}: {report.description}
                                    </Typography>
                                </div>
                            }
                            placement={isRtl ? "top-end" : "top-start"}
                            arrow
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        direction: isRtl ? 'rtl' : 'ltr',
                                        maxWidth: 300
                                    }
                                }
                            }}
                        >
                            <Box
                                className={`absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer
                                ${isPreventive ? 'bg-blue-500' : 'bg-red-500'}`}
                                style={{
                                    [isRtl ? 'right' : 'left']: `${position}%`,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    margin: isRtl ? '0 -0.75rem 0 0' : '0 0 0 -0.75rem'
                                }}
                            >
                                <Typography variant="caption" className="text-white font-bold">
                                    {isPreventive ?
                                        t('pages.vehicle.maintenance.overview.timeline.preventiveLabel') :
                                        t('pages.vehicle.maintenance.overview.timeline.curativeLabel')}
                                </Typography>
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>

            {/* Timeline labels */}
            <Box className="flex justify-between text-xs text-gray-500" dir={isRtl ? 'rtl' : 'ltr'}>
                <span>{formatMonthYear(timelineData.startDate)}</span>
                <span>{formatMonthYear(new Date(selectedYear - 1, 6, 1))}</span>
                <span>{formatMonthYear(new Date(selectedYear, 6, 1))}</span>
                <span>{formatMonthYear(timelineData.endDate)}</span>
            </Box>

            {/* Legend */}
            <Box className="flex mt-4 gap-4 justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
                <Box className="flex items-center">
                    <Box className="w-4 h-4 bg-blue-500 rounded-full mr-2"></Box>
                    <Typography variant="body2">{t('pages.vehicle.maintenance.overview.timeline.legend.preventive')}</Typography>
                </Box>
                <Box className="flex items-center">
                    <Box className="w-4 h-4 bg-red-500 rounded-full mr-2"></Box>
                    <Typography variant="body2">{t('pages.vehicle.maintenance.overview.timeline.legend.curative')}</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default MaintenanceTimeline;