import PartProviderCard from './PartProviderCard';
import {fireEvent, render, screen} from '../../__test__/test-utils.tsx';
import {PartProviderType} from "@/types/maintenance";
import {expect, it, vi} from 'vitest';
import '@testing-library/jest-dom'

describe('PartProviderCard', () => {
    const mockProvider: PartProviderType = {
        name: 'Test Provider',
        phone_number: '123-456-7890',
        address: '123 Test St',
        is_owner: true,
    };

    const mockHandleEdit = vi.fn();
    const mockHandleDelete = vi.fn();

    it('renders provider information correctly', () => {
        render(
            <PartProviderCard
                partProvider={mockProvider}
                handlePartProviderEdition={mockHandleEdit}
                handlePartProviderDeletion={mockHandleDelete}
            />
        );

        expect(screen.getByText(mockProvider.name)).toBeInTheDocument();
        expect(screen.getByText(mockProvider.phone_number)).toBeInTheDocument();
        expect(screen.getByText(mockProvider.address)).toBeInTheDocument();
    });

    it('calls edit handler when edit button is clicked', () => {
        render(
            <PartProviderCard
                partProvider={mockProvider}
                handlePartProviderEdition={mockHandleEdit}
                handlePartProviderDeletion={mockHandleDelete}
            />
        );

        fireEvent.click(screen.getByText('Edit'));
        expect(mockHandleEdit).toHaveBeenCalled();
    });

    it('calls delete handler when delete button is clicked', () => {
        render(
            <PartProviderCard
                partProvider={mockProvider}
                handlePartProviderEdition={mockHandleEdit}
                handlePartProviderDeletion={mockHandleDelete}
            />
        );

        fireEvent.click(screen.getByText('Delete'));
        expect(mockHandleDelete).toHaveBeenCalled();
    });
    it('hides action buttons when is_owner is false', () => {
        const mockProvider: PartProviderType = {
            name: 'Test Provider',
            phone_number: '123-456-7890',
            address: '123 Test St',
            is_owner: false,
        };
        render(
            <PartProviderCard partProvider={mockProvider}
                              handlePartProviderEdition={mockHandleEdit}
                              handlePartProviderDeletion={mockHandleDelete}
            />
        )
        expect(screen.queryByText('Edit')).not.toBeInTheDocument()
        expect(screen.queryByText('Delete')).not.toBeInTheDocument()

    })
})