import {MaintenanceReportWithStringsType, ReportSummaryType} from "../../types/maintenance.ts";
import {getLocalDateString} from "../common.ts";

export const getMaintenanceStatData = (maintenanceReports: {
    previous: MaintenanceReportWithStringsType[],
    current: MaintenanceReportWithStringsType[]
}): [string, string, string, string, string][] => {
    /**
     * Processes maintenance reports and computes statistical data for the current and previous year.
     *
     * @param maintenanceReports - Object containing current and previous year's maintenance reports.
     * @returns An array where each entry includes:
     *  - A label (string) representing the report type.
     *  - The current year's value (string) formatted based on the type of report.
     *  - The percentage change between years (string).
     *  - A color code (string) representing the trend (red for increase, green for decrease).
     *  - An icon identifier (string) indicating the trend direction ('up' or 'down').
     */
    const summarizer = new ReportSummarizer();
    const maintenanceReport: { previous_report: ReportSummaryType, current_report: ReportSummaryType } =
        {
            previous_report: summarizer.summarizeReports(maintenanceReports.previous),
            current_report: summarizer.summarizeReports(maintenanceReports.current)
        };
    return Object.keys(maintenanceReport.previous_report || {}).map((key): [string, string, string, string, string] => {
        const label = key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
        const previousValue = maintenanceReport.previous_report[key as keyof ReportSummaryType];
        const currentValue = maintenanceReport.current_report[key as keyof ReportSummaryType];
        let percentageChange;
        if (previousValue === 0) {
            percentageChange = currentValue === 0 ? percentageChange = 0 : 100;
        } else {
            percentageChange = ((currentValue - previousValue) / previousValue) * 100;
        }
        const color = percentageChange > 0 ? "#e93c0c" : "#57b269";
        const icon = percentageChange > 0 ? 'up' : 'down';
        let formattedValue: string;
        const keys: string[] = [
            "total_maintenance_cost",
            "preventive_cost",
            "curative_cost",
            "total_service_cost",
            "total_part_purchase_cost",
        ]
        if (keys.includes(key)) {
            formattedValue = formatValue(currentValue);
        } else {
            formattedValue = currentValue.toString();
        }
        const formattedPercentage = formatPercentage(percentageChange);
        return [label, formattedValue, formattedPercentage, color, icon];
    });
}

const formatValue = (num: number): string => {
    if (num >= 1000) {
        return `$${(num / 1000).toFixed(1)}k`;
    }
    return `$${num.toFixed(1)}`;
}
const formatPercentage = (value: number): string => {
    return `${value.toFixed(0)}%`;
}

class ReportSummarizer {
    // Constants to represent report keys
    static readonly TOTAL_MAINTENANCE = "total_maintenance";
    static readonly TOTAL_MAINTENANCE_COST = "total_maintenance_cost";
    static readonly PREVENTIVE = "preventive";
    static readonly PREVENTIVE_COST = "preventive_cost";
    static readonly CURATIVE = "curative";
    static readonly CURATIVE_COST = "curative_cost";
    static readonly TOTAL_SERVICE_COST = "total_service_cost";
    static readonly TOTAL_SERVICE_VISITS = "total_service_visits";
    static readonly TOTAL_PART_PURCHASE_COST = "total_part_purchase_cost";
    static readonly MECHANIC = "mechanic";
    static readonly ELECTRICIAN = "electrician";
    static readonly CLEANING = "cleaning";

    private initializeReportSummary(): ReportSummaryType {
        return {
            [ReportSummarizer.TOTAL_MAINTENANCE]: 0,
            [ReportSummarizer.TOTAL_MAINTENANCE_COST]: 0,
            [ReportSummarizer.PREVENTIVE]: 0,
            [ReportSummarizer.PREVENTIVE_COST]: 0,
            [ReportSummarizer.CURATIVE]: 0,
            [ReportSummarizer.CURATIVE_COST]: 0,
            [ReportSummarizer.TOTAL_SERVICE_VISITS]: 0,
            [ReportSummarizer.TOTAL_SERVICE_COST]: 0,
            [ReportSummarizer.MECHANIC]: 0,
            [ReportSummarizer.TOTAL_PART_PURCHASE_COST]: 0,
            [ReportSummarizer.ELECTRICIAN]: 0,
            [ReportSummarizer.CLEANING]: 0,
        }
    }

    /**
     * Summarize a list of maintenance reports
     */
    summarizeReports(reports: MaintenanceReportWithStringsType[]) {
        const reportSummary = this.initializeReportSummary();
        for (const report of reports) {
            this.updateTotalMaintenance(reportSummary);
            this.updateCosts(reportSummary, report);
            this.updateMaintenanceTypeCounts(reportSummary, report);
            this.updateServiceProviderCounts(reportSummary, report);
        }
        return reportSummary;
    }

    private updateTotalMaintenance(reportSummary: ReportSummaryType) {
        reportSummary[ReportSummarizer.TOTAL_MAINTENANCE] += 1;
    }

    private updateCosts(reportSummary: ReportSummaryType, report: MaintenanceReportWithStringsType) {
        reportSummary[ReportSummarizer.TOTAL_MAINTENANCE_COST] += Number(report.total_cost)
        const totalServiceCost = report.service_provider_events.reduce((acc, event) => acc + Number(event.cost), 0);
        const totalPartPurchaseCost = report.part_purchase_events.reduce((acc, event) => acc + Number(event.cost), 0);
        reportSummary[ReportSummarizer.TOTAL_SERVICE_COST] += totalServiceCost;
        reportSummary[ReportSummarizer.TOTAL_PART_PURCHASE_COST] += totalPartPurchaseCost;
    }

    private updateMaintenanceTypeCounts(reportSummary: ReportSummaryType, report: MaintenanceReportWithStringsType) {
        if (report.maintenance_type === "PREVENTIVE") {
            reportSummary[ReportSummarizer.PREVENTIVE] += 1;
            reportSummary[ReportSummarizer.PREVENTIVE_COST] += Number(report.total_cost);
        } else if (report.maintenance_type === "CURATIVE") {
            reportSummary[ReportSummarizer.CURATIVE] += 1;
            reportSummary[ReportSummarizer.CURATIVE_COST] += Number(report.total_cost);
        }
    }

    private updateServiceProviderCounts(reportSummary: ReportSummaryType, report: MaintenanceReportWithStringsType) {
        const serviceTypeMapping: Record<string, string> = {
            "MECHANIC": ReportSummarizer.MECHANIC,
            "ELECTRICIAN": ReportSummarizer.ELECTRICIAN,
            "CLEANING": ReportSummarizer.CLEANING,
        }
        for (const event of report.service_provider_events) {
            const serviceType = event.service_provider_details?.service_type
            if (serviceType && serviceType in serviceTypeMapping) {
                reportSummary[serviceTypeMapping[serviceType]] += 1;
            }
        }
        reportSummary[ReportSummarizer.TOTAL_SERVICE_VISITS] += report.service_provider_events.length;
    }
}

export const filterReports = (reports: MaintenanceReportWithStringsType[], filter: string) => {
    const today = new Date();

    switch (filter) {
        case "1Y":
            const currentYear = today.getFullYear();
            const previousYear = currentYear - 1;
            return {
                current: reports.filter((report) => report.start_date.includes(currentYear.toString())),
                previous: reports.filter((report) => report.start_date.includes(previousYear.toString())),
            }

        case "3M":
            // Calculate start dates for current and previous 3-month periods
            const currentPeriodStart = new Date(today)
            currentPeriodStart.setMonth(today.getMonth() - 2);
            currentPeriodStart.setDate(1);
            currentPeriodStart.setHours(0, 0, 0, 0);
            const currentPeriodStartStr = getLocalDateString(currentPeriodStart);
            const previousPeriodStart = new Date(currentPeriodStart);
            previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 3);
            const previousPeriodStartStr = getLocalDateString(previousPeriodStart);
            return {
                current: reports.filter((report) => report.start_date >= currentPeriodStartStr),
                previous: reports.filter((report) => report.start_date >= previousPeriodStartStr && report.start_date < currentPeriodStartStr),
            }

        case "4W":
            const fourWeeksAgo = new Date(today);
            fourWeeksAgo.setDate(today.getDate() - 28);
            const eightWeeksAgo = new Date(today);
            eightWeeksAgo.setDate(today.getDate() - 56);
            return {
                current: reports.filter((report) =>
                    report.start_date >= getLocalDateString(fourWeeksAgo)
                ),
                previous: reports.filter((report) =>
                    report.start_date >= getLocalDateString(eightWeeksAgo) &&
                    report.start_date < getLocalDateString(fourWeeksAgo)
                ),
            }

        case "2W":
            const twoWeeksAgo = new Date(today);
            twoWeeksAgo.setDate(today.getDate() - 14);
            const fourWeeksAgoForTwoW = new Date(today);
            fourWeeksAgoForTwoW.setDate(today.getDate() - 28);
            return {
                current: reports.filter((report) =>
                    report.start_date >= getLocalDateString(twoWeeksAgo)
                ),
                previous: reports.filter((report) =>
                    report.start_date >= getLocalDateString(fourWeeksAgoForTwoW) &&
                    report.start_date < getLocalDateString(twoWeeksAgo)
                ),
            }

        case "7D":
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            const fourteenDaysAgo = new Date(today);
            fourteenDaysAgo.setDate(today.getDate() - 14);
            return {
                current: reports.filter((report) =>
                    report.start_date >= getLocalDateString(sevenDaysAgo)
                ),
                previous: reports.filter((report) =>
                    report.start_date >= getLocalDateString(fourteenDaysAgo) &&
                    report.start_date < getLocalDateString(sevenDaysAgo)
                ),
            }

        default:
            return {
                current: [],
                previous: []
            }
    }
}
export const insertReport = (reports: MaintenanceReportWithStringsType[], report: MaintenanceReportWithStringsType) => {
    /**
     * Inserts a maintenance report into a sorted array of reports in ascending order of start date.
     * Maintains the sorted order of the array by performing a binary search to find the correct position for the new report.
     *
     * @param reports - An array of maintenance reports, sorted by start_date in ascending order.
     * @param report - The new maintenance report to be inserted into the array.
     *
     * @returns The updated array of maintenance reports with the new report inserted in the correct position.
     *
     * This function assumes that the input array `reports` is already sorted by start_date and
     * uses binary search to efficiently find the correct index to insert the new report.
     * The insertion operation ensures that the array remains sorted after the operation.
     */
    let low = 0
    let high = reports.length;
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const midDate = reports[mid].start_date;
        if (midDate < report.start_date) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    reports.splice(low, 0, report);
    return reports;
}


