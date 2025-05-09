import {Card, CardContent, Grid, SxProps, Theme, Typography} from "@mui/material";

interface MetricSummaryCardProps {
    title: string;
    subtitle?: string;
    value: string;
    valueStyling?: SxProps<Theme> | undefined;
}

const MetricSummaryCard = ({title, value, valueStyling, subtitle}: MetricSummaryCardProps) => {
    return (
        <Grid sx={{width: {xs: "100%", sm: "50%", md: "25%"}}}>
            <Card elevation={2}>
                <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
                    <Typography variant="h4" component="div" sx={valueStyling as SxProps<Theme>}>{value}</Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{display: 'block', mt: 0.5, color: 'text.secondary', fontStyle: 'italic'}}>{subtitle}</Typography>
                    )}
                </CardContent>
            </Card>
        </Grid>
    )
}

export default MetricSummaryCard;