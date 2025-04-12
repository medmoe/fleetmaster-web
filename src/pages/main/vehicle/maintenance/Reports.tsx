import {useEffect, useMemo, useState} from "react";
import useGeneralDataStore from "../../../../store/useGeneralDataStore.ts";
import {DateCalendar} from "@mui/x-date-pickers/DateCalendar";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Badge, Box, Button, Paper, Typography} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {format, isSameDay, parseISO} from "date-fns";
import {PickersDay, PickersDayProps} from "@mui/x-date-pickers/PickersDay";
import {
    MaintenanceReportType,
    MaintenanceReportWithStringsType,
    PartPurchaseEventWithNumbersType,
    ServiceProviderEventWithNumbersType
} from "../../../../types/maintenance.ts";
import {MaintenanceReportsList, NewMaintenanceReportDialog} from "../../../../components";
import {getLocalDateString} from "../../../../utils/common.ts";

const MaintenanceOverview = () => {
    const {fetchMaintenanceReports, maintenanceReports, isLoading} = useGeneralDataStore();
    const [selectedReports, setSelectedReports] = useState<MaintenanceReportType[]>([])
    const [showReportsList, setShowReportsList] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [maintenanceReportFormData, setMaintenanceReportFormData] = useState<MaintenanceReportWithStringsType>({
        maintenance_type: "PREVENTIVE",
        start_date: getLocalDateString(new Date()),
        end_date: getLocalDateString(new Date()),
        mileage: maintenanceReports.length > 0 ? maintenanceReports[0].mileage : "Unknown",
        description: "",
        part_purchase_events: [],
        service_provider_events: [],
    })
    const [partPurchaseEvent, setPartPurchaseEvent] = useState<PartPurchaseEventWithNumbersType>({
        part: "",
        provider: "",
        purchase_date: "",
        cost: "0",
    })
    const [serviceProviderEvent, setServiceProviderEvent] = useState<ServiceProviderEventWithNumbersType>({
        service_provider: "",
        service_date: "",
        cost: "0",
        description: ""
    })
    useEffect(() => {
        fetchMaintenanceReports();
    }, [fetchMaintenanceReports]);

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
                color="primary"
                sx={{
                    '& .MuiBadge-badge': {
                        fontSize: '0.65rem',
                        height: '1.2rem',
                        minWidth: '1.2rem',
                    }
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
        setSelectedReports(reportsOnDay);
        setShowReportsList(true);
        setSelectedDate(date);
    };

    const handleAddingNewReport = () => {
        setOpenFormDialog(true);
    }

    const handlePartPurchaseChange = (name: string, value: string) => {
        setPartPurchaseEvent({
            ...partPurchaseEvent,
            [name]: value,
        })
    }
    const handleServiceProviderChange = (name: string, value: string) => {
        setServiceProviderEvent({
            ...serviceProviderEvent,
            [name]: value,
        })
    }
    const handleAddPartPurchase = () => {
        setMaintenanceReportFormData({
            ...maintenanceReportFormData,
            part_purchase_events: [...maintenanceReportFormData.part_purchase_events, partPurchaseEvent]
        })
    }
    const handleAddServiceEvent = () => {
        setMaintenanceReportFormData({
            ...maintenanceReportFormData,
            service_provider_events: [...maintenanceReportFormData.service_provider_events, serviceProviderEvent]
        })
    }
    const handleRemovePartPurchase = (idx: number) => {
        setMaintenanceReportFormData({
            ...maintenanceReportFormData,
            part_purchase_events: maintenanceReportFormData.part_purchase_events.filter((_, i) => i !== idx)
        })
    }
    const handleRemoveServiceEvent = (idx: number) => {
        setMaintenanceReportFormData({
            ...maintenanceReportFormData,
            service_provider_events: maintenanceReportFormData.service_provider_events.filter((_, i) => i !== idx)
        })
    }
    const handleMaintenanceReportFormChange = (name: string, value: string) => {
        setMaintenanceReportFormData({
            ...maintenanceReportFormData,
            [name]: value,
        })
    }
    return (
        <>
            {showReportsList ? <MaintenanceReportsList reports={selectedReports}
                                                       onDeleteReport={() => console.log("Delete report")}
                                                       onEditReport={() => console.log("Edit report")}
                                                       setShowReportsList={setShowReportsList}
                /> :
                <Paper sx={{p: 3, borderRadius: 2, boxShadow: 3}}>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                        <Typography variant="h5" sx={{mb: 3}}>Maintenance Overview</Typography>
                        <Button variant={"contained"}
                                startIcon={<AddIcon/>}
                                onClick={handleAddingNewReport}
                                sx={{backgroundColor: '#3f51b5', '&:hover': {backgroundColor: '#3847a3'}}}
                        >
                            New Report
                        </Button>
                    </Box>

                    {isLoading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                            <Typography>Loading maintenance data...</Typography>
                        </Box>
                    ) : (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateCalendar
                                slots={{
                                    day: ServerDay // Use our properly typed component
                                }}
                                value={selectedDate}
                                onChange={handleDateClick}
                                sx={{
                                    width: '100%',
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
                    )}

                    <Box sx={{mt: 2, display: 'flex', alignItems: 'center'}}>
                        <Badge color="primary" badgeContent=" " sx={{mr: 2}}/>
                        <Typography variant="body2">
                            Dates with badges indicate scheduled maintenance activities
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{mt: 2, color: 'text.secondary'}}>
                        Total maintenance records: {maintenanceReports?.length || 0}
                    </Typography>
                </Paper>
            }
            <NewMaintenanceReportDialog open={openFormDialog}
                                        onClose={() => setOpenFormDialog(false)}
                                        partPurchaseEvent={partPurchaseEvent}
                                        serviceProviderEvent={serviceProviderEvent}
                                        handleServiceProviderChange={handleServiceProviderChange}
                                        handlePartPurchaseChange={handlePartPurchaseChange}
                                        handleAddPartPurchase={handleAddPartPurchase}
                                        handleAddServiceEvent={handleAddServiceEvent}
                                        maintenanceReportFormData={maintenanceReportFormData}
                                        handleMaintenanceReportSubmission={() => console.log("Submit report")}
                                        handleRemovePartPurchase={handleRemovePartPurchase}
                                        handleRemoveServiceEvent={handleRemoveServiceEvent}
                                        handleMaintenanceReportFormChange={handleMaintenanceReportFormChange}

            />
        </>

    );
};

export default MaintenanceOverview;