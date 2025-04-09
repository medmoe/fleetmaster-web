import {MaintenanceReportType, MaintenanceReportWithStringsType, ServiceProviderEventType, ServiceProviderType} from "@/types/maintenance";
import React, {useState} from "react";
import {serviceProviderEventFormInitialState} from "@/hooks/initialStates";
import {Alert} from "react-native";
import {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {getLocalDateString, isPositiveInteger} from "@/utils/helpers";
import {router} from "expo-router";
import {API} from "@/constants/endpoints";
import axios from "axios";
import {SetViewType} from "@/hooks/useMaintenanceReport";


export const useServiceProviderEvent = (
    maintenanceReportFormData: MaintenanceReportType,
    setMaintenanceReportFormData: React.Dispatch<React.SetStateAction<MaintenanceReportType>>,
    maintenanceReports: MaintenanceReportWithStringsType[],
    setMaintenanceReports: (maintenanceReports: MaintenanceReportWithStringsType[]) => void,
    selectedReports: [MaintenanceReportWithStringsType, boolean][],
    setSelectedReports: React.Dispatch<React.SetStateAction<[MaintenanceReportWithStringsType, boolean][]>>,
    setErrorState: React.Dispatch<React.SetStateAction<{ isErrorModalVisible: boolean, errorMessage: string }>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setView: SetViewType
) => {
    const [serviceProviderEventFormData, setServiceProviderEventFormData] = useState<ServiceProviderEventType>(serviceProviderEventFormInitialState)
    const [showServiceProviderEventForm, setShowServiceProviderEventForm] = useState(false);
    const [isServiceProviderEventFormDataEdition, setIsServiceProviderEventFormDataEdition] = useState(false);
    const [indexOfServiceProviderEventToEdit, setIndexOfServiceProviderEventToEdit] = useState<number | undefined>();
    const [serviceDate, setServiceDate] = useState(new Date())

    const handleServiceProviderEventFormChange = (name: string, value: string) => {
        setServiceProviderEventFormData((prevState) => {
            if (name === "service_provider") {
                const keyValuePairs = value.split(",")
                const serviceProvider: ServiceProviderType = {name: "", phone_number: "", address: "", service_type: "MECHANIC"}
                keyValuePairs.forEach((pair) => {
                    const [key, value] = pair.split(":")
                    serviceProvider[key as keyof ServiceProviderType] = value as any
                })
                return {
                    ...prevState,
                    service_provider: serviceProvider
                }
            }
            return {
                ...prevState,
                [name]: value,
            }
        })
    }
    const handleValidatingServiceProviderEventFormData = (serviceProviderEventFormData: ServiceProviderEventType): boolean => {
        const {service_provider, service_date} = serviceProviderEventFormData;
        if (!service_provider.name) {
            Alert.alert("Error", "You must select a service provider!")
            return false
        }
        if (!service_date) {
            Alert.alert("Error", "You must select a service date!")
            return false
        }
        return true;
    }
    const handleServiceProviderEventAddition = (index: number | undefined) => {
        if (!handleValidatingServiceProviderEventFormData(serviceProviderEventFormData)) {
            return;
        }
        if (index === undefined) {
            setMaintenanceReportFormData(prevState => ({
                ...prevState,
                service_provider_events: [...prevState.service_provider_events, serviceProviderEventFormData]
            }))
        } else {
            setMaintenanceReportFormData(prevState => ({
                ...prevState,
                service_provider_events: [
                    ...prevState.service_provider_events.slice(0, index),
                    serviceProviderEventFormData,
                    ...prevState.service_provider_events.slice(index + 1)
                ]
            }))
            setIndexOfServiceProviderEventToEdit(undefined);
            setIsServiceProviderEventFormDataEdition(false);
        }
        setServiceProviderEventFormData(serviceProviderEventFormInitialState);
        setShowServiceProviderEventForm(false);
    }
    const handleServiceProviderEventDeletionWithReport = (index: number) => {
        setMaintenanceReportFormData(prevState => ({
            ...prevState,
            service_provider_events: [
                ...prevState.service_provider_events.slice(0, index),
                ...prevState.service_provider_events.slice(index + 1)
            ]
        }))
        setServiceProviderEventFormData(serviceProviderEventFormInitialState);
        setIsServiceProviderEventFormDataEdition(false);
    }
    const handleServiceProviderEventDeletion = (service_provider_event_id?: string, maintenance_report_id?: string) => {
        const proceedWithServiceProviderEventDeletion = async () => {
            setIsLoading(true);
            try {
                const url = `${API}maintenance/service-provider-events/${service_provider_event_id}/`
                const options = {headers: {"Content-Type": "application/json"}, withCredentials: true}
                await axios.delete(url, options)
                setSelectedReports(selectedReports.map(([report, expanded]) => {
                    if (report.id === maintenance_report_id) {
                        report.service_provider_events = report.service_provider_events.filter(event => event.id !== service_provider_event_id);
                    }
                    return [report, expanded];
                }))
            } catch (error: any) {
                if (error.response.status === 401) {
                    router.replace("/");
                } else {
                    setErrorState({
                        isErrorModalVisible: true,
                        errorMessage: error.response.data.error ? error.response.data.error : "Error deleting service provider event !"
                    })
                    console.error("Error deleting service provider event:", error);
                }
            } finally {
                setIsLoading(false);
            }
        }
        Alert.alert("Delete service provider event", "Are you sure you want to delete this service provider event? This action cannot be undone.", [
                {
                    text: "Cancel",
                    onPress: () => {
                    },
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => proceedWithServiceProviderEventDeletion(),
                    style: "destructive"
                }
            ],
            {cancelable: true})
    }
    const handleServiceProviderEventEditionWithReport = (index: number) => {
        setServiceProviderEventFormData(maintenanceReportFormData.service_provider_events[index])
        setShowServiceProviderEventForm(true);
        setIsServiceProviderEventFormDataEdition(true);
        setIndexOfServiceProviderEventToEdit(index);
    }
    const handleServiceProviderEventEdition = (service_provider_event_id?: string, maintenance_report_id?: string) => {
        setView.showServiceProviderEventForm();
        const report = selectedReports.find(([report]) => report.id === maintenance_report_id)
        if (report) {
            const [reportToEdit] = report
            const serviceEventToEdit = reportToEdit.service_provider_events.find(event => event.id === service_provider_event_id)
            if (serviceEventToEdit) {
                if (serviceEventToEdit.service_provider_details) {
                    setServiceProviderEventFormData({
                        id: serviceEventToEdit.id,
                        service_provider: serviceEventToEdit.service_provider_details,
                        service_date: serviceEventToEdit.service_date,
                        cost: serviceEventToEdit.cost.toString(),
                        description: serviceEventToEdit.description
                    })
                }
            }
        }
    }
    const handleServiceProviderEventEditionCancellation = () => {
        setShowServiceProviderEventForm(false);
        setView.showSelectedReports();
    }
    const handleServiceDateChange = (_: string) => (_: DateTimePickerEvent, date?: Date) => {
        setServiceDate(date || new Date())
        setServiceProviderEventFormData(prevState => ({
            ...prevState,
            service_date: getLocalDateString(date)
        }))
    }
    const handleNewServiceProviderAddition = () => {
        router.replace('/forms/service-provider')
    }
    const validateServiceProviderEventFormData = () => {
        if (!isPositiveInteger(serviceProviderEventFormData.cost)) {
            Alert.alert("Invalid cost", "Cost must be a positive integer")
            return false;
        }
        if (!serviceProviderEventFormData.service_provider) {
            Alert.alert("Invalid service provider", "Service provider must be selected")
            return false;
        }
        if (!serviceDate) {
            Alert.alert("Invalid service date", "Service date must be selected")
            return false;
        }
        return true;
    }
    const formatServiceProviderEventFormData = () => {
        return {
            ...serviceProviderEventFormData,
            service_provider: serviceProviderEventFormData.service_provider.id,
            service_date: getLocalDateString(serviceDate),
        }
    }
    const handleServiceProviderEventUpdateSubmission = async () => {
        setIsLoading(true);
        if (!validateServiceProviderEventFormData()) {
            return;
        }
        try {
            const url = `${API}maintenance/service-provider-events/${serviceProviderEventFormData.id}/`
            const options = {headers: {"Content-Type": "application/json"}, withCredentials: true}
            const response = await axios.put(url, formatServiceProviderEventFormData(), options)
            setMaintenanceReports(maintenanceReports.map(report => {
                if (report.id === response.data.maintenance_report) {
                    report.service_provider_events = report.service_provider_events.map(event => {
                        if (event.id === response.data.id) {
                            return response.data
                        }
                        return event;
                    })
                }
                return report;
            }))
            setSelectedReports(selectedReports.map(([report, expanded]) => {
                if (report.id === response.data.maintenance_report) {
                    report.service_provider_events = report.service_provider_events.map(event => {
                        if (event.id === response.data.id) {
                            return response.data
                        }
                        return event;
                    })
                }
                return [report, expanded];
            }))
            setView.showSelectedReports();
        } catch (error: any) {
            if (error.response.status === 401) {
                router.replace("/");
            } else {
                setErrorState({
                    errorMessage: "Error updating service provider event!",
                    isErrorModalVisible: true
                })
                console.error("Error updating service provider event:", error);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return {
        // states
        indexOfServiceProviderEventToEdit,
        isServiceProviderEventFormDataEdition,
        serviceDate,
        serviceProviderEventFormData,
        showServiceProviderEventForm,

        // handlers
        handleNewServiceProviderAddition,
        handleServiceDateChange,
        handleServiceProviderEventAddition,
        handleServiceProviderEventDeletion,
        handleServiceProviderEventDeletionWithReport,
        handleServiceProviderEventEdition,
        handleServiceProviderEventEditionCancellation,
        handleServiceProviderEventEditionWithReport,
        handleServiceProviderEventFormChange,
        handleServiceProviderEventUpdateSubmission,
        setShowServiceProviderEventForm,
    }


}
