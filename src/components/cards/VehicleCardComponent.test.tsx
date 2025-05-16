import VehicleCardComponent from "./VehicleCardComponent";
import {fireEvent, render, screen} from '../../__test__/test-utils';
import {VehicleType} from "@/types/types";
import {expect, test, vi} from 'vitest';
import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event";

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
        expect(screen.getByText(`${mockVehicle.make} ${mockVehicle.model} ${mockVehicle.year}`)).toBeInTheDocument();
        expect(screen.getByText(`Purchase date: ${mockVehicle.purchase_date}`)).toBeInTheDocument();
        expect(screen.getByText(`Mileage: ${mockVehicle.mileage}`)).toBeInTheDocument();
        expect(screen.getByText(`Capacity: ${mockVehicle.capacity}`)).toBeInTheDocument();
        expect(screen.getByText(`Next service due: ${mockVehicle.next_service_due}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockVehicle.status.toLowerCase()}`)).toBeInTheDocument();

    })

    test('tooltips are visible when hovered over', async () => {
        render(
            <VehicleCardComponent vehicle={mockVehicle}
                                  handleMaintenance={mockHandleMaintenance}
                                  handleVehicleEdition={mockHandleEdit}
                                  handleVehicleDeletion={mockHandleDelete}
            />
        );
        // test action buttons
        for (const [id, text] of [['edit-vehicle-button', 'Edit'], ['delete-vehicle-button', 'Delete'], ['maintenance-vehicle-button', 'Maintenance']]) {
            await userEvent.hover(screen.getByTestId(id));
            expect(await screen.findByText(text)).toBeVisible();
        }
    })

    test('call handlers when (edit, delete, maintenance) buttons are clicked', () => {
        render(
            <VehicleCardComponent vehicle={mockVehicle}
                                  handleMaintenance={mockHandleMaintenance}
                                  handleVehicleEdition={mockHandleEdit}
                                  handleVehicleDeletion={mockHandleDelete}
            />
        );
        [["edit-vehicle-button", mockHandleEdit], ["delete-vehicle-button", mockHandleDelete], ["maintenance-vehicle-button", mockHandleMaintenance]].forEach(([id, handler]) => {
            fireEvent.click(screen.getByTestId(id));
            expect(handler).toHaveBeenCalledTimes(1)
        })
    })

})
