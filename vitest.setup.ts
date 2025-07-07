import {afterEach, expect, vi} from 'vitest'
import {cleanup} from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from "react";

expect.extend(matchers)

afterEach(() => {
    cleanup()
})

vi.mock('@mui/material', async () => {
    const actual = await vi.importActual('@mui/material');

    return {
        ...actual,
        // Box component mock
        Box: ({children, ...props}: any) => React.createElement('div', {'data-testid': 'mui-box', ...props}, children),

        // Text input
        TextField: ({placeholder, value, onChange, fullWidth, ...props}: any) =>
            React.createElement('input', {
                'data-testid': 'mui-textfield',
                placeholder,
                value,
                onChange,
                style: fullWidth ? {width: '100%'} : undefined,
                ...props
            }),

        // Form controls
        FormControl: ({children, ...props}: any) =>
            React.createElement('div', {'data-testid': 'mui-formcontrol', ...props}, children),

        InputLabel: ({children, id, ...props}: any) =>
            React.createElement('label', {'data-testid': 'mui-inputlabel', id, ...props}, children),

        Select: ({value, onChange, labelId, children, ...props}: any) =>
            React.createElement('select', {
                'data-testid': 'mui-select',
                value,
                onChange,
                'aria-labelledby': labelId,
                ...props
            }, children),

        MenuItem: ({value, children, ...props}: any) =>
            React.createElement('option', {value, ...props}, children),

        InputAdornment: ({children, position, ...props}: any) =>
            React.createElement('span', {'data-testid': `mui-inputadornment-${position}`, ...props}, children),

        // Layout components
        Container: ({children, ...props}: any) =>
            React.createElement('div', {'data-testid': 'mui-container', ...props}, children),

        Divider: (props: any) =>
            React.createElement('hr', {'data-testid': 'mui-divider', ...props}),

        // Interactive components
        Button: ({children, variant, onClick, startIcon, ...props}: any) => {
            const buttonProps = {
                'data-testid': `mui-button-${variant || 'default'}`,
                onClick,
                ...props
            };
            const content = [
                startIcon && React.createElement('span', {key: 'icon', className: 'start-icon'}, startIcon),
                children
            ];
            return React.createElement('button', buttonProps, ...content);
        },

        IconButton: ({children, onClick, ...props}: any) =>
            React.createElement('button', {'data-testid': 'mui-iconbutton', onClick, ...props}, children),

        // Feedback components
        Alert: ({children, severity, onClose, ...props}: any) => {
            const alertContent = [
                onClose && React.createElement('button', {
                    key: 'close',
                    'data-testid': 'alert-close-button',
                    onClick: onClose
                }, '×'),
                children
            ];
            return React.createElement('div', {'data-testid': `mui-alert-${severity}`, ...props}, ...alertContent);
        },

        Snackbar: ({children, open, onClose, ...props}: any) =>
            open ? React.createElement('div', {'data-testid': 'mui-snackbar', ...props}, children) : null,

        LinearProgress: (props: any) =>
            React.createElement('div', {'data-testid': 'mui-progress', ...props}),

        // Typography
        Typography: ({children, variant, ...props}: any) =>
            React.createElement('div', {'data-testid': `mui-typography-${variant || 'body1'}`, ...props}, children),

        // Data display
        Badge: ({children, badgeContent, ...props}: any) => {
            const badgeContent_ = badgeContent &&
                React.createElement('span', {className: 'badge-content'}, badgeContent);
            return React.createElement('div', {'data-testid': 'mui-badge', ...props}, [badgeContent_, children]);
        },
        Pagination: ({count, page, onChange, ...props}) => {
            // Create pagination buttons (limited to 3 for simplicity)
            const buttons = [];
            for (let i = 1; i <= Math.min(count, 3); i++) {
                buttons.push(
                    React.createElement('button', {
                        key: i,
                        'data-testid': `pagination-button-${i}`,
                        onClick: () => onChange && onChange(null, i),
                        'aria-current': i === page ? 'page' : undefined
                    }, i)
                );
            }

            // Create pagination info
            const paginationInfo = React.createElement('span', {
                'data-testid': 'pagination-info'
            }, `Page ${page} of ${count}`);

            // Create pagination buttons container
            const paginationButtons = React.createElement('div', {
                'data-testid': 'pagination-buttons'
            }, buttons);

            // Create main pagination container
            return React.createElement('div', {
                'data-testid': 'mui-pagination',
                ...props
            }, [paginationInfo, paginationButtons]);
        }
    };
})

// Mock MUI X Date Pickers
vi.mock('@mui/x-date-pickers/DateCalendar', () => ({
    DateCalendar: ({onChange, onMonthChange, ...props}: any) => {
        const selectBtn = React.createElement('button', {onClick: () => onChange(new Date())}, 'Select Date');
        const monthBtn = React.createElement('button', {onClick: () => onMonthChange(new Date())}, 'Change Month');
        return React.createElement('div', {'data-testid': 'mui-datecalendar', ...props}, [selectBtn, monthBtn]);
    }
}));

vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
    LocalizationProvider: ({children, ...props}: any) =>
        React.createElement('div', props, children)
}));

vi.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
    AdapterDateFns: class {
    }
}));

vi.mock('@mui/x-date-pickers/PickersDay', () => ({
    PickersDay: ({day, ...props}: any) =>
        React.createElement('div', {'data-testid': 'mui-pickersday', ...props}, day.toString())
}));

// Mock MUI Icons
vi.mock('@mui/icons-material', () => ({
    Add: () => React.createElement('span', {'data-testid': 'mui-icon-add'}, '+'),
    Search: () => React.createElement('span', {'data-testid': 'mui-icon-search'}, '🔍'),
    Close: () => React.createElement('span', {'data-testid': 'mui-icon-close'}, '×'),
    Edit: () => React.createElement('span', {'data-testid': 'mui-icon-edit'}, '✏️'),
    Delete: () => React.createElement('span', {'data-testid': 'mui-icon-delete'}, '🗑️'),
    Upload: () => React.createElement('span', {'data-testid': 'mui-icon-upload'}, '⬆️'),
    DriveEta: () => React.createElement('span', {'data-testid': 'mui-icon-driveEta'}, '🚗'),
    DirectionsCar: () => React.createElement('span', {'data-testid': 'mui-icon-directionsCar'}, '🚘'),
    Handyman: () => React.createElement('span', {'data-testid': 'mui-icon-handyman'}, '🛠️'),
    Build: () => React.createElement('span', {'data-testid': 'mui-icon-build'}, '🔧'),
    CalendarMonth: () => React.createElement('span', {'data-testid': 'mui-icon-build'}, '📅'),
    Speed: () => React.createElement('span', {'data-testid': 'mui-icon-speed'}, '🏎️'),
    AttachMoney: () => React.createElement('span', {'data-testid': 'mui-icon-AttachMoney'}, '$'),
    AirlineSeatReclineNormal: () => React.createElement('span', {'data-testid': 'mui-icon-AirlineSeatReclineNormal'}, ''),
    Store: () => React.createElement('span', {'data-testid': 'mui-icon-Store'}, ''),
    Description: () => React.createElement('span', {'data-testid': 'mui-icon-Description'}, ''),
    ExpandMore: () => React.createElement('span', {'data-testid': 'mui-icon-ExpandMore'}, ''),
    EventAvailable: () => React.createElement('span', {'data-testid': 'mui-icon-EventAvailable'}, ''),
    ExpandLess: () => React.createElement('span', {'data-testid': 'mui-icon-ExpandLess'}, ''),


}));