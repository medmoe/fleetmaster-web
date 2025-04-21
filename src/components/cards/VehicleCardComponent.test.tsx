import VehicleCardComponent from "./VehicleCardComponent";
import {fireEvent, render, screen} from '../../__test__/test-utils.tsx';
import {VehicleType} from "@/types/types";
import {expect, test, vi} from 'vitest';
import '@testing-library/jest-dom'

describe("VehicleCardComponent", () => {
    // Mock vehicle data
    const mockVehicle: VehicleType = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2021',
        purchase_date: '2021-01-02',
        capacity: '5',
        mileage: '100000',
        next_service_due: '2021-01-01',
        status: 'ACTIVE',
        type: 'car',
    };

    // Mock handler functions
    const mockHandleMaintenance = vi.fn();
    const mockHandleDelete = vi.fn();
    const mockHandleEdit = vi.fn();

    test("renders vehicle information correctly", () => {
        render(
            <VehicleCardComponent vehicle={mockVehicle}
                                  handleMaintenance={mockHandleMaintenance}
                                  handleVehicleEdition={mockHandleEdit}
                                  handleVehicleDeletion={mockHandleDelete}
            />
        );

        expect(screen.getByText('Toyota Corolla 2021')).toBeInTheDocument();
        expect(screen.getByText('2021-01-02')).toBeInTheDocument();
        expect(screen.getByText('100000')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('2021-01-01')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Maintenance')).toBeInTheDocument();

    })
    test('call handlers when (edit, delete, maintenance) buttons are clicked', () => {
        render(
            <VehicleCardComponent vehicle={mockVehicle}
                                  handleMaintenance={mockHandleMaintenance}
                                  handleVehicleEdition={mockHandleEdit}
                                  handleVehicleDeletion={mockHandleDelete}
            />
        );
        fireEvent.click(screen.getByText('Maintenance'));
        expect(mockHandleMaintenance).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByText('Edit'));
        expect(mockHandleEdit).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByText('Delete'));
        expect(mockHandleDelete).toHaveBeenCalledTimes(1);
    })

})
