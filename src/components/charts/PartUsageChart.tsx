import {Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {MaintenancePart} from "@/types/maintenance";
import {Box, Typography} from "@mui/material";

interface PartUsageChartProps {
    parts: MaintenancePart[];
}

const PartUsageChart: React.FC<PartUsageChartProps> = ({parts}) => {
    const chartData = parts.slice(0, 5).map((part) => ({
        name: part.part_name,
        count: part.part_count,
        cost: part.part_cost,
    }));

    return (
        <Box sx={{height: 400}}>
            <Typography variant="h6" gutterBottom>
                Top Recurring Parts
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={chartData}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="count" name="Usage Count" fill="#8884d8"/>
                    <Bar dataKey="cost" name="Total Cost" fill="#82ca9d"/>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default PartUsageChart;