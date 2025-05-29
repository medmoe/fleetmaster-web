import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown, Equalizer } from '@mui/icons-material';
import { YearlyData } from '@/types/maintenance'

interface YearlySummaryCardProps {
  data: YearlyData;
}

const YearlySummaryCard: React.FC<YearlySummaryCardProps> = ({ data }) => {
  const trendIcon = data.yoy_change === null
    ? <Equalizer color="disabled" />
    : data.yoy_change >= 0
      ? <TrendingUp color="error" />
      : <TrendingDown color="success" />;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid sx={{width:{xs: '100%', sm: '50%'}}}>
            <Typography variant="h6">Total Cost</Typography>
            <Typography variant="h4">${data.total_cost.toLocaleString()}</Typography>
          </Grid>

          <Grid sx={{width:{xs: '100%', sm: '50%'}}}>
            <Typography variant="h6">Year Over Year</Typography>
            <Box display="flex" alignItems="center">
              {trendIcon}
              <Typography variant="h5" sx={{ ml: 1 }}>
                {data.yoy_change !== null ? `${Math.abs(Number(data.yoy_change.toFixed(2)))}%` : 'N/A'}
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{width:{xs: '100%', sm: '50%'}}}>
            <Typography variant="h6">Top Issue</Typography>
            <Typography variant="h5">
              {data.top_recurring_issues[0]?.part_name || 'None'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default YearlySummaryCard;