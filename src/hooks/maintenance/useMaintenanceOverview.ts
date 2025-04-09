import {useCallback, useReducer, useState} from "react";
import {FilteredReportPeriodType, MaintenanceReportType, MaintenanceReportWithStringsType} from "../../types/maintenance.ts";
import {getMaintenanceReportDatesInitialState, getMaintenanceReportFormInitialState} from "./initialStates.ts";
import {VehicleType} from "../../types/types.ts";
import {API} from "../../constants/endpoints.ts";
import axios from "axios";
import {getLocalDateString, isPositiveInteger} from "../../utils/common.ts";
import {MaintenanceOverviewProps} from "../../pages/main/vehicle/maintenance/MaintenanceOverview.tsx";
import {filterReports, insertReport} from "../../utils/maintenance/maintenance.ts";
import {useNavigate} from "react-router-dom";

// View state reducer
type ViewState = {
    showSelectedReports: boolean;
    showMaintenanceReport: boolean;
    showServiceProviderEventForm: boolean;
    showPartPurchaseEventForm: boolean;
};

type ViewAction =
    | { type: 'SHOW_SELECTED_REPORTS' }
    | { type: 'SHOW_MAINTENANCE_REPORT' }
    | { type: 'SHOW_SERVICE_PROVIDER_FORM' }
    | { type: 'SHOW_PART_PURCHASE_FORM' }
    | { type: 'RESET' };

export type SetViewType = {
    showSelectedReports: () => void;
    showMaintenanceReport: () => void;
    showServiceProviderEventForm: () => void;
    showPartPurchaseEventForm: () => void;
    reset: () => void;
};

const viewReducer = (state: ViewState, action: ViewAction): ViewState => {
    const resetState = {
        showSelectedReports: false,
        showMaintenanceReport: false,
        showServiceProviderEventForm: false,
        showPartPurchaseEventForm: false,
    };

    switch (action.type) {
        case 'SHOW_SELECTED_REPORTS':
            return {...resetState, showSelectedReports: true};
        case 'SHOW_MAINTENANCE_REPORT':
            return {...resetState, showMaintenanceReport: true};
        case 'SHOW_SERVICE_PROVIDER_FORM':
            return {...resetState, showServiceProviderEventForm: true};
        case 'SHOW_PART_PURCHASE_FORM':
            return {...resetState, showPartPurchaseEventForm: true};
        case 'RESET':
            return resetState;
        default:
            return state;
    }
};

export const useMaintenanceOverview = (
    vehicle: VehicleType,
    maintenanceReports: MaintenanceReportWithStringsType[],
    setMaintenanceReports: (maintenanceReports: MaintenanceReportWithStringsType[]) => void,
    props?: MaintenanceOverviewProps) => {
    const navigate = useNavigate();
    const [maintenanceReportDates, setMaintenanceReportDates] = useState(getMaintenanceReportDatesInitialState(props?.maintenanceReportFormData))
    const [showMaintenanceForm, setShowMaintenanceForm] = useState(props?.showMaintenanceForm || false)
    const [activeFilter, setActiveFilter] = useState(4) // ["7D", "2W", "4W", "3M", "1Y"] initial range is 1 year
    const [isMaintenanceReportPutRequest, setIsMaintenanceReportPutRequest] = useState(props?.isMaintenanceReportPutRequest || false)
    const [monthlyReports, setMonthlyReports] = useState<MaintenanceReportWithStringsType[]>(maintenanceReports.filter(report => report.start_date.substring(0, 4) === new Date().getFullYear().toString()));
    const [selectedReports, setSelectedReports] = useState<[MaintenanceReportWithStringsType, boolean][]>([]);
    const [maintenanceReportToEdit, setMaintenanceReportToEdit] = useState<MaintenanceReportWithStringsType | undefined>();
    const [maintenanceReportFormData, setMaintenanceReportFormData] = useState<MaintenanceReportType>(getMaintenanceReportFormInitialState(vehicle, props?.maintenanceReportFormData))
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStatData, setIsLoadingStatData] = useState(true)
    const [displayLoadingIndicator, setDisplayLoadingIndicator] = useState(false);
    const [errorState, setErrorState] = useState({isErrorModalVisible: false, errorMessage: "",});
    const [currentDate, setCurrentDate] = useState("");
    const [periodicalReports, setPeriodicalReports] = useState<FilteredReportPeriodType>({current: [], previous: []})
    // View state managed with reducer
    const [view, dispatch] = useReducer(viewReducer, {
        showSelectedReports: false,
        showMaintenanceReport: false,
        showServiceProviderEventForm: false,
        showPartPurchaseEventForm: false,
    });

    const setView: SetViewType = {
        showSelectedReports: () => dispatch({type: 'SHOW_SELECTED_REPORTS'}),
        showMaintenanceReport: () => dispatch({type: 'SHOW_MAINTENANCE_REPORT'}),
        showServiceProviderEventForm: () => dispatch({type: 'SHOW_SERVICE_PROVIDER_FORM'}),
        showPartPurchaseEventForm: () => dispatch({type: 'SHOW_PART_PURCHASE_FORM'}),
        reset: () => dispatch({type: 'RESET'}),
    };

    // Error handling
    const showError = (message: string) => {
        setErrorState({
            isErrorModalVisible: true,
            errorMessage: message,
        });
    };

    const handleDismissError = () => {
        setErrorState({
            isErrorModalVisible: false,
            errorMessage: "",
        });
    };
    const searchingFilterLabels: string[] = ["7D", "2W", "4W", "3M", "1Y"]


    // Data fetching
    const fetchMaintenanceReports = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API}maintenance/overview/?vehicle_id=${vehicle.id}`, {withCredentials: true});
            setMaintenanceReports(response.data);
        } catch (error: any) {
            if (error.response.status === 401) {
                navigate("/");
            } else {
                setErrorState({isErrorModalVisible: true, errorMessage: "Error fetching maintenance overview !"})
            }
        }
        setIsLoading(false)
    }, [])

    const handleFilterRangeChange = (label: string) => {
        const idx = searchingFilterLabels.indexOf(label);
        setActiveFilter(idx);
        setPeriodicalReports(filterReports(maintenanceReports, label))
    }

    // Maintenance report handlers
    const handleStartingRecordingMaintenance = () => {
        setShowMaintenanceForm(true);
        setIsMaintenanceReportPutRequest(false);
    }
    const handleCancelingRecordingMaintenance = () => {
        navigate("/vehicles");
    }
    const handleDateChange = (name: string) => (_: DateTimePickerEvent, date?: Date) => {
        setMaintenanceReportDates(prevState => ({
            ...prevState,
            [name]: date
        }))
    }
    const handleMaintenanceReportFormChange = (name: string, value: string) => {
        setMaintenanceReportFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    const handleValidatingMaintenanceReportData = (formattedMaintenanceReportFormData: MaintenanceReportWithStringsType) => {
        const {vehicle, start_date, end_date, mileage, service_provider_events} = formattedMaintenanceReportFormData
        if (!vehicle) {
            Alert.alert("Error", "You must select a vehicle!")
            return false
        }
        if (!start_date) {
            Alert.alert("Error", "You must select a start date!")
            return false
        }
        if (!end_date) {
            Alert.alert("Error", "You must select a end date!")
            return false
        }
        if (new Date(end_date) < new Date(start_date)) {
            Alert.alert("Error", "End date must be greater than start date!");
            return false;
        }
        if (!isPositiveInteger(mileage)) {
            Alert.alert("Error", "You must select a valid mileage!")
            return false
        }
        if (service_provider_events.length === 0 && !isMaintenanceReportPutRequest) {
            Alert.alert("Error", "You must create a service provider event")
            return false
        }
        return true;
    }
    const handleFormattingMaintenanceReportFormData = (): MaintenanceReportWithStringsType => {
        return {
            ...maintenanceReportFormData,
            start_date: getLocalDateString(maintenanceReportDates.start_date),
            end_date: getLocalDateString(maintenanceReportDates.end_date),
            part_purchase_events: maintenanceReportFormData.part_purchase_events.map((partPurchaseEvent) => {
                if (!partPurchaseEvent.part.id || !partPurchaseEvent.provider.id) {
                    throw new Error("Either Part or Provider are not given!")
                }
                return {
                    ...partPurchaseEvent,
                    part: partPurchaseEvent.part.id,
                    provider: partPurchaseEvent.provider.id
                }
            }),
            service_provider_events: maintenanceReportFormData.service_provider_events.map((serviceProviderEvent) => {
                if (!serviceProviderEvent.service_provider.id) {
                    throw new Error("Service Provider is not given!")
                }
                return {
                    ...serviceProviderEvent,
                    service_provider: serviceProviderEvent.service_provider.id
                }
            })
        }
    }
    const handleMaintenanceReportCancellation = () => {
        setShowMaintenanceForm(false);
    }
    const handleMaintenanceReportSubmission = async () => {
        setIsLoading(true)
        try {
            const formattedMaintenanceReportFormData = handleFormattingMaintenanceReportFormData();
            if (!handleValidatingMaintenanceReportData(formattedMaintenanceReportFormData)) {
                return
            }
            const url = isMaintenanceReportPutRequest ? `${API}maintenance/reports/${maintenanceReportFormData.id}/` : `${API}maintenance/reports/`
            const options = {headers: {"Content-Type": "application/json"}, withCredentials: true}
            const response = !isMaintenanceReportPutRequest ? await axios.post(url, formattedMaintenanceReportFormData, options) : await axios.put(url, formattedMaintenanceReportFormData, options)
            setShowMaintenanceForm(false)
            if (!isMaintenanceReportPutRequest) {
                setMaintenanceReports(insertReport(maintenanceReports, response.data))
                router.replace("/maintenance/maintenance-report")
            } else {
                setMaintenanceReports(maintenanceReports.map((report) => {
                    if (report.id === response.data.id) {
                        return response.data
                    }
                    return report;
                }))
                router.replace("/details/maintenance-reports-details")
            }

        } catch (error: any) {
            if (error.response.status === 401) {
                router.replace("/");
            } else {
                setErrorState({isErrorModalVisible: true, errorMessage: "Error saving maintenance report !"})
            }
        } finally {
            setIsLoading(false);
        }
    }
    const handleShowingMaintenanceReports = () => {
        router.replace('/details/maintenance-reports-details');
    }
    const handleErrorNotificationDismissal = () => {
        setErrorState({isErrorModalVisible: false, errorMessage: ""});
    }

    // Calendar handlers
    const onMonthChange = (date: DateData) => {
        setDisplayLoadingIndicator(true);
        setCurrentDate(date.dateString)
        setMonthlyReports(maintenanceReports.filter(report => report.start_date.substring(0, 7) === date.dateString.substring(0, 7)))
    };
    const onDayPressed = (date: DateData) => {
        setView.showSelectedReports();
        setSelectedReports(monthlyReports.filter(report => report.start_date === date.dateString).map(report => [report, false] as [MaintenanceReportWithStringsType, boolean]));
    };


    // Report handlers
    const handleMaintenanceReportViewCancellation = () => {
        setView.reset();
    };

    const handleCollapse = (id?: string) => {
        setSelectedReports(selectedReports.map(([report, expanded]) =>
            [report, id && report.id === id ? !expanded : expanded]
        ));
    };

    const handleMaintenanceReportEdition = (id?: string) => {
        setView.showMaintenanceReport();
        setIsMaintenanceReportPutRequest(true);
        const reportToEdit = selectedReports.find(([report]) => report.id === id);
        if (reportToEdit) {
            setMaintenanceReportToEdit(reportToEdit[0]);
        }
    };
    const handleMaintenanceReportDeletion = (id?: string) => {
        Alert.alert(
            "Delete report",
            "Are you sure you want to delete this report? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            const url = `${API}maintenance/reports/${id}/`;
                            const options = {headers: {"Content-Type": "application/json"}, withCredentials: true};
                            await axios.delete(url, options);
                            setMaintenanceReports(maintenanceReports.filter(report => report.id !== id));
                            setSelectedReports(selectedReports.filter(([report]) => report.id !== id));
                            setView.showSelectedReports();
                        } catch (error: any) {
                            if (error.response?.status === 401) {
                                router.replace("/");
                            } else {
                                showError("Error deleting report!");
                                console.error("Error deleting report:", error);
                            }
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ],
            {cancelable: true}
        );
    };

    const handleLeavingMaintenanceReportsCalendar = () => {
        router.replace("/maintenance/maintenance-report");
    };
    return {
        // State
        activeFilter,
        currentDate,
        displayLoadingIndicator,
        errorState,
        isLoading,
        isMaintenanceReportPutRequest,
        maintenanceReportDates,
        maintenanceReportFormData,
        maintenanceReportToEdit,
        searchingFilterLabels,
        selectedReports,
        periodicalReports,
        showMaintenanceForm,
        isLoadingStatData,
        view,
        monthlyReports,

        //methods
        setView,
        setIsLoadingStatData,
        fetchMaintenanceReports,
        handleCancelingRecordingMaintenance,
        handleCollapse,
        handleDateChange,
        handleDismissError,
        handleErrorNotificationDismissal,
        handleFilterRangeChange,
        handleLeavingMaintenanceReportsCalendar,
        handleMaintenanceReportCancellation,
        handleMaintenanceReportDeletion,
        handleMaintenanceReportEdition,
        handleMaintenanceReportFormChange,
        handleMaintenanceReportSubmission,
        handleMaintenanceReportViewCancellation,
        handleShowingMaintenanceReports,
        handleStartingRecordingMaintenance,
        onDayPressed,
        onMonthChange,
        setErrorState,
        setIsLoading,
        setMaintenanceReportFormData,
        setSelectedReports,
        setPeriodicalReports,
        setDisplayLoadingIndicator,
    }
}