import {fireEvent, render, screen} from '@testing-library/react';
import ServiceProviderCard from './ServiceProviderCard';
import {ServiceProviderType} from "@/types/maintenance";
import {expect, it, vi} from 'vitest';

describe('ServiceProviderCard', () => {
    const mockServiceProvider: ServiceProviderType = {
        id: '1',
        name: 'Test Provider',
        phone_number: '123-456-7890',
        address: '123 Test St',
        service_type: 'MECHANIC'
    };

    const mockHandleEdit = vi.fn();
    const mockHandleDelete = vi.fn();

    it('renders service provider card with correct data', () => {
        render(
            <ServiceProviderCard
                serviceProvider={mockServiceProvider}
                handleServiceProviderEdition={mockHandleEdit}
                handleServiceProviderDeletion={mockHandleDelete}
            />
        );

        expect(screen.getByText(mockServiceProvider.name)).toBeInTheDocument();
        expect(screen.getByText(mockServiceProvider.service_type.toLowerCase())).toBeInTheDocument();
    });

    it('displays provider contact information', () => {
        render(
            <ServiceProviderCard
                serviceProvider={mockServiceProvider}
                handleServiceProviderEdition={mockHandleEdit}
                handleServiceProviderDeletion={mockHandleDelete}
            />
        );

        expect(screen.getByText(mockServiceProvider.phone_number)).toBeInTheDocument();
        expect(screen.getByText(mockServiceProvider.address)).toBeInTheDocument();
    });

    it('calls edit handler when edit button is clicked', () => {
        render(
            <ServiceProviderCard
                serviceProvider={mockServiceProvider}
                handleServiceProviderEdition={mockHandleEdit}
                handleServiceProviderDeletion={mockHandleDelete}
            />
        );

        fireEvent.click(screen.getByText('Edit'));
        expect(mockHandleEdit).toHaveBeenCalledTimes(1)
    });

    it('calls delete handler when delete button is clicked', () => {
        render(
            <ServiceProviderCard
                serviceProvider={mockServiceProvider}
                handleServiceProviderEdition={mockHandleEdit}
                handleServiceProviderDeletion={mockHandleDelete}
            />
        );

        fireEvent.click(screen.getByText('Delete'));
        expect(mockHandleDelete).toHaveBeenCalledTimes(1)
    });
})