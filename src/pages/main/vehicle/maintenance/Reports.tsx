import {useEffect, useRef, useState} from "react";
import useGeneralDataStore from "../../../../store/useGeneralDataStore";
import {DateCalendar} from "@mui/x-date-pickers/DateCalendar";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Alert, Badge, Box, Button, Container, LinearProgress, Snackbar, Typography} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {format, parse} from "date-fns";
import {PickersDay, PickersDayProps} from "@mui/x-date-pickers/PickersDay";
import {MaintenanceReportWithStringsType} from "@/types/maintenance";
import {MaintenanceReportsList, NewMaintenanceReportDialog} from "../../../../components";
import {useMaintenanceReport} from "@/hooks/maintenance/useMaintenanceReport";
import {useTranslation} from "react-i18next";
import {API} from "@/constants/endpoints.ts";
import axios from "axios";


const Reports = () => {
    const {t, i18n} = useTranslation();
    const {vehicle} = useGeneralDataStore();
    const {setRequest} = useGeneralDataStore();
    const [openSnackbar, setOpenSnackBar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM')) // YYYY-MM format
    const [vehicleReports, setVehicleReports] = useState<MaintenanceReportWithStringsType[]>([])
    const [reportsCount, setReportsCount] = useState<number>(0);
    const [loadingVehicleReports, setLoadingVehicleReports] = useState<boolean>(false);
    const reportRefs = useRef<Map<string, HTMLDivElement>>(new Map());
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

    useEffect(() => {
        const fetchReports = async () => {
            setLoadingVehicleReports(true);
            try {
                const options = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
                const url = `${API}maintenance/reports/vehicle/${vehicle?.id}/?month=${currentMonth}`;
                const response = await axios.get(url, options);
                setVehicleReports(response.data.results);
                setReportsCount(response.data.count);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingVehicleReports(false);
            }
        }
        fetchReports();
    }, [currentMonth])


    // Create a properly typed day renderer component
    const ServerDay = (props: PickersDayProps<Date>) => {
        const {day, outsideCurrentMonth, ...other} = props;
        const dateStr = format(day, 'yyyy-MM-dd');

        const hasReports = vehicleReports.some(report => report.start_date === dateStr);
        // Skip badges for days outside current month
        if (outsideCurrentMonth) {
            return <PickersDay day={day} outsideCurrentMonth={outsideCurrentMonth} {...other} />;
        }

        return (
            <Badge
                key={day.toString()}
                overlap="circular"
                badgeContent={hasReports ? ' ' : null}
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
        const dateStr = format(date, 'yyyy-MM-dd');
        const reportsForDate = vehicleReports.filter(report => report.start_date === dateStr);

        if (reportsForDate.length > 0) {
            const reportId = reportsForDate[0].id;
            const reportElement = reportRefs.current.get(reportId as string);
            if (reportElement) {
                reportElement.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }
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

    const handleMonthChange = (month: Date) => {
        setCurrentMonth(format(month, 'yyyy-MM'));
    }


    return (
        <div>
            <Container sx={{p: 3, borderRadius: 2, boxShadow: 3}} maxWidth={"lg"}>
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
                    <Alert onClose={() => setOpenSnackBar(false)} severity="success" sx={{width: '100%', color: 'white'}} variant="filled">
                        {getSnackBarMessage()}
                    </Alert>
                </Snackbar>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateCalendar
                        slots={{
                            day: ServerDay // Use our properly typed component
                        }}
                        value={null}
                        onChange={handleDateClick}
                        onMonthChange={handleMonthChange}
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
                    {t('pages.vehicle.maintenance.reports.count')}: {reportsCount}
                </Typography>
            </Container>
            <Container sx={{p: 3, marginTop: 3}} maxWidth={"lg"}>
                {loadingVehicleReports && <LinearProgress/>}
                <MaintenanceReportsList reports={vehicleReports}
                                        setOpenSnackBar={setOpenSnackBar}
                                        openSnackbar={openSnackbar}
                                        snackBarMessage={getSnackBarMessage()}
                                        reportRefs={reportRefs}
                />
            </Container>

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