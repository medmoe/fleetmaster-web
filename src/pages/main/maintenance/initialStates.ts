import { CoreMetricsResponse, GroupedMetricsResponse } from "@/types/maintenance.ts"

export const initialFleetWideOverview: CoreMetricsResponse = {
    total_maintenance_cost: {
        year: {total: 0, vehicle_avg: 0},
        quarter: {total: 0, vehicle_avg: 0},
        month: {total: 0, vehicle_avg: 0}
    },
    yoy: 0,
    top_recurring_issues: [],
    vehicle_health_metrics: {
        vehicle_avg_health: {good: 0, warning: 0, critical: 0},
        vehicle_insurance_health: {good: 0, warning: 0, critical: 0},
        vehicle_license_health: {good: 0, warning: 0, critical: 0}
    }
};

export const initialGroupedMetrics: GroupedMetricsResponse = {
    grouped_metrics: {},
    vehicle_health_metrics: {
        vehicle_avg_health: {good: 0, warning: 0, critical: 0},
        vehicle_insurance_health: {good: 0, warning: 0, critical: 0},
        vehicle_license_health: {good: 0, warning: 0, critical: 0}
    }
}