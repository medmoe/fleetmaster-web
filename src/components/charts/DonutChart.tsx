import React from 'react';
import {Box, Typography, useTheme} from '@mui/material';

export type DonutChartSegment = {
    label: string;
    value: number | null;
    color: string;
};

type DonutChartProps = {
    title: string;
    segments: DonutChartSegment[];
    size?: number;
    innerCircleRatio?: number;
    showLabels?: boolean;
    labelPosition?: 'inside' | 'below';
    customLabels?: Record<string, string>;
};

const DonutChart: React.FC<DonutChartProps> = ({
                                                   title,
                                                   segments,
                                                   size = 150,
                                                   innerCircleRatio = 0.7,
                                                   showLabels = true,
                                                   labelPosition = 'below',
                                                   customLabels = {}
                                               }) => {
    const theme = useTheme();

    // Calculate total value
    const total = segments.reduce((sum, segment) => sum + (segment.value ?? 0), 0) || 1;

    // Create conic gradient string
    let gradientString = '';
    let currentPercent = 0;

    segments.forEach((segment) => {
        const percent = segment.value ?? 0;
        gradientString += `${segment.color} ${currentPercent}% ${currentPercent + percent}%, `;
        currentPercent += percent;
    });

    // Remove trailing comma and space
    gradientString = gradientString.slice(0, -2);

    return (
        <Box sx={{textAlign: 'center', height: size + (showLabels && labelPosition === 'below' ? 70 : 0)}}>
            <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
                {title}
            </Typography>

            {/* Donut chart visualization */}
            <Box sx={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: `conic-gradient(${gradientString})`,
                margin: '0 auto',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${innerCircleRatio * 100}%`,
                    height: `${innerCircleRatio * 100}%`,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.background.paper,
                }
            }}/>

            {showLabels && labelPosition === 'below' && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    mt: 2,
                    mx: 'auto',
                    maxWidth: size
                }}>
                    {segments.map((segment, index) => (
                        <Box key={index} sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                            <Box sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: segment.color,
                                mr: 1
                            }}/>
                            <Typography variant="caption">
                                {customLabels[segment.label] || segment.label}: {Math.round(segment.value || 0)}%
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default DonutChart;