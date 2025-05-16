// DonutChart.test.tsx
import React from 'react';
import {render, screen} from '../../__test__/test-utils';
import {describe, expect, test, vi} from 'vitest';
import DonutChart, {DonutChartSegment} from './DonutChart';

// Create a mock theme object instead of trying to import createTheme
const mockTheme = {
    palette: {
        background: {
            paper: '#ffffff'
        },
        text: {
            secondary: '#757575'
        }
    }
};

// Mock the MUI components
vi.mock('@mui/material', async (importOriginal) => {
    const actual = await importOriginal() as Record<string, unknown>;
    return {
        ...actual,
        useTheme: () => mockTheme,
        Box: ({children, ...props}: { children: React.ReactNode}) => <div {...props}>{children}</div>,
        Typography: ({children, ...props}: { children: React.ReactNode}) => <div {...props}>{children}</div>
    };
});

describe('DonutChart Component', () => {
    // Sample test data
    const defaultSegments: DonutChartSegment[] = [
        {label: 'Segment 1', value: 30, color: '#ff0000'},
        {label: 'Segment 2', value: 40, color: '#00ff00'},
        {label: 'Segment 3', value: 30, color: '#0000ff'},
    ];

    const customTitle = 'Test Chart';

    // Basic rendering test
    test('renders the chart with title', () => {
        render(<DonutChart title={customTitle} segments={defaultSegments}/>);
        expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    // Test for rendering with default props
    test('renders with default props', () => {
        render(<DonutChart title={customTitle} segments={defaultSegments}/>);

        // Check segment labels
        defaultSegments.forEach(segment => {
            expect(screen.getByText(`${segment.label}: ${Math.round(segment.value ?? 0)}%`)).toBeInTheDocument();
        });
    });

    // Test hiding labels
    test('hides labels when showLabels is false', () => {
        render(
            <DonutChart
                title={customTitle}
                segments={defaultSegments}
                showLabels={false}
            />
        );

        // Should not show any segment labels
        defaultSegments.forEach(segment => {
            expect(screen.queryByText(`${segment.label}: ${Math.round(segment.value ?? 0)}%`)).not.toBeInTheDocument();
        });
    });

    // Test custom labels
    test('displays custom labels when provided', () => {
        const customLabels = {
            'Segment 1': 'Custom Label 1',
            'Segment 2': 'Custom Label 2',
        };

        render(
            <DonutChart
                title={customTitle}
                segments={defaultSegments}
                customLabels={customLabels}
            />
        );

        // Should show custom labels for specified segments
        expect(screen.getByText(`${customLabels['Segment 1']}: ${Math.round(defaultSegments[0].value ?? 0)}%`)).toBeInTheDocument();
        expect(screen.getByText(`${customLabels['Segment 2']}: ${Math.round(defaultSegments[1].value ?? 0)}%`)).toBeInTheDocument();

        // Segment 3 should use the default label
        expect(screen.getByText(`${defaultSegments[2].label}: ${Math.round(defaultSegments[2].value ?? 0)}%`)).toBeInTheDocument();
    });

    // Test handling null values
    test('handles null values in segments', () => {
        const segmentsWithNull: DonutChartSegment[] = [
            {label: 'Segment 1', value: 30, color: '#ff0000'},
            {label: 'Segment 2', value: null, color: '#00ff00'},
            {label: 'Segment 3', value: 30, color: '#0000ff'},
        ];

        render(<DonutChart title={customTitle} segments={segmentsWithNull}/>);

        // The null value segment should render with 0%
        expect(screen.getByText('Segment 2: 0%')).toBeInTheDocument();
    });

    // Test empty segments
    test('renders properly with empty segments array', () => {
        render(<DonutChart title={customTitle} segments={[]}/>);

        expect(screen.getByText(customTitle)).toBeInTheDocument();
        // Should still render the chart container but no labels
    });

    // Test with extreme values
    test('handles extreme percentage values correctly', () => {
        const extremeSegments: DonutChartSegment[] = [
            {label: 'Tiny', value: 0.1, color: '#ff0000'},
            {label: 'Huge', value: 99.9, color: '#00ff00'},
        ];

        render(<DonutChart title={customTitle} segments={extremeSegments}/>);

        expect(screen.getByText('Tiny: 0%')).toBeInTheDocument(); // rounded to 0%
        expect(screen.getByText('Huge: 100%')).toBeInTheDocument(); // rounded to 100%
    });

    // Test with a single segment (edge case)
    test('renders with a single segment', () => {
        const singleSegment: DonutChartSegment[] = [
            {label: 'Only Segment', value: 100, color: '#ff0000'},
        ];

        render(<DonutChart title={customTitle} segments={singleSegment}/>);

        expect(screen.getByText('Only Segment: 100%')).toBeInTheDocument();
    });
});