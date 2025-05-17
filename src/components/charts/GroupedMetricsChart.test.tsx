import GroupedMetricsChart from './GroupedMetricsChart';
import {format} from 'date-fns';
import {render, screen} from '../../__test__/test-utils';
import {describe, expect, test, vi} from 'vitest';

// Mock MUI components
vi.mock('@mui/material', () => {
    const actual = vi.importActual('@mui/material');
    return {
        ...actual,
        // Mock commonly used MUI components
        Box: vi.fn(({children, ...props}) => (
            <div data-testid="mui-box" {...props}>
                {children}
            </div>
        )),
        Paper: vi.fn(({children, ...props}) => (
            <div data-testid="mui-paper" {...props}>
                {children}
            </div>
        )),
        Typography: vi.fn(({children, variant, ...props}) => (
            <div data-testid={`mui-typography-${variant || 'default'}`} {...props}>
                {children}
            </div>
        )),
        Grid: vi.fn(({children, ...props}) => (
            <div data-testid="mui-grid" {...props}>
                {children}
            </div>
        )),
        Card: vi.fn(({children, ...props}) => (
            <div data-testid="mui-card" {...props}>
                {children}
            </div>
        )),
        CardContent: vi.fn(({children, ...props}) => (
            <div data-testid="mui-card-content" {...props}>
                {children}
            </div>
        )),
        Tooltip: vi.fn(({children, title, ...props}) => (
            <div data-testid={props['data-testid'] || 'mui-tooltip'} {...props}>
                <div data-testid="tooltip-title">{title}</div>
                <div data-testid="tooltip-children">{children}</div>
            </div>
        )),
        useTheme: vi.fn(() => ({
            palette: {
                primary: {main: '#1976d2', light: '#42a5f5'},
                success: {main: '#2e7d32'},
                error: {main: '#d32f2f'},
                warning: {main: '#ed6c02'},
                text: {
                    primary: '#000000',
                }
            },
            spacing: (factor: number) => `${8 * factor}px`
        }))
    };
});

// Sample test data
const yearlyData = {
    '2020': {yoy_change: -5.2, vehicle_avg: 5000},
    '2021': {yoy_change: 2.8, vehicle_avg: 5200},
    '2022': {yoy_change: -3.5, vehicle_avg: 4800}
};

const quarterlyData = {
    '2021-Q1': {qoq_change: -2.1, vehicle_avg: 1200},
    '2021-Q2': {qoq_change: 1.5, vehicle_avg: 1250},
    '2021-Q3': {qoq_change: 3.2, vehicle_avg: 1300},
    '2021-Q4': {qoq_change: -1.8, vehicle_avg: 1280}
};

const monthlyData = {
    '2022-01': {mom_change: -1.2, vehicle_avg: 400},
    '2022-02': {mom_change: 2.1, vehicle_avg: 410},
    '2022-03': {mom_change: 0.5, vehicle_avg: 412}
};

const emptyData = {};

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
}

describe("GroupedMetricsChart", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders with yearly data correctly', () => {
        render(<GroupedMetricsChart data={yearlyData} groupBy="yearly" title={"Yearly Metrics"}/>);

        // Check main title
        expect(screen.getByText("Yearly Metrics")).toBeInTheDocument();

        // Check period subtitle
        expect(screen.getByTestId("period-subtitle")).toHaveTextContent("Yearly comparison of average maintenance costs per vehicle");

        // Check Y-axis values
        expect(screen.getByTestId("Y-max-value")).toHaveTextContent("$5,200");
        expect(screen.getByTestId("Y-half-max-value")).toHaveTextContent("$2,600");
        expect(screen.getByTestId("Y-min-value")).toHaveTextContent("$0");

        // Check X-axis values
        Object.keys(yearlyData).forEach((key, index) => {
            expect(screen.getByTestId(`period-${index}`)).toHaveTextContent(key);
        })

        // Check overall trend indicator
        const element = screen.getByTestId("overall-trend-indicator");
        expect(element).toHaveTextContent("-2.0% savings");
    });

    test('renders with quarterly data correctly', () => {
        render(<GroupedMetricsChart data={quarterlyData} groupBy="quarterly" title={"Quarterly Metrics"}/>);

        expect(screen.getByText("Quarterly Metrics")).toBeInTheDocument();
        expect(screen.getByTestId("period-subtitle")).toHaveTextContent("Quarterly comparison of average maintenance costs per vehicle");

        expect(screen.getByTestId("Y-max-value")).toHaveTextContent("$1,300");
        expect(screen.getByTestId("Y-min-value")).toHaveTextContent("$0");

        Object.keys(quarterlyData).forEach((key, index) => {
            const [year, quarter] = key.split('-');
            expect(screen.getByTestId(`period-${index}`)).toHaveTextContent(`${quarter} ${year}`);
        });

        expect(screen.getByTestId("overall-trend-indicator")).toHaveTextContent("+0.2%");
    });

    test('renders with monthly data correctly', () => {
        render(<GroupedMetricsChart data={monthlyData} groupBy="monthly" title={"Monthly Metrics"}/>);

        expect(screen.getByText("Monthly Metrics")).toBeInTheDocument();
        expect(screen.getByTestId("period-subtitle")).toHaveTextContent("Monthly comparison of average maintenance costs per vehicle");

        expect(screen.getByTestId("Y-max-value")).toHaveTextContent("$412");
        expect(screen.getByTestId("Y-min-value")).toHaveTextContent("$0");

        Object.keys(monthlyData).forEach((key, index) => {
            const [year, month] = key.split('-');
            const monthNum = parseInt(month, 10);
            if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
                // Create date with the correct month (0-based index for months in JS)
                const date = new Date(parseInt(year), monthNum - 1, 1);
                expect(screen.getByTestId(`period-${index}`)).toHaveTextContent(format(date, 'MMM yyyy'));
            }
        });

        expect(screen.getByTestId("overall-trend-indicator")).toHaveTextContent("+0.5%");
    });

    test('renders with empty data', () => {
        render(<GroupedMetricsChart data={emptyData} groupBy="yearly" title={"Empty Data"}/>);

        expect(screen.getByText("Empty Data")).toBeInTheDocument();
        expect(screen.getByText("No data available for the selected filters")).toBeInTheDocument();
    });

    test('metric cards renders correctly', () => {
        render(<GroupedMetricsChart data={yearlyData} groupBy="yearly" title={"Yearly Metrics"}/>);

        Object.entries(yearlyData).forEach(([key, value], index) => {
            expect(screen.getByTestId(`period-label-${index}`)).toHaveTextContent(key);
            expect(screen.getByTestId(`period-value-${index}`)).toHaveTextContent(formatCurrency(value.vehicle_avg));
            expect(screen.getByTestId(`period-change-${index}`)).toHaveTextContent(
                value.yoy_change >= 0 ? `YoY: +${value.yoy_change}%` : `YoY: ${value.yoy_change}%`);
        });
    });

    test('tooltip renders correctly', () => {
        render(<GroupedMetricsChart data={yearlyData} groupBy="yearly" title={"Yearly Metrics"}/>);
        // Test each tooltip's content
        Object.entries(yearlyData).forEach(([year, data], index) => {
            // Find the specific tooltip by its index
            const tooltipContainer = screen.getByTestId(`tooltip-${index}`);
            expect(tooltipContainer).toBeInTheDocument();

            // Check the tooltip title content
            const tooltipTitle = tooltipContainer.querySelector('[data-testid="tooltip-title"]');
            expect(tooltipTitle).toBeInTheDocument();

            // Check for the period label
            expect(tooltipTitle).toHaveTextContent(year);

            // Check for the average value formatting
            expect(tooltipTitle).toHaveTextContent(`Average: ${formatCurrency(data.vehicle_avg)}`);

            // Check for the change value
            const changeValue = data.yoy_change;
            const formattedChange = changeValue >= 0 ? `+${changeValue.toFixed(1)}%` : `${changeValue.toFixed(1)}%`;
            expect(tooltipTitle).toHaveTextContent(`YoY Change: ${formattedChange}`);
        });
    })
});