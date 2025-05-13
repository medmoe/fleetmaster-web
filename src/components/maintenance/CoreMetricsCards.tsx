import {Grid, Typography, useTheme} from "@mui/material";
import {MetricSummaryCard} from "@/components";
import React from "react";
import {CoreMetricsResponse} from "@/types/maintenance.ts";
import {useTranslation} from "react-i18next";

interface CoreMetricsProps {
    standardMetrics: CoreMetricsResponse;
}

// Helper function to format currency
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
};

// Helper to format percentage
const formatPercentage = (value: number): string => {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
};

const CoreMetricsCards = ({standardMetrics}: CoreMetricsProps) => {
    const theme = useTheme();
    const {t} = useTranslation();
    return (
        <Grid container spacing={3} sx={{mb: 4}}>
            {/* First row: Key spending metrics */}
            <Grid container spacing={3}>
                <Grid sx={{width: {xs: "100%"}}}>
                    <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 500}}>
                        {t('pages.maintenance.coreMetrics.fleetWideSpending')}
                    </Typography>
                </Grid>
                <MetricSummaryCard
                    title={t('pages.maintenance.coreMetrics.annualSpending')}
                    value={formatCurrency(standardMetrics.total_maintenance_cost.year.total)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title={t('pages.maintenance.coreMetrics.quarterlySpending')}
                    value={formatCurrency(standardMetrics.total_maintenance_cost.quarter.total)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title={t('pages.maintenance.coreMetrics.monthlySpending')}
                    value={formatCurrency(standardMetrics.total_maintenance_cost.month.total)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title={t('pages.maintenance.coreMetrics.yoyChange')}
                    value={formatPercentage(standardMetrics.yoy)}
                    valueStyling={{
                        mt: 1,
                        color: standardMetrics.yoy < 0 ? theme.palette.success.main : theme.palette.error.main
                    }}
                    subtitle={t('pages.maintenance.coreMetrics.lowerIsBetter')}
                />
            </Grid>

            {/* Second row: Per-vehicle metrics */}
            <Grid container spacing={3} sx={{mt: 2}}>
                <Grid sx={{width: {xs: "100%"}}}>
                    <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 500}}>
                        {t('pages.maintenance.coreMetrics.perVehicleAverages')}
                    </Typography>
                </Grid>
                <MetricSummaryCard
                    title={t('pages.maintenance.coreMetrics.annualAverage')}
                    value={formatCurrency(standardMetrics.total_maintenance_cost.year.vehicle_avg)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title={t('pages.maintenance.coreMetrics.quarterlyAverage')}
                    value={formatCurrency(standardMetrics.total_maintenance_cost.quarter.vehicle_avg)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title={t('pages.maintenance.coreMetrics.monthlyAverage')}
                    value={formatCurrency(standardMetrics.total_maintenance_cost.month.vehicle_avg)}
                    valueStyling={{mt: 1}}
                />
            </Grid>
        </Grid>
    )
}

export default CoreMetricsCards;