import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {VehicleMaintenanceDataType} from "@/types/maintenance";
import {Box, Typography} from "@mui/material";

interface CostTrendChartProps {
    data: VehicleMaintenanceDataType;
    selectedYear: number;
}

const CostTrendChart: React.FC<CostTrendChartProps> = ({data, selectedYear}) => {
    const chartData = data.map(([year, yearData]) => ({
        year,
        cost: yearData.total_cost,
        yoyChange: yearData.yoy_change,
        isSelected: year === selectedYear,
    }));

    return (
        <Box sx={{height: 400}}>
            <Typography variant="h6" gutterBottom>
                Cost Trend Over Years
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="year"/>
                    <YAxis yAxisId="left" orientation="left"/>
                    <YAxis yAxisId="right" orientation="right"/>
                    <Tooltip/>
                    <Legend/>
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="cost"
                        name="Total Cost"
                        stroke="#8884d8"
                        activeDot={{r: 8}}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="yoyChange"
                        name="YoY Change (%)"
                        stroke="#82ca9d"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CostTrendChart;