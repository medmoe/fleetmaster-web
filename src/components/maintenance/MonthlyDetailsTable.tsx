import {Chip, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import {MonthlyData, YearlyData} from "@/types/maintenance";

interface MonthlyDetailsTableProps {
    yearData: YearlyData;
}

const MonthlyDetailsTable: React.FC<MonthlyDetailsTableProps> = ({yearData}) => {
    // Extract months safely with proper typing
    const months = Object.entries(yearData)
        .filter(([key, value]) => !isNaN(Number(key)) && typeof value !== 'number' && !Array.isArray(value))
        .sort(([a], [b]) => Number(a) - Number(b)) as [string, MonthlyData][];

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Cost</TableCell>
                    <TableCell align="right">MoM Change</TableCell>
                    <TableCell>Top Parts</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {months.map(([month, data]) => {
                    const monthName = new Date(2000, Number(month) - 1).toLocaleString('default', {month: 'long'});
                    const totalCost = data?.total_cost?.toLocaleString() ?? 'N/A';
                    const momChange = data?.mom_change !== null && data?.mom_change !== undefined
                        ? `${data.mom_change.toFixed(1)}%`
                        : 'N/A';
                    const topParts = data?.top_recurring_issues ?? [];

                    return (
                        <TableRow key={month}>
                            <TableCell>{monthName}</TableCell>
                            <TableCell align="right">${totalCost}</TableCell>
                            <TableCell align="right">{momChange}</TableCell>
                            <TableCell>
                                {topParts.slice(0, 3).map((part) => (
                                    <Chip
                                        key={part.part_name ?? month}
                                        label={`${part.part_name ?? 'Unknown'} (${part.part_count ?? 0})`}
                                        size="small"
                                        sx={{mr: 1, mb: 1}}
                                    />
                                ))}
                                {topParts.length === 0 && 'No data'}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default MonthlyDetailsTable;