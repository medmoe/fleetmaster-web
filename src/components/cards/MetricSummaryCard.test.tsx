// MetricSummaryCard.test.tsx
import {describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import MetricSummaryCard from './MetricSummaryCard';

// Mock Material-UI components
vi.mock('@mui/material', () => ({
    Card: ({children, elevation}: {children: React.ReactNode, elevation?: number}) => <div data-testid="card" data-elevation={elevation}>{children}</div>,
    CardContent: ({children}: {children: React.ReactNode}) => <div data-testid="card-content">{children}</div>,
    Grid: ({children, sx}: {children: React.ReactNode, sx?: any}) => <div data-testid="grid">{children}</div>,
    Typography: ({children, variant, color, sx, component}: {children: React.ReactNode, variant?: string, color?: string, sx?: any, component?: React.ElementType | string}) => (
        <div
            data-testid={`typography-${variant}`}
            data-color={color}
            data-component={component}
            data-has-sx={sx ? 'true' : 'false'}
        >
            {children}
        </div>
    ),
    SxProps: vi.fn(),
    Theme: vi.fn(),
}));

describe('MetricSummaryCard Component', () => {
    // Basic tests
    test('renders with required props only', () => {
        const props = {
            title: 'Test Title',
            value: '$1,000'
        };

        render(<MetricSummaryCard {...props} />);

        // Check title
        const titleElement = screen.getByTestId('typography-subtitle2');
        expect(titleElement).toHaveTextContent(props.title);
        expect(titleElement).toHaveAttribute('data-color', 'text.secondary');

        // Check value
        const valueElement = screen.getByTestId('typography-h4');
        expect(valueElement).toHaveTextContent(props.value);
        expect(valueElement).toHaveAttribute('data-component', 'div');

        // Subtitle should not be present
        expect(screen.queryByTestId('typography-caption')).not.toBeInTheDocument();

        // Check that card is rendered with correct elevation
        const cardElement = screen.getByTestId('card');
        expect(cardElement).toHaveAttribute('data-elevation', '2');
    });

    test('renders with subtitle when provided', () => {
        const props = {
            title: 'Test Title',
            value: '$1,000',
            subtitle: 'Test Subtitle'
        };

        render(<MetricSummaryCard {...props} />);

        // Check subtitle
        const subtitleElement = screen.getByTestId('typography-caption');
        expect(subtitleElement).toHaveTextContent(props.subtitle);
        expect(subtitleElement).toHaveAttribute('data-has-sx', 'true');

        // Other elements should still be present
        expect(screen.getByTestId('typography-subtitle2')).toHaveTextContent(props.title);
        expect(screen.getByTestId('typography-h4')).toHaveTextContent(props.value);
    });

    test('applies custom value styling when provided', () => {
        const props = {
            title: 'Test Title',
            value: '$1,000',
            valueStyling: {color: 'red', fontWeight: 'bold'}
        };

        render(<MetricSummaryCard {...props} />);

        // Check that the value has styling applied
        const valueElement = screen.getByTestId('typography-h4');
        expect(valueElement).toHaveAttribute('data-has-sx', 'true');
    });

    test('renders with all props', () => {
        const props = {
            title: 'Test Title',
            value: '$1,000',
            subtitle: 'Test Subtitle',
            valueStyling: {mt: 2, color: 'success.main'}
        };

        render(<MetricSummaryCard {...props} />);

        // Check all elements are present with correct content
        expect(screen.getByTestId('typography-subtitle2')).toHaveTextContent(props.title);
        expect(screen.getByTestId('typography-h4')).toHaveTextContent(props.value);
        expect(screen.getByTestId('typography-caption')).toHaveTextContent(props.subtitle);

        // Check styling is applied
        expect(screen.getByTestId('typography-h4')).toHaveAttribute('data-has-sx', 'true');
    });

    // Edge cases
    test('handles empty string value', () => {
        render(<MetricSummaryCard title="Test Title" value=""/>);

        const valueElement = screen.getByTestId('typography-h4');
        expect(valueElement).toHaveTextContent('');
    });

    test('handles very long title and value', () => {
        const longTitle = 'This is an extremely long title that might cause layout issues if not handled properly in the component';
        const longValue = '$1,000,000,000,000.00';

        render(<MetricSummaryCard title={longTitle} value={longValue}/>);

        expect(screen.getByTestId('typography-subtitle2')).toHaveTextContent(longTitle);
        expect(screen.getByTestId('typography-h4')).toHaveTextContent(longValue);
    });

    test('handles HTML entities in strings', () => {
        const titleWithHtml = 'Title with &lt;tags&gt;';
        const valueWithHtml = '&lt;script&gt;alert("test")&lt;/script&gt;';

        render(<MetricSummaryCard title={titleWithHtml} value={valueWithHtml}/>);

        expect(screen.getByTestId('typography-subtitle2')).toHaveTextContent(titleWithHtml);
        expect(screen.getByTestId('typography-h4')).toHaveTextContent(valueWithHtml);
    });

    // Special case tests
    test('renders correctly with number value instead of string', () => {
        // @ts-ignore - deliberately passing wrong type to test robustness
        render(<MetricSummaryCard title="Number Test" value={1000}/>);

        expect(screen.getByTestId('typography-h4')).toHaveTextContent('1000');
    });

    test('renders correctly with null value', () => {
        // @ts-ignore - deliberately passing wrong type to test robustness
        render(<MetricSummaryCard title="Null Test" value={null}/>);

        // Should not crash and render empty or "null" string
        const valueElement = screen.getByTestId('typography-h4');
        expect(valueElement.textContent).to.be.oneOf(['', 'null']);
    });

    test('renders correctly with undefined value', () => {
        // @ts-ignore - deliberately passing wrong type to test robustness
        render(<MetricSummaryCard title="Undefined Test" value={undefined}/>);

        // Should not crash and render empty or "undefined" string
        const valueElement = screen.getByTestId('typography-h4');
        expect(valueElement.textContent).to.be.oneOf(['', 'undefined']);
    });

    // Styling tests
    test('renders with proper grid configuration for responsive design', () => {
        render(<MetricSummaryCard title="Test" value="Value"/>);

        const gridElement = screen.getByTestId('grid');
        expect(gridElement).toBeInTheDocument();
    });

    test('correctly handles complex styling objects', () => {
        const complexStyling = {
            mt: 1,
            color: 'error.main',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            '&:hover': {
                opacity: 0.8
            }
        };

        render(<MetricSummaryCard title="Styling Test" value="Value" valueStyling={complexStyling}/>);

        // Just checking it doesn't crash and styling is applied
        expect(screen.getByTestId('typography-h4')).toHaveAttribute('data-has-sx', 'true');
    });
});