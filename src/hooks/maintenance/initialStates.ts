import {MaintenanceReportType, MaintenanceReportWithStringsType, PartPurchaseEventType, ServiceProviderEventType} from "../../types/maintenance.ts";
import {getLocalDateString} from "../../utils/common.ts";
import {VehicleType} from "../../types/types.ts";

export const partPurchaseEventFormInitialState: PartPurchaseEventType = {
    part: {
        name: "",
        description: "",
    },
    provider: {
        name: "",
        address: "",
        phone_number: "",
    },
    purchase_date: getLocalDateString(new Date()),
    cost: "0",
}

export const serviceProviderEventFormInitialState: ServiceProviderEventType = {
    service_provider: {
        name: "",
        phone_number: "",
        address: "",
        service_type: "MECHANIC"
    },
    service_date: getLocalDateString(new Date()),
    cost: "0",
    description: ""
}

export const getMaintenanceReportDatesInitialState = (maintenanceReportFormData?: MaintenanceReportWithStringsType) => {
    return {
        "start_date": new Date(maintenanceReportFormData?.start_date || Date.now()),
        "end_date": new Date(maintenanceReportFormData?.end_date || Date.now()),
        "purchase_date": new Date()
    }
}

export const maintenanceReportInitialState = {
    previous_report: {},
    current_report: {},
}

export const getMaintenanceReportFormInitialState = (vehicle: VehicleType, maintenanceReportFormData?: MaintenanceReportWithStringsType): MaintenanceReportType => {
    return {
        id: maintenanceReportFormData?.id,
        maintenance_type: maintenanceReportFormData?.maintenance_type || "PREVENTIVE",
        vehicle: maintenanceReportFormData?.vehicle_details?.id || vehicle.id,
        start_date: maintenanceReportFormData?.start_date || "",
        end_date: maintenanceReportFormData?.end_date || "",
        mileage: maintenanceReportFormData?.mileage.toString() || vehicle.mileage,
        description: maintenanceReportFormData?.description || "",
        part_purchase_events: [],
        service_provider_events: [],
    }
}
