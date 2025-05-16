// DateRangePicker.test.tsx
import {beforeEach, describe, expect, test, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import DateRangePicker from './DateRangePicker';
import React from "react";

// Create mock theme
const mockTheme = {
    palette: {
        primary: {
            main: '#1976d2'
        },
        text: {
            secondary: '#757575'
        }
    }
};

// Mock the MUI components
vi.mock('@mui/material', () => ({
    Box: ({children, className}: {children: React.ReactNode, className?: string}) => <div className={className}>{children}</div>,
    Typography: ({children}: {children: React.ReactNode, variant?: string, color?: string}) => <span>{children}</span>,
    useTheme: () => mockTheme
}));

// Mock the date pickers
vi.mock('@mui/x-date-pickers/DatePicker', () => ({
    DatePicker: ({
                     label,
                     value,
                     onChange,
                     disabled,
                     minDate,
                     maxDate,
                 }: {
                     label: string,
                     value: Date | null,
                     onChange: (date: Date | null) => void,
                     disabled?: boolean,
                     minDate?: Date,
                     maxDate?: Date,
                 }) => (
        <div data-testid={`date-picker-${label}`}>
            <label>{label}</label>
            <input
                type="date"
                data-testid={`input-${label}`}
                disabled={disabled}
                value={value instanceof Date ? value.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    onChange(date);
                }}
            />
            {minDate && <span data-testid={`min-date-${label}`}>{minDate.toISOString()}</span>}
            {maxDate && <span data-testid={`max-date-${label}`}>{maxDate.toISOString()}</span>}
        </div>
    )
}));

// Mock the LocalizationProvider
vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
    LocalizationProvider: ({children}: {children: React.ReactNode}) => <div>{children}</div>
}));

// Mock the AdapterDateFns
vi.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
    AdapterDateFns: function MockAdapter() {
    }
}));

describe('DateRangePicker Component', () => {
    const defaultProps = {
        startDate: null,
        endDate: null,
        onStartDateChange: vi.fn(),
        onEndDateChange: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders with default props', () => {
        render(<DateRangePicker {...defaultProps} />);

        expect(screen.getByText('Start Date')).toBeInTheDocument();
        expect(screen.getByText('End Date')).toBeInTheDocument();
        expect(screen.getByText('to')).toBeInTheDocument();

        // Check that both date pickers are enabled by default
        expect(screen.getByTestId('input-Start Date')).not.toBeDisabled();
        expect(screen.getByTestId('input-End Date')).not.toBeDisabled();
    });

    test('renders with custom labels', () => {
        render(
            <DateRangePicker
                {...defaultProps}
                startLabel="From"
                endLabel="To"
            />
        );

        expect(screen.getByText('From')).toBeInTheDocument();
        expect(screen.getByText('To')).toBeInTheDocument();
    });

    test('applies disabled state correctly', () => {
        render(<DateRangePicker {...defaultProps} disabled/>);

        expect(screen.getByTestId('input-Start Date')).toBeDisabled();
        expect(screen.getByTestId('input-End Date')).toBeDisabled();
    });

    test('respects min/max date constraints', () => {
        const minDate = new Date('2023-01-01');
        const maxDate = new Date('2023-12-31');

        render(
            <DateRangePicker
                {...defaultProps}
                minDate={minDate}
                maxDate={maxDate}
            />
        );

        expect(screen.getByTestId('min-date-Start Date')).toHaveTextContent(minDate.toISOString());
        expect(screen.getByTestId('max-date-End Date')).toHaveTextContent(maxDate.toISOString());
    });

    test('applies className correctly', () => {
        render(<DateRangePicker {...defaultProps} className="custom-class"/>);

        const container = document.querySelector('.custom-class');
        expect(container).toBeInTheDocument();
    });

    test('selecting start date calls onStartDateChange', async () => {
        render(<DateRangePicker {...defaultProps} />);

        const startDateInput = screen.getByTestId('input-Start Date');
        const testDate = '2023-06-15';

        fireEvent.change(startDateInput, {target: {value: testDate}});

        // Check if callback was called with correct Date object
        expect(defaultProps.onStartDateChange).toHaveBeenCalledTimes(1);
        const calledWithDate = defaultProps.onStartDateChange.mock.calls[0][0];
        expect(calledWithDate instanceof Date).toBe(true);
        expect(calledWithDate.toISOString().split('T')[0]).toBe(testDate);
    });

    test('selecting end date calls onEndDateChange', () => {
        render(<DateRangePicker {...defaultProps} />);

        const endDateInput = screen.getByTestId('input-End Date');
        const testDate = '2023-07-15';

        fireEvent.change(endDateInput, {target: {value: testDate}});

        // Check if callback was called with correct Date object
        expect(defaultProps.onEndDateChange).toHaveBeenCalledTimes(1);
        const calledWithDate = defaultProps.onEndDateChange.mock.calls[0][0];
        expect(calledWithDate instanceof Date).toBe(true);
        expect(calledWithDate.toISOString().split('T')[0]).toBe(testDate);
    });

    test('prevents selecting end date before start date', () => {
        const startDate = new Date('2023-06-15');

        render(
            <DateRangePicker
                {...defaultProps}
                startDate={startDate}
            />
        );

        // The minDate of end date picker should be equal to startDate
        expect(screen.getByTestId('min-date-End Date')).toHaveTextContent(startDate.toISOString());
    });

    test('prevents selecting start date after end date', () => {
        const endDate = new Date('2023-07-15');

        render(
            <DateRangePicker
                {...defaultProps}
                endDate={endDate}
            />
        );

        // The maxDate of start date picker should be equal to endDate
        expect(screen.getByTestId('max-date-Start Date')).toHaveTextContent(endDate.toISOString());
    });

    test('renders with predefined dates', () => {
        const startDate = new Date('2023-06-15');
        const endDate = new Date('2023-07-15');

        render(
            <DateRangePicker
                {...defaultProps}
                startDate={startDate}
                endDate={endDate}
            />
        );

        expect(screen.getByTestId('input-Start Date')).toHaveValue('2023-06-15');
        expect(screen.getByTestId('input-End Date')).toHaveValue('2023-07-15');
    });

    test('uses provided minDate when startDate is null', () => {
        const minDate = new Date('2023-01-01');

        render(
            <DateRangePicker
                {...defaultProps}
                minDate={minDate}
            />
        );

        // End date picker should use minDate when startDate is null
        expect(screen.getByTestId('min-date-End Date')).toHaveTextContent(minDate.toISOString());
    });

    test('uses provided maxDate when endDate is null', () => {
        const maxDate = new Date('2023-12-31');

        render(
            <DateRangePicker
                {...defaultProps}
                maxDate={maxDate}
            />
        );

        // Start date picker should use maxDate when endDate is null
        expect(screen.getByTestId('max-date-Start Date')).toHaveTextContent(maxDate.toISOString());
    });
});