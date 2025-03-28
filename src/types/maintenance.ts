import {VehicleType} from "@/types/types";

export interface PartProviderType {
    id?: string
    name: string
    phone_number: string
    address: string
}

export interface PartType {
    id?: string
    name: string
    description: string
}

export interface ServiceProviderType {
    id?: string
    name: string
    service_type: "MECHANIC" | "ELECTRICIAN" | "CLEANING"
    phone_number: string
    address: string
}

export interface MaintenanceReportType {
    id?: string
    vehicle?: string
    maintenance_type: "PREVENTIVE" | "CURATIVE"
    start_date: string
    end_date: string
    mileage: string
    description: string
    part_purchase_events: PartPurchaseEventType[]
    service_provider_events: ServiceProviderEventType[]
    vehicle_details?: VehicleType
    total_cost?: string
}

export interface PartPurchaseEventType {
    id?: string
    part: PartType
    provider: PartProviderType
    maintenance_report?: string
    purchase_date: string
    cost: string
    part_details?: PartType
    provider_details?: PartProviderType
}

export type PartPurchaseEventWithNumbersType = Omit<PartPurchaseEventType, 'part' | 'provider'> & { part: string, provider: string }
export type ServiceProviderEventWithNumbersType = Omit<ServiceProviderEventType, 'service_provider'> & { service_provider: string }
export type MaintenanceReportWithStringsType = Omit<MaintenanceReportType, 'part_purchase_events' | 'service_provider_events'> & {
    part_purchase_events: PartPurchaseEventWithNumbersType[], service_provider_events: ServiceProviderEventWithNumbersType[]
}

export interface ServiceProviderEventType {
    id?: string
    service_provider: ServiceProviderType
    maintenance_report?: string
    service_date: string
    cost: string
    description: string
    service_provider_details?: ServiceProviderType
}

export type ReportSummaryType = { [key: string]: number }

export type FilteredReportPeriodType = {
    current: MaintenanceReportWithStringsType[]
    previous: MaintenanceReportWithStringsType[]
}

