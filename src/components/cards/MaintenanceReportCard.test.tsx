// MaintenanceReportCard.test.tsx
import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import MaintenanceReportCard from './MaintenanceReportCard';
import {MaintenanceReportWithStringsType} from '@/types/maintenance';
import {expect, test, vi} from 'vitest';
import '@testing-library/jest-dom'

// Mock data
const mockReport: MaintenanceReportWithStringsType = {
    id: '1',
    vehicle: 'v1',
    maintenance_type: 'PREVENTIVE',
    start_date: '2023-05-01',
    end_date: '2023-05-03',
    mileage: '15000',
    description: 'Regular oil change and filter replacement',
    total_cost: '350.75',
    vehicle_details: {
        year: '2009',
        type: 'truck',
        status: 'active',
        mileage: '50000',
        capacity: '3000',
        make: 'Toyota',
        model: 'Camry',
        color: 'red',
    },
    part_purchase_events: [
        {
            id: 'p1',
            cost: '50.25',
            part: '1',
            provider: '2',
            purchase_date: '2024-02-22',
            part_details: {
                id: 'part1',
                name: 'Oil Filter',
                description: 'description',
            }
        },
        {
            id: 'p2',
            cost: '25.50',
            part: '2',
            provider: '2',
            purchase_date: '2024-02-23',
            part_details: {
                id: 'part2',
                name: 'Air Filter',
                description: "description2"
            }
        }
    ],
    service_provider_events: [
        {
            id: 's1',
            cost: '275.00',
            service_date: '2024-02-24',
            service_provider: 'sp1',
            description: 'Labor and diagnostics',
            service_provider_details: {
                id: 'sp1',
                name: 'AutoCare Center',
                service_type: "MECHANIC",
                address: "address",
                phone_number: "989 898 8989"
            }
        }
    ]
};

// Empty report for edge case testing
const emptyReport: MaintenanceReportWithStringsType = {
    id: '2',
    vehicle: 'v2',
    maintenance_type: 'CURATIVE',
    start_date: '2023-06-01',
    end_date: "",
    mileage: '',
    description: '',
    total_cost: '',
    vehicle_details: {
        id: 'v2',
        make: '',
        model: '',
        color: '',
        year: '',
        type: '',
        status: '',
        mileage: '',
        capacity: '',
    },
    part_purchase_events: [],
    service_provider_events: []
};

describe('MaintenanceReportCard', () => {
    // Mock functions
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders basic report information correctly', () => {
        render(
            <MaintenanceReportCard
                report={mockReport}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        // Check vehicle info
        expect(screen.getByText(/Toyota Camry/)).toBeInTheDocument();

        // Check maintenance type
        expect(screen.getByText('PREVENTIVE')).toBeInTheDocument();

        // Check dates
        expect(screen.getByText(/May 1, 2023 to May 3, 2023/)).toBeInTheDocument();

        // Check mileage
        expect(screen.getByText(/Mileage:/)).toBeInTheDocument();
        expect(screen.getByText(/15000/)).toBeInTheDocument();

        // Check total cost
        expect(screen.getByText(/Total Cost:/)).toBeInTheDocument();
        expect(screen.getByText(/\$350.75/)).toBeInTheDocument();

        // Check description (collapsed state)
        expect(screen.getByText(/Regular oil change and filter replacement/)).toBeInTheDocument();
    });

    test('renders with empty/missing data gracefully', () => {
        render(
            <MaintenanceReportCard
                report={emptyReport}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText(/Unknown Vehicle/)).toBeInTheDocument();
        expect(screen.getByText(emptyReport.maintenance_type)).toBeInTheDocument();
        expect(screen.getByText(/Not recorded/)).toBeInTheDocument();
        expect(screen.getByText(/\$N\/A/)).toBeInTheDocument();
    });

    test('calls onEdit when edit button is clicked', () => {
        render(
            <MaintenanceReportCard
                report={mockReport}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const editButton = screen.getByRole('button', {name: /edit report/i});
        fireEvent.click(editButton);

        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnEdit).toHaveBeenCalledWith(mockReport);
    });

    test('calls onDelete when delete button is clicked', () => {
        render(
            <MaintenanceReportCard
                report={mockReport}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const deleteButton = screen.getByRole('button', {name: /delete report/i});
        fireEvent.click(deleteButton);

        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(mockReport);
    });

    test('expands and collapses when expand button is clicked', async () => {
        render(
            <MaintenanceReportCard
                report={mockReport}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        // Check initial state (collapsed)
        expect(screen.queryByText(/Parts Used/)).not.toBeInTheDocument();

        // Expand the card
        const expandButton = screen.getByRole('button', {name: /show more/i});
        fireEvent.click(expandButton);

        // Check expanded state
        expect(screen.getByText(/Parts Used/)).toBeInTheDocument();
        expect(screen.getByText(/Oil Filter/)).toBeInTheDocument();
        expect(screen.getByText(/Air Filter/)).toBeInTheDocument();
        expect(screen.getByText(/Service Providers/)).toBeInTheDocument();
        expect(screen.getByText(/AutoCare Center/)).toBeInTheDocument();
        expect(screen.getByText(/Labor and diagnostics/)).toBeInTheDocument();

        // Collapse the card
        fireEvent.click(expandButton);

        // Check collapsed state
        await waitFor(() => {
            expect(screen.queryByText(/Parts Used/)).not.toBeInTheDocument();
        })


    });

    test('calculates parts and service costs correctly', () => {
        render(
            <MaintenanceReportCard
                report={mockReport}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        // Expand the card to see costs
        const expandButton = screen.getByRole('button', {name: /show more/i});
        fireEvent.click(expandButton);

        // Check cost calculations
        expect(screen.getByText(/Parts Total: \$75.75/)).toBeInTheDocument();
        expect(screen.getByText(/Services Total: \$275.00/)).toBeInTheDocument();
    });

    test('handles reports with no parts or services', () => {
        render(
            <MaintenanceReportCard
                report={emptyReport}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        // Expand the card
        const expandButton = screen.getByRole('button', {name: /show more/i});
        fireEvent.click(expandButton);

        // Check empty state messages
        expect(screen.getByText(/No parts used in this maintenance./)).toBeInTheDocument();
        expect(screen.getByText(/No external service providers used for this maintenance./)).toBeInTheDocument();
    });

    test('renders correctly without optional handler props', () => {
        render(
            <MaintenanceReportCard report={mockReport}/>
        );

        // Edit and delete buttons should not be present
        expect(screen.queryByRole('button', {name: /edit report/i})).not.toBeInTheDocument();
        expect(screen.queryByRole('button', {name: /delete report/i})).not.toBeInTheDocument();

        // Expand functionality should still work
        const expandButton = screen.getByRole('button', {name: /show more/i});
        expect(expandButton).toBeInTheDocument();
    });

    test('formats dates correctly', () => {
        const reportWithDifferentDates: MaintenanceReportWithStringsType = {
            ...mockReport,
            start_date: '2023-12-25',
            end_date: '2024-01-01'
        };

        render(
            <MaintenanceReportCard report={reportWithDifferentDates}/>
        );

        expect(screen.getByText(/Dec 25, 2023 to Jan 1, 2024/)).toBeInTheDocument();
    });

    test('applies correct color for maintenance type chip', () => {
        // Test preventive maintenance (success color)
        const {rerender} = render(
            <MaintenanceReportCard report={mockReport}/>
        );

        const preventiveChip = screen.getByText('PREVENTIVE').closest('.MuiChip-root');
        expect(preventiveChip).toHaveClass('MuiChip-colorSuccess');

        // Test corrective maintenance (error color)
        rerender(
            <MaintenanceReportCard report={emptyReport}/>
        );

        const correctiveChip = screen.getByText("CURATIVE").closest('.MuiChip-root');
        expect(correctiveChip).toHaveClass('MuiChip-colorError');
    });
});