// src/components/DateRangePicker/DateRangePicker.tsx
import React from 'react';
import {Box, Typography, useTheme} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

type DateRangePickerProps = {
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    startLabel?: string;
    endLabel?: string;
    disabled?: boolean;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
                                                             startDate,
                                                             endDate,
                                                             onStartDateChange,
                                                             onEndDateChange,
                                                             startLabel = 'Start Date',
                                                             endLabel = 'End Date',
                                                             disabled = false,
                                                             size = 'medium',
                                                             fullWidth = false,
                                                             minDate,
                                                             maxDate,
                                                             className,
                                                         }) => {
    const theme = useTheme();

    // Prevent selecting end date before start date
    const calculatedMinEndDate = startDate ? startDate : minDate;

    // Prevent selecting start date after end date
    const calculatedMaxStartDate = endDate ? endDate : maxDate;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
                className={className}
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    gap: 2,
                    width: fullWidth ? '100%' : 'auto',
                }}
            >
                <Box sx={{width: fullWidth ? {xs: '100%', sm: '50%'} : 'auto'}}>
                    <DatePicker
                        label={startLabel}
                        value={startDate}
                        onChange={onStartDateChange}
                        disabled={disabled}
                        minDate={minDate}
                        maxDate={calculatedMaxStartDate}
                        slotProps={{
                            textField: {
                                size: size,
                                fullWidth: fullWidth,
                                sx: {width: fullWidth ? '100%' : 'auto'},
                            },
                            openPickerIcon: {
                                sx: {color: theme.palette.primary.main}
                            }
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">to</Typography>
                </Box>
                <Box sx={{width: fullWidth ? {xs: '100%', sm: '50%'} : 'auto'}}>
                    <DatePicker
                        label={endLabel}
                        value={endDate}
                        onChange={onEndDateChange}
                        disabled={disabled}
                        minDate={calculatedMinEndDate}
                        maxDate={maxDate}
                        slotProps={{
                            textField: {
                                size: size,
                                fullWidth: fullWidth,
                                sx: {width: fullWidth ? '100%' : 'auto'},
                            },
                            openPickerIcon: {
                                sx: {color: theme.palette.primary.main}
                            }
                        }}
                    />
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default DateRangePicker;