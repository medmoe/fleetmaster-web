import GroupedMetricsChart from './GroupedMetricsChart';
import {format} from 'date-fns';
import {render, screen} from '../../__test__/test-utils';
import {describe, expect, test, vi} from 'vitest';

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


})