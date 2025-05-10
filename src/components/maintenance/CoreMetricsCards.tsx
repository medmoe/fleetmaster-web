import {Grid, Typography, useTheme} from "@mui/material";
import {MetricSummaryCard} from "@/components";
import React from "react";
import {CoreMetricsResponse} from "@/types/maintenance.ts";

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
    return (
        <Grid container spacing={3} sx={{mb: 4}}>
            {/* First row: Key spending metrics */}
            <Grid container spacing={3}>
                <Grid sx={{width: {xs: "100%"}}}>
                    <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 500}}>
                        Fleet-wide Spending
                    </Typography>
                </Grid>
                <MetricSummaryCard
                    title="Annual Spending"
                    value={formatCurrency(standardMetrics.total_maintenance_cost.year.total)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title="Quarterly Spending"
                    value={formatCurrency(standardMetrics.total_maintenance_cost.quarter.total)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title="Monthly Spending"
                    value={formatCurrency(standardMetrics.total_maintenance_cost.month.total)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title="YoY Change"
                    value={formatPercentage(standardMetrics.yoy)}
                    valueStyling={{
                        mt: 1,
                        color: standardMetrics.yoy < 0 ? theme.palette.success.main : theme.palette.error.main
                    }}
                    subtitle="Lower is better"
                />
            </Grid>

            {/* Second row: Per-vehicle metrics */}
            <Grid container spacing={3} sx={{mt: 2}}>
                <Grid sx={{width: {xs: "100%"}}}>
                    <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 500}}>
                        Per-vehicle Averages
                    </Typography>
                </Grid>
                <MetricSummaryCard
                    title="Annual Average"
                    value={formatCurrency(standardMetrics.total_maintenance_cost.year.vehicle_avg)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title="Quarterly Average"
                    value={formatCurrency(standardMetrics.total_maintenance_cost.quarter.vehicle_avg)}
                    valueStyling={{mt: 1}}
                />
                <MetricSummaryCard
                    title="Monthly Average"
                    value={formatCurrency(standardMetrics.total_maintenance_cost.month.vehicle_avg)}
                    valueStyling={{mt: 1}}
                />
            </Grid>
        </Grid>
    )
}

export default CoreMetricsCards;