// src/pages/MaintenanceOverview.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {Box, CircularProgress, Container, Paper, Tab, Tabs, Typography} from '@mui/material';
import {MaintenanceReportsList, MaintenanceTimeLine, SummaryMetrics, VehicleInformationPanel, YearlyComparisonChart} from "../../../../components";
import useGeneralDataStore from "../../../../store/useGeneralDataStore";
import {useTranslation} from "react-i18next";
import {NotificationBar} from "@/components";

const MaintenanceOverview: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const prevYear = currentYear - 1;
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const {t} = useTranslation();
    const {fetchMaintenanceReports, maintenanceReports, isLoading, vehicle, snackbar, setSnackbar} = useGeneralDataStore();

    useEffect(() => {
        fetchMaintenanceReports();
    }, [])

    // Filter data for the current and previous years
    const filteredData = useMemo(() => {
        if (!maintenanceReports) return {currentYearData: [], prevYearData: []};

        const currentYearData = maintenanceReports.filter(report => {
            const reportYear = new Date(report.start_date).getFullYear();
            return reportYear === currentYear;
        });

        const prevYearData = maintenanceReports.filter(report => {
            const reportYear = new Date(report.start_date).getFullYear();
            return reportYear === prevYear;
        });

        return {currentYearData, prevYearData};
    }, [maintenanceReports, currentYear, prevYear]);

    // Get selected year data
    const selectedYearData = useMemo(() => {
        if (!maintenanceReports) return [];

        return maintenanceReports.filter(report => {
            const reportYear = new Date(report.start_date).getFullYear();
            return reportYear === selectedYear;
        });
    }, [maintenanceReports, selectedYear]);

    // Handle year tab change
    const handleYearChange = (_: React.SyntheticEvent, newYear: number) => {
        setSelectedYear(newYear);
    };

    return (
        <Container maxWidth="lg" className="py-8">
            <Paper className="p-6 mb-6">
                <Typography variant="h4" component="h1" className="font-bold mb-6">{t('pages.vehicle.maintenance.overview.title')}</Typography>
                <VehicleInformationPanel vehicle={vehicle}
                />
                <Tabs
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="mb-6"
                >
                    <Tab label={`${currentYear}`} value={currentYear}/>
                    <Tab label={`${prevYear}`} value={prevYear}/>
                </Tabs>

                {isLoading ? (
                    <Box className="flex items-center justify-center">
                        <CircularProgress color="primary" size={24} thickness={5}/>
                    </Box>
                ) : (
                    <Box>
                        <SummaryMetrics
                            currentYearData={filteredData.currentYearData}
                            prevYearData={filteredData.prevYearData}
                            selectedYear={selectedYear}
                        />

                        <Box className="my-8">
                            <Typography variant="h6" className="mb-4">{t('pages.vehicle.maintenance.overview.yearlyComparisonChart.title')}</Typography>
                            <YearlyComparisonChart
                                currentYearData={filteredData.currentYearData}
                                prevYearData={filteredData.prevYearData}
                                selectedYear={currentYear}
                            />
                        </Box>

                        <Box className="my-8">
                            <Typography variant="h6" className="mb-4">{t('pages.vehicle.maintenance.overview.timeline.title')}</Typography>
                            <MaintenanceTimeLine
                                reports={maintenanceReports || []}
                                selectedYear={selectedYear}
                            />
                        </Box>

                        <Box className="my-8">
                            <Typography variant="h6" className="mb-4">{t('pages.vehicle.maintenance.overview.reports.title')}</Typography>
                            {/* Your existing reports list component */}
                            <MaintenanceReportsList reports={selectedYearData}
                                                    setOpenSnackBar={() => false}
                                                    openSnackbar={false}
                                                    snackBarMessage=""
                                                    setShowReportsList={() => false}
                                                    showBackButton={false}
                            />
                        </Box>
                    </Box>
                )}
            </Paper>
            <NotificationBar snackbar={snackbar} setSnackbar={setSnackbar}/>
        </Container>
    );
};

export default MaintenanceOverview;