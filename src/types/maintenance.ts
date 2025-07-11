import {VehicleType} from "./types";

export interface PartProviderType {
    id?: string
    name: string
    phone_number: string
    address: string
    is_owner?: boolean
}

export interface PartType {
    id?: string
    name: string
    description: string
    isOwner?: boolean
}

export interface ServiceProviderType {
    id?: string
    name: string
    service_type: "MECHANIC" | "ELECTRICIAN" | "CLEANING"
    phone_number: string
    address: string
    is_owner?: boolean
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

export interface GeneralDataType {
    parts: PartType[];
    part_providers: PartProviderType[];
    service_providers: ServiceProviderType[];
}

type HealthStatusBase<T> = {
    good: T;
    warning: T;
    critical: T;
}

export type AlertTuple = [string, string, string, string, ...string[]]

// Health metric status types
type HealthStatus = HealthStatusBase<number | null>;
type AlertHealthStatus = HealthStatusBase<AlertTuple[]>;

// Common vehicle health metrics for both response types
export type VehicleHealthMetrics = {
    vehicle_avg_health: HealthStatus;
    vehicle_insurance_health: HealthStatus;
    vehicle_license_health: HealthStatus;
};

export type VehicleHealthAlerts = { [key in keyof VehicleHealthMetrics]: AlertHealthStatus }


// Part issue type for recurring issues
type PartIssue = {
    part__name: string;
    count: number;
};

// Cost metric with total and per-vehicle average
type CostMetric = {
    total: number;
    vehicle_avg: number;
};

// Core metrics response (when no grouping is requested)
export type CoreMetricsResponse = {
    total_maintenance_cost: {
        year: CostMetric;
        quarter: CostMetric;
        month: CostMetric;
    };
    yoy: number;
    top_recurring_issues: PartIssue[];
    vehicle_health_metrics: VehicleHealthMetrics;
};

// Time period change keys based on grouping strategy
export type YearlyChange = { yoy_change: number; vehicle_avg: number };
export type QuarterlyChange = { qoq_change: number; vehicle_avg: number };
export type MonthlyChange = { mom_change: number; vehicle_avg: number };

// Grouped metrics response structure (when grouping is requested)
export type GroupedMetricsResponse = {
    grouped_metrics: {
        [timePeriod: string]: YearlyChange | QuarterlyChange | MonthlyChange;
    };
    vehicle_health_metrics: VehicleHealthMetrics;
};

export type FormattedHealthAlerts = {
    overdue: {total: number, vehicles: AlertTuple[]},
    upcoming: {total: number, vehicles: AlertTuple[]}
} | null;

// Combined response type (either core metrics or grouped metrics)
export type FleetWideOverviewResponseType = CoreMetricsResponse | GroupedMetricsResponse;


// Vehicle maintenance overview data types
export type MaintenancePart = {
  part_name: string | null;
  part_count: number | null;
  part_cost: number | null;
  part_rank: number | null;
};

export type MonthlyData = {
  total_cost: number;
  mom_change: number | null;
  top_recurring_issues: MaintenancePart[];
};

export type YearlyData = {
  total_cost: number;
  yoy_change: number | null;
  top_recurring_issues: MaintenancePart[];
  [month: number]: MonthlyData; // Dynamic month number keys
};

export type VehicleMaintenanceDataType = [number, YearlyData][];


















