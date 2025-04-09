import React, {useState} from "react";
import {MaintenanceReportType, MaintenanceReportWithStringsType, PartProviderType, PartPurchaseEventType} from "@/types/maintenance";
import {partPurchaseEventFormInitialState} from "@/hooks/initialStates";
import {Alert} from "react-native";
import {router} from "expo-router";
import {getLocalDateString, isPositiveInteger} from "@/utils/helpers";
import {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {API} from "@/constants/endpoints";
import axios from "axios";
import {SetViewType} from "@/hooks/useMaintenanceReport";


export const usePartPurchaseEvent = (
    maintenanceReportFormData: MaintenanceReportType,
    setMaintenanceReportFormData: React.Dispatch<React.SetStateAction<MaintenanceReportType>>,
    maintenanceReports: MaintenanceReportWithStringsType[],
    setMaintenanceReports: (maintenanceReports: MaintenanceReportWithStringsType[]) => void,
    selectedReports: [MaintenanceReportWithStringsType, boolean][],
    setSelectedReports: React.Dispatch<React.SetStateAction<[MaintenanceReportWithStringsType, boolean][]>>,
    setErrorState: React.Dispatch<React.SetStateAction<{ isErrorModalVisible: boolean, errorMessage: string }>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setView: SetViewType,
) => {
    const [partPurchaseEventFormData, setPartPurchaseEventFormData] = useState<PartPurchaseEventType>(partPurchaseEventFormInitialState);
    const [searchTerm, setSearchTerm] = useState("")
    const [isPartSelected, setIsPartSelected] = useState(false)
    const [isPartPurchaseEventFormDataEdition, setIsPartPurchaseEventFormDataEdition] = useState(false);
    const [indexOfPartPurchaseEventToEdit, setIndexOfPartPurchaseEventToEdit] = useState<number | undefined>();
    const [purchaseDate, setPurchaseDate] = useState(new Date())
    const [showPartPurchaseEventForm, setShowPartPurchaseEventForm] = useState(false);

    // Part purchase event handlers
    const handlePartPurchaseEventFormChange = (name: string, value: string) => {
        setPartPurchaseEventFormData((prevState) => {
            if (name === "provider") {
                const keyValuePairs = value.split(",")
                const partProvider: PartProviderType = {name: "", address: "", phone_number: ""}
                keyValuePairs.forEach((pair) => {
                    const [key, value] = pair.split(":")
                    partProvider[key as keyof PartProviderType] = value
                })
                return {
                    ...prevState,
                    provider: partProvider
                }
            }
            return {
                ...prevState,
                [name]: value,
            }
        })
    }
    const handleSelectingPart = (name: string, id: string) => {
        setSearchTerm(name);
        setPartPurchaseEventFormData(prevState => ({
            ...prevState,
            part: {
                ...prevState.part,
                id: id,
                name: name
            }
        }))
        setIsPartSelected(true);
    }
    const handlePartInputChange = (_: string, value: string) => {
        setSearchTerm(value);
    }
    const handleValidatingPartPurchaseEventFormData = (formattedPartPurchaseEventFormData: PartPurchaseEventType) => {
        const {part, provider, purchase_date, cost} = formattedPartPurchaseEventFormData
        if (!part.name) {
            Alert.alert("Error", "You must select an available part!")
            return false
        }
        if (!provider.name) {
            Alert.alert("Error", "You must select a provider!")
            return false
        }
        if (!purchase_date) {
            Alert.alert("Error", "You must select a purchase date!");
            return false
        }
        if (!isPositiveInteger(cost)) {
            Alert.alert("Error", "You must enter a valid cost !")
            return false
        }
        return true;
    }
    const handlePartPurchaseEventAddition = (index: number | undefined) => {
        if (!handleValidatingPartPurchaseEventFormData(partPurchaseEventFormData)) {
            return
        }
        if (index === undefined) {
            setMaintenanceReportFormData(prevState => ({
                ...prevState,
                part_purchase_events: [...prevState.part_purchase_events, partPurchaseEventFormData]
            }))
        } else {
            setMaintenanceReportFormData(prevState => ({
                ...prevState,
                part_purchase_events: [
                    ...prevState.part_purchase_events.slice(0, index),
                    partPurchaseEventFormData,
                    ...prevState.part_purchase_events.slice(index + 1)
                ]
            }))
            setIndexOfPartPurchaseEventToEdit(undefined);
            setIsPartPurchaseEventFormDataEdition(false);
        }
        setShowPartPurchaseEventForm(false)
        setPartPurchaseEventFormData(partPurchaseEventFormInitialState);
        setSearchTerm("");
    }
    const handlePartPurchaseEventEditionWithReport = (index: number) => {
        setPartPurchaseEventFormData(maintenanceReportFormData.part_purchase_events[index])
        setShowPartPurchaseEventForm(true);
        setIsPartPurchaseEventFormDataEdition(true);
        setIndexOfPartPurchaseEventToEdit(index);
    }
    const handlePartPurchaseEventEdition = (part_purchase_event_id?: string, maintenance_report_id?: string) => {
        setView.showPartPurchaseEventForm()
        const report = selectedReports.find(([report]) => report.id === maintenance_report_id)
        if (report) {
            const [reportToEdit, _] = report
            const partPurchaseEventToEdit = reportToEdit.part_purchase_events.find(event => event.id === part_purchase_event_id)
            if (partPurchaseEventToEdit) {
                setPartPurchaseEventFormData({
                    id: partPurchaseEventToEdit.id,
                    part: partPurchaseEventToEdit.part_details || {id: "", name: "", description: ""},
                    provider: partPurchaseEventToEdit.provider_details || {id: "", name: "", phone_number: "", address: ""},
                    purchase_date: partPurchaseEventToEdit.purchase_date,
                    cost: partPurchaseEventToEdit.cost.toString(),
                })
            }
        }
    }
    const handlePartPurchaseEventDeletionWithReport = (index: number) => {
        setMaintenanceReportFormData(prevState => ({
            ...prevState,
            part_purchase_events: [
                ...prevState.part_purchase_events.slice(0, index),
                ...prevState.part_purchase_events.slice(index + 1)
            ]
        }))
    }
    const handlePartPurchaseEventDeletion = (part_purchase_event_id?: string, maintenance_report_id?: string) => {
        const proceedWithPartPurchaseEventDeletion = async () => {
            setIsLoading(true);
            try {
                const url = `${API}maintenance/part-purchase-events/${part_purchase_event_id}/`
                const options = {headers: {"Content-Type": "application/json"}, withCredentials: true}
                await axios.delete(url, options)
                setMaintenanceReports(maintenanceReports.map((report) => {
                    if (report.id === maintenance_report_id) {
                        return {
                            ...report,
                            part_purchase_events: report.part_purchase_events.filter(event => event.id !== part_purchase_event_id)
                        }
                    }
                    return report;
                }))
                setSelectedReports(selectedReports.map(([report, expanded]) => {
                    if (report.id === maintenance_report_id) {
                        report.part_purchase_events = report.part_purchase_events.filter(event => event.id !== part_purchase_event_id);
                    }
                    return [report, expanded];
                }))
                setView.showSelectedReports();
                setPartPurchaseEventFormData(partPurchaseEventFormInitialState)
                setSearchTerm("")
                setIsPartSelected(false)
            } catch (error: any) {
                if (error.response.status === 401) {
                    router.replace("/");
                } else {
                    setErrorState({
                        isErrorModalVisible: true,
                        errorMessage: error.response.data.error ? error.response.data.error : "Error deleting part purchase event !"
                    })
                    console.error("Error deleting part purchase event:", error);
                }
            } finally {
                setIsLoading(false);
            }
        }
        Alert.alert("Delete part purchase event", "Are you sure you want to delete this part purchase event? This action cannot be undone.", [
            {
                text: "Cancel",
                onPress: () => {
                },
                style: "cancel"
            },
            {
                text: "Delete",
                onPress: () => proceedWithPartPurchaseEventDeletion(),
                style: "destructive"
            }
        ], {cancelable: true})
    }

    const formatPartPurchaseEventFormData = () => {
        return {
            part: partPurchaseEventFormData.part.id,
            provider: partPurchaseEventFormData.provider.id,
            purchase_date: getLocalDateString(purchaseDate),
            cost: partPurchaseEventFormData.cost,
        }
    }
    const validatePartPurchaseEventFormData = () => {
        if (!isPositiveInteger(partPurchaseEventFormData.cost)) {
            Alert.alert("Invalid cost", "Cost must be a positive integer")
            return false;
        }
        if (!partPurchaseEventFormData.part.id) {
            Alert.alert("Invalid part", "Part must be selected")
            return false;
        }
        return true
    }
    const handlePartPurchaseEventUpdateSubmission = async () => {
        if (!validatePartPurchaseEventFormData()) {
            return;
        }
        setIsLoading(true);
        try {

            const url = `${API}maintenance/part-purchase-events/${partPurchaseEventFormData.id}/`
            const options = {headers: {"Content-Type": "application/json"}, withCredentials: true}
            const response = await axios.put(url, formatPartPurchaseEventFormData(), options)
            setMaintenanceReports(maintenanceReports.map(report => {
                if (report.id === response.data.maintenance_report) {
                    report.part_purchase_events = report.part_purchase_events.map(event => {
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
                    report.part_purchase_events = report.part_purchase_events.map(event => {
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
                    isErrorModalVisible: true,
                    errorMessage: "Error updating part purchase event !"
                })
                console.error("Error updating part purchase event:", error);
            }
        } finally {
            setIsLoading(false);
        }

    }

    const handleNewPartAddition = () => {
        router.replace('/forms/part');
    }
    const handleNewPartsProviderAddition = () => {
        router.replace('/forms/part-provider')
    }
    const handlePartPurchaseEventEditionCancellation = () => {
        setShowPartPurchaseEventForm(false);
        setView.showSelectedReports();
    }
    const handlePurchaseDateChange = (_: string) => (_: DateTimePickerEvent, date?: Date) => {
        setPurchaseDate(date || new Date())
        setPartPurchaseEventFormData(prevState => ({
            ...prevState,
            purchase_date: getLocalDateString(date)
        }))
    }
    return {
        // states
        indexOfPartPurchaseEventToEdit,
        isPartPurchaseEventFormDataEdition,
        isPartSelected,
        partPurchaseEventFormData,
        purchaseDate,
        searchTerm,
        showPartPurchaseEventForm,

        // handlers
        handleNewPartAddition,
        handleNewPartsProviderAddition,
        handlePartInputChange,
        handlePartPurchaseEventAddition,
        handlePartPurchaseEventDeletion,
        handlePartPurchaseEventDeletionWithReport,
        handlePartPurchaseEventEdition,
        handlePartPurchaseEventEditionCancellation,
        handlePartPurchaseEventEditionWithReport,
        handlePartPurchaseEventFormChange,
        handlePartPurchaseEventUpdateSubmission,
        handlePurchaseDateChange,
        handleSelectingPart,
        setIsPartSelected,
        setShowPartPurchaseEventForm,
    }
}
