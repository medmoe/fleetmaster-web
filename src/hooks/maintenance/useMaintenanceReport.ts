import {MaintenanceReportWithStringsType, PartPurchaseEventWithNumbersType, ServiceProviderEventWithNumbersType} from "@/types/maintenance";
import useGeneralDataStore from "../../store/useGeneralDataStore";
import {useState} from "react";
import {API} from "@/constants/endpoints";
import axios from "axios";
import {isEndDateAfterStartDate} from "@/utils/common";


export const useMaintenanceReport = (
    setShowReportsList?: (show: boolean) => void,
    setOpenSnackBar?: (open: boolean) => void,
) => {
    const {maintenanceReports, vehicle, setMaintenanceReports, request} = useGeneralDataStore();
    const maintenanceReportFormInitState: MaintenanceReportWithStringsType = {
        maintenance_type: "PREVENTIVE",
        start_date: "",
        end_date: "",
        mileage: vehicle?.mileage || "0",
        description: "",
        part_purchase_events: [],
        service_provider_events: [],
        vehicle: vehicle?.id || "",
    }
    const partPurchaseEventInitState: PartPurchaseEventWithNumbersType = {
        part: "",
        provider: "",
        purchase_date: "",
        cost: "0",
    }
    const serviceProviderEventInitState: ServiceProviderEventWithNumbersType = {
        service_provider: "",
        service_date: "",
        cost: "0",
        description: ""
    }
    const [maintenanceReportFormData, setMaintenanceReportFormData] = useState<MaintenanceReportWithStringsType>(maintenanceReportFormInitState)
    const [partPurchaseEvent, setPartPurchaseEvent] = useState<PartPurchaseEventWithNumbersType>(partPurchaseEventInitState)
    const [serviceProviderEvent, setServiceProviderEvent] = useState<ServiceProviderEventWithNumbersType>(serviceProviderEventInitState)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({isError: false, message: ""})
    const [openFormDialog, setOpenFormDialog] = useState(false);


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
    const handleMaintenanceReportSubmission = async () => {
        if (!isMaintenanceReportFormDataValid()) return;
        setIsLoading(true)
        try {
            const options = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
            const url = request === 'add' ? `${API}maintenance/reports/` : `${API}maintenance/reports/${maintenanceReportFormData.id}/`;
            const response = request === 'add' ? await axios.post(url, maintenanceReportFormData, options) : await axios.put(url, maintenanceReportFormData, options);
            if (request === 'add') {
                setMaintenanceReports([...maintenanceReports, response.data])
            } else {
                setMaintenanceReports(maintenanceReports.map(report => report.id === response.data.id ? response.data : report))

            }
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            setOpenSnackBar && setOpenSnackBar(true)
            setOpenFormDialog(false)
            setMaintenanceReportFormData(maintenanceReportFormInitState)
            setPartPurchaseEvent(partPurchaseEventInitState)
            setServiceProviderEvent(serviceProviderEventInitState)
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            setShowReportsList && setShowReportsList(false)
        } catch (e: any) {
            console.error(e)
            setError({isError: true, message: e.response.data.detail || "Unknown error occurred"})
        } finally {
            setIsLoading(false)
        }
    }


    const isMaintenanceReportFormDataValid = () => {
        const [isValid, message] = isEndDateAfterStartDate(maintenanceReportFormData.start_date, maintenanceReportFormData.end_date)
        if (!isValid) {
            setError({isError: true, message: message})
            return false;
        }
        if (maintenanceReportFormData.service_provider_events.length === 0) {
            setError({isError: true, message: "Please add at least one service provider event"})
            return false;
        }
        return true;
    }

    return {
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
        setIsLoading,
        setOpenFormDialog,
        setMaintenanceReportFormData,
        request,
    }
}
