// CoreMetricsCards.test.tsx
import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import CoreMetricsCards from './CoreMetricsCards';

// Mock dependencies
vi.mock('@mui/material', () => ({
    Grid: ({children, container, spacing, sx}: { children: React.ReactNode; container?: boolean; spacing?: number; sx?: any }) =>
        <div data-testid="grid" data-container={container} data-spacing={spacing}>
            {children}
        </div>,
    Typography: ({children, variant, sx}: { children: React.ReactNode; variant?: string; sx?: any }) =>
        <div data-testid={`typography-${variant}`}>{children}</div>,
    useTheme: () => ({
        palette: {
            success: {main: '#4caf50'},
            error: {main: '#f44336'}
        }
    })
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            // Map translation keys to mock values
            const translations: Record<string, string> = {
                'pages.maintenance.coreMetrics.fleetWideSpending': 'Fleet-Wide Spending',
                'pages.maintenance.coreMetrics.annualSpending': 'Annual Spending',
                'pages.maintenance.coreMetrics.quarterlySpending': 'Quarterly Spending',
                'pages.maintenance.coreMetrics.monthlySpending': 'Monthly Spending',
                'pages.maintenance.coreMetrics.yoyChange': 'Year-over-Year Change',
                'pages.maintenance.coreMetrics.lowerIsBetter': 'Lower is better',
                'pages.maintenance.coreMetrics.perVehicleAverages': 'Per-Vehicle Averages',
                'pages.maintenance.coreMetrics.annualAverage': 'Annual Average',
                'pages.maintenance.coreMetrics.quarterlyAverage': 'Quarterly Average',
                'pages.maintenance.coreMetrics.monthlyAverage': 'Monthly Average',
            };
            return translations[key] || key;
        }
    })
}));

vi.mock('@/components', () => ({
    MetricSummaryCard: ({title, value, valueStyling, subtitle}: { title: string; value: string | number; valueStyling?: { color?: string; [key: string]: any }; subtitle?: string }) => (
        <div data-testid="metric-summary-card">
            <div data-testid="card-title">{title}</div>
            <div data-testid="card-value">{value}</div>
            {subtitle && <div data-testid="card-subtitle">{subtitle}</div>}
            <div data-testid="card-styling">{JSON.stringify(valueStyling)}</div>
        </div>
    )
}));

// Sample data
const mockMetricsData = {
    yoy: -5.2,
    total_maintenance_cost: {
        year: {
            total: 125000,
            vehicle_avg: 2500
        },
        quarter: {
            total: 32500,
            vehicle_avg: 650
        },
        month: {
            total: 12000,
            vehicle_avg: 240
        }
    },
    top_recurring_issues: [],
    vehicle_health_metrics: {
        vehicle_avg_health: {good: 0, warning: 0, critical: 0},
        vehicle_insurance_health: {good: 0, warning: 0, critical: 0},
        vehicle_license_health: {good: 0, warning: 0, critical: 0},
    }
};

// Test with positive YoY change
const mockPositiveYoyData = {
    ...mockMetricsData,
    yoy: 3.8
};

describe('CoreMetricsCards Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders component with section headers', () => {
        render(<CoreMetricsCards standardMetrics={mockMetricsData}/>);

        // Check for section headers
        expect(screen.getByText('Fleet-Wide Spending')).toBeInTheDocument();
        expect(screen.getByText('Per-Vehicle Averages')).toBeInTheDocument();
    });

    test('renders all expected MetricSummaryCards', () => {
        render(<CoreMetricsCards standardMetrics={mockMetricsData}/>);

        // Should render 7 MetricSummaryCards in total
        const cards = screen.getAllByTestId('metric-summary-card');
        expect(cards).toHaveLength(7);

        // Check titles
        const titles = screen.getAllByTestId('card-title');
        expect(titles[0]).toHaveTextContent('Annual Spending');
        expect(titles[1]).toHaveTextContent('Quarterly Spending');
        expect(titles[2]).toHaveTextContent('Monthly Spending');
        expect(titles[3]).toHaveTextContent('Year-over-Year Change');
        expect(titles[4]).toHaveTextContent('Annual Average');
        expect(titles[5]).toHaveTextContent('Quarterly Average');
        expect(titles[6]).toHaveTextContent('Monthly Average');
    });

    test('formats currency values correctly', () => {
        render(<CoreMetricsCards standardMetrics={mockMetricsData}/>);

        const values = screen.getAllByTestId('card-value');

        // Check formatted currency values
        expect(values[0]).toHaveTextContent('$125,000');
        expect(values[1]).toHaveTextContent('$32,500');
        expect(values[2]).toHaveTextContent('$12,000');
        expect(values[4]).toHaveTextContent('$2,500');
        expect(values[5]).toHaveTextContent('$650');
        expect(values[6]).toHaveTextContent('$240');
    });

    test('formats percentage values correctly for negative YoY', () => {
        render(<CoreMetricsCards standardMetrics={mockMetricsData}/>);

        const values = screen.getAllByTestId('card-value');

        // Check formatted percentage with negative value (no + sign)
        expect(values[3]).toHaveTextContent('-5.2%');

        // Check for subtitle in YoY card
        expect(screen.getByTestId('card-subtitle')).toHaveTextContent('Lower is better');
    });

    test('formats percentage values correctly for positive YoY', () => {
        render(<CoreMetricsCards standardMetrics={mockPositiveYoyData}/>);

        const values = screen.getAllByTestId('card-value');

        // Check formatted percentage with positive value (includes + sign)
        expect(values[3]).toHaveTextContent('+3.8%');
    });

    test('applies correct color for negative YoY (green/success)', () => {
        render(<CoreMetricsCards standardMetrics={mockMetricsData}/>);

        const stylings = screen.getAllByTestId('card-styling');

        // Get YoY card styling (4th card)
        const yoyStyleData = JSON.parse(stylings[3].textContent || '{}');

        // Color should be success.main for negative YoY
        expect(yoyStyleData.color).toBe('#4caf50');
    });

    test('applies correct color for positive YoY (red/error)', () => {
        render(<CoreMetricsCards standardMetrics={mockPositiveYoyData}/>);

        const stylings = screen.getAllByTestId('card-styling');

        // Get YoY card styling (4th card)
        const yoyStyleData = JSON.parse(stylings[3].textContent || '{}');

        // Color should be error.main for positive YoY
        expect(yoyStyleData.color).toBe('#f44336');
    });

    test('handles edge cases with zero values', () => {
        const zeroData = {
            yoy: 0,
            total_maintenance_cost: {
                year: {
                    total: 0,
                    vehicle_avg: 0
                },
                quarter: {
                    total: 0,
                    vehicle_avg: 0
                },
                month: {
                    total: 0,
                    vehicle_avg: 0
                }
            },
            top_recurring_issues: [],
            vehicle_health_metrics: {
                vehicle_avg_health: {good: 0, warning: 0, critical: 0},
                vehicle_insurance_health: {good: 0, warning: 0, critical: 0},
                vehicle_license_health: {good: 0, warning: 0, critical: 0},
            }

        };

        render(<CoreMetricsCards standardMetrics={zeroData}/>);

        const values = screen.getAllByTestId('card-value');

        // Check zero values are formatted correctly
        values.forEach((val, index) => {
            if (index === 3) {
                // YoY percentage should be formatted as "+0.0%"
                expect(val).toHaveTextContent('0.0%');
            } else {
                // Currency values should be "$0"
                expect(val).toHaveTextContent('$0');
            }
        });
    });

    test('handles very large numbers correctly', () => {
        const largeData = {
            yoy: -15.7,
            total_maintenance_cost: {
                year: {
                    total: 9876543210,
                    vehicle_avg: 1234567
                },
                quarter: {
                    total: 2468135790,
                    vehicle_avg: 308517
                },
                month: {
                    total: 822711930,
                    vehicle_avg: 102839
                }
            },
            top_recurring_issues: [],
            vehicle_health_metrics: {
                vehicle_avg_health: {good: 0, warning: 0, critical: 0},
                vehicle_insurance_health: {good: 0, warning: 0, critical: 0},
                vehicle_license_health: {good: 0, warning: 0, critical: 0},
            }
        };

        render(<CoreMetricsCards standardMetrics={largeData}/>);

        const values = screen.getAllByTestId('card-value');

        // Check large numbers are formatted correctly with commas
        expect(values[0]).toHaveTextContent('$9,876,543,210');
        expect(values[1]).toHaveTextContent('$2,468,135,790');
        expect(values[2]).toHaveTextContent('$822,711,930');
        expect(values[4]).toHaveTextContent('$1,234,567');
        expect(values[5]).toHaveTextContent('$308,517');
        expect(values[6]).toHaveTextContent('$102,839');
    });

    test('handles extreme YoY values correctly', () => {
        const extremeYoyData = {
            ...mockMetricsData,
            yoy: -99.9
        };

        render(<CoreMetricsCards standardMetrics={extremeYoyData}/>);

        const values = screen.getAllByTestId('card-value');

        // Check extreme YoY value is formatted correctly
        expect(values[3]).toHaveTextContent('-99.9%');
    });
});