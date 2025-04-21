import {useMemo, useState} from "react";
import useGeneralDataStore from "../../../../store/useGeneralDataStore";
import {DateCalendar} from "@mui/x-date-pickers/DateCalendar";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Alert, Badge, Box, Button, Paper, Snackbar, Typography} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {format, isSameDay, parseISO} from "date-fns";
import {PickersDay, PickersDayProps} from "@mui/x-date-pickers/PickersDay";
import {MaintenanceReportWithStringsType} from "@/types/maintenance";
import {MaintenanceReportsList, NewMaintenanceReportDialog} from "../../../../components";
import {useMaintenanceReport} from "@/hooks/maintenance/useMaintenanceReport";
import {useTranslation} from "react-i18next";


const Reports = () => {
    const {t, i18n} = useTranslation();
    const {maintenanceReports, setRequest} = useGeneralDataStore();
    const [selectedReports, setSelectedReports] = useState<MaintenanceReportWithStringsType[]>([])
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showReportsList, setShowReportsList] = useState(false);
    const [openSnackbar, setOpenSnackBar] = useState(false);
    const {
        error,
        handleAddPartPurchase,
        handleAddServiceEvent,
        handleMaintenanceReportFormChange,
        handleMaintenanceReportSubmission,
        handlePartPurchaseChange,
        handleRemovePartPurchase,
        handleRemoveServiceEvent,
        handleServiceProviderChange,
        isLoading,
        maintenanceReportFormData,
        openFormDialog,
        partPurchaseEvent,
        serviceProviderEvent,
        setError,
        setOpenFormDialog,
        request,
    } = useMaintenanceReport(undefined, setOpenSnackBar)

    // Group reports by date
    const reportsByDate = useMemo(() => {
        if (!maintenanceReports || maintenanceReports.length === 0) return {};

        const grouped: Record<string, number> = {};

        maintenanceReports.forEach(report => {
            if (!report.start_date) return;

            // Format to YYYY-MM-DD to normalize time
            const dateKey = format(parseISO(report.start_date), 'yyyy-MM-dd');

            if (!grouped[dateKey]) {
                grouped[dateKey] = 0;
            }

            grouped[dateKey] += 1;
        });

        return grouped;
    }, [maintenanceReports]);

    // Create a properly typed day renderer component
    const ServerDay = (props: PickersDayProps<Date>) => {
        const {day, outsideCurrentMonth, ...other} = props;
        const dateStr = format(day, 'yyyy-MM-dd');
        const hasReports = reportsByDate[dateStr] && reportsByDate[dateStr] > 0;

        // Skip badges for days outside current month
        if (outsideCurrentMonth) {
            return <PickersDay day={day} outsideCurrentMonth={outsideCurrentMonth} {...other} />;
        }

        return (
            <Badge
                key={day.toString()}
                overlap="circular"
                badgeContent={hasReports ? reportsByDate[dateStr] : undefined}
                sx={{
                    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                    '& .MuiBadge-badge': {
                        fontSize: '0.65rem',
                        height: '1.2rem',
                        minWidth: '1.2rem',
                        backgroundColor: "#ffa726",
                    },
                }}
            >
                <PickersDay day={day} outsideCurrentMonth={false} {...other} />
            </Badge>
        );
    };

    // Handle date selection
    const handleDateClick = (date: Date) => {
        if (selectedDate.getFullYear() !== date.getFullYear()) {
            setSelectedReports([]);
            setShowReportsList(false);
            setSelectedDate(new Date(date.getFullYear(), 0, 1));
            return;
        }
        const reportsOnDay = maintenanceReports.filter(report =>
            report.start_date && isSameDay(parseISO(report.start_date), date)
        );
        if (reportsOnDay.length === 0) {
            return
        }
        setSelectedReports(reportsOnDay);
        setShowReportsList(true);
        setSelectedDate(date);
    };

    const handleAddingNewReport = () => {
        setOpenFormDialog(true);
        setRequest('add');
    }

    const getSnackBarMessage = () => {
        switch (request) {
            case 'add':
                return t('pages.vehicle.maintenance.reports.snack.add');
            case 'edit':
                return t('pages.vehicle.maintenance.reports.snack.edit');
            case 'delete':
                return t('pages.vehicle.maintenance.reports.snack.delete');
            default:
                return '';
        }
    }


    return (
        <div>
            {showReportsList ? <MaintenanceReportsList reports={selectedReports}
                                                       setOpenSnackBar={setOpenSnackBar}
                                                       openSnackbar={openSnackbar}
                                                       snackBarMessage={getSnackBarMessage()}
                                                       setShowReportsList={setShowReportsList}
                                                       showBackButton={true}
                /> :
                <Paper sx={{p: 3, borderRadius: 2, boxShadow: 3}}>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                        <Typography variant="h5" sx={{mb: 3}}>{t('pages.vehicle.maintenance.reports.title')}</Typography>
                        <Button variant={"contained"}
                                startIcon={<AddIcon/>}
                                onClick={handleAddingNewReport}
                                sx={{backgroundColor: '#3f51b5', '&:hover': {backgroundColor: '#3847a3'}}}
                        >
                            {t('pages.vehicle.maintenance.reports.addButton')}
                        </Button>
                    </Box>
                    <Snackbar open={openSnackbar}
                              autoHideDuration={6000}
                              onClose={() => {
                                  setOpenSnackBar(false);
                                  setRequest('idle');
                              }}
                              anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    >
                        <Alert onClose={() => setOpenSnackBar(false)} severity="success" sx={{width: '100%'}} variant="filled">
                            {getSnackBarMessage()}
                        </Alert>
                    </Snackbar>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateCalendar
                            slots={{
                                day: ServerDay // Use our properly typed component
                            }}
                            value={selectedDate}
                            onChange={handleDateClick}
                            sx={{
                                width: '100%',
                                direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                                '& .MuiDayCalendar-weekDayLabel': {
                                    color: 'primary.main',
                                    fontWeight: 'bold'
                                },
                                '& .MuiPickersDay-root': {
                                    fontSize: '0.9rem',
                                    margin: '2px'
                                },
                            }}
                        />
                    </LocalizationProvider>

                    <Box sx={{mt: 2, display: 'flex', alignItems: 'center'}}>
                        <Badge badgeContent=" " sx={{
                            mr: 2,
                            '& .MuiBadge-badge': {fontSize: '0.65rem', height: '1.2rem', minWidth: '1.2rem', backgroundColor: "#ffa726",}
                        }}/>
                        <Typography variant="body2">
                            {t('pages.vehicle.maintenance.reports.badgeText')}
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{mt: 2, color: 'text.secondary'}}>
                        {t('pages.vehicle.maintenance.reports.count')}: {maintenanceReports?.length || 0}
                    </Typography>
                </Paper>
            }
            <NewMaintenanceReportDialog open={openFormDialog}
                                        onClose={() => {
                                            setOpenFormDialog(false);
                                            setRequest('idle');
                                        }}
                                        partPurchaseEvent={partPurchaseEvent}
                                        serviceProviderEvent={serviceProviderEvent}
                                        handleServiceProviderChange={handleServiceProviderChange}
                                        handlePartPurchaseChange={handlePartPurchaseChange}
                                        handleAddPartPurchase={handleAddPartPurchase}
                                        handleAddServiceEvent={handleAddServiceEvent}
                                        maintenanceReportFormData={maintenanceReportFormData}
                                        handleMaintenanceReportSubmission={handleMaintenanceReportSubmission}
                                        handleRemovePartPurchase={handleRemovePartPurchase}
                                        handleRemoveServiceEvent={handleRemoveServiceEvent}
                                        handleMaintenanceReportFormChange={handleMaintenanceReportFormChange}
                                        isLoading={isLoading}
                                        errorState={error}
                                        handleErrorClosing={() => setError({isError: false, message: ""})}

            />
        </div>

    );
};

export default Reports;