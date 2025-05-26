import React, {useState} from 'react';
import {Box, Paper, Tab, Tabs, Typography} from '@mui/material';
import {VehicleMaintenanceDataType} from '@/types/maintenance';
import YearSelector from './YearSelector'
import YearlySummaryCard from "@/components/cards/YearlySummaryCard";
import MonthlyDetailsTable from "./MonthlyDetailsTable"
import PartUsageChart from "@/components/charts/PartUsageChart";
import CostTrendChart from "@/components/charts/CostTrendChart";

interface VehicleMaintenanceOverviewProps {
    data: VehicleMaintenanceDataType;
}

const VehicleMaintenanceOverview: React.FC<VehicleMaintenanceOverviewProps> = ({data}) => {

    const [selectedYear, setSelectedYear] = useState<number>(1990);
    const [activeTab, setActiveTab] = useState(0);

    const selectedYearData = data.find(([year]) => year === selectedYear)?.[1];

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" gutterBottom>
                Maintenance History
            </Typography>

            <YearSelector
                years={data.map(([year]) => year)}
                selectedYear={selectedYear}
                onSelect={setSelectedYear}
            />

            {selectedYearData && (
                <>
                    <YearlySummaryCard data={selectedYearData}/>

                    <Paper sx={{mt: 3, p: 2}}>
                        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                            <Tab label="Monthly Breakdown"/>
                            <Tab label="Part Analysis"/>
                            <Tab label="Cost Trends"/>
                        </Tabs>

                        <Box sx={{mt: 2}}>
                            {activeTab === 0 && <MonthlyDetailsTable yearData={selectedYearData}/>}
                            {activeTab === 1 && <PartUsageChart parts={selectedYearData.top_recurring_issues}/>}
                            {activeTab === 2 && <CostTrendChart data={data} selectedYear={selectedYear}/>}
                        </Box>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default VehicleMaintenanceOverview;