import React from 'react';
import {render, screen, waitFor} from "../../../../__test__/test-utils";
import Parts from "./Parts";
import {beforeEach, describe, expect, test, vi} from 'vitest';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock FileUpload component
vi.mock('@/components', () => ({
    FileUpload: ({onUpload}: { onUpload: (file: File) => void }) => (
        <div data-testid="file-upload">
            <input
                type="file"
                data-testid="csv-upload-input"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        onUpload(e.target.files[0]);
                    }
                }}
            />
        </div>
    ),
    NotificationBar: ({snackbar, setSnackbar}: any) => (
        <div data-testid="notification-bar">
            {snackbar.open && (
                <div data-testid={`snackbar-${snackbar.severity}`}>
                    {snackbar.message}
                </div>
            )}
        </div>
    )
}));


// Create a persistent mock store that maintains state between renders
const mockParts = [
    {id: '1', name: 'Brake Pad', description: 'Front brake pads', isOwner: true},
    {id: '2', name: 'Oil Filter', description: 'Engine oil filter', isOwner: true},
    {id: '3', name: 'Air Filter', description: 'Engine air filter', isOwner: false}
];

const mockGeneralData = {
    parts: [...mockParts]
};

// Mock implementation with state closure
const mockSetGeneralData = vi.fn(newData => {
    mockGeneralData.parts = newData.parts;
});

// Use the actual mock implementation
vi.mock("../../../../store/useGeneralDataStore", () => ({
    default: () => ({
        generalData: mockGeneralData,
        setGeneralData: mockSetGeneralData
    })
}));

describe("Parts page", () => {
    beforeEach(() => {
        // Clear any previous mocks and reset mock store
        vi.clearAllMocks();
        mockGeneralData.parts = [...mockParts]; // Reset to original parts
    });

    test('renders basic parts page with title and search input', () => {
        render(<Parts/>);

        // Check for page title
        expect(screen.getByText('Parts Management')).toBeInTheDocument();

        // Check for search input with placeholder
        const searchInput = screen.getByPlaceholderText('Search parts...');
        expect(searchInput).toBeInTheDocument();

        // Check for Add Part button
        const addButton = screen.getByText('Add Part');
        expect(addButton).toBeInTheDocument();
    });

    test('displays list of parts from store', () => {
        render(<Parts/>);

        // Check if parts from the mock store are displayed
        expect(screen.getByText('Brake Pad')).toBeInTheDocument();
        expect(screen.getByText('Front brake pads')).toBeInTheDocument();
        expect(screen.getByText('Oil Filter')).toBeInTheDocument();
        expect(screen.getByText('Engine oil filter')).toBeInTheDocument();
    });

    test('filters parts when searching', async () => {
        const user = userEvent.setup();
        render(<Parts/>);

        // Type in search box
        const searchInput = screen.getByPlaceholderText('Search parts...');
        await user.type(searchInput, 'Brake');

        // Check that only matching parts are displayed
        expect(screen.getByText('Brake Pad')).toBeInTheDocument();
        expect(screen.queryByText('Oil Filter')).not.toBeInTheDocument();
    });

    test('opens add part dialog when clicking Add Part button', async () => {
        const user = userEvent.setup();
        render(<Parts/>);

        // Get the Add Part button
        const addButton = screen.getByText('Add Part');

        // First, click the button to open the dialog
        await user.click(addButton);

        // Then wait for the dialog content to appear
        await waitFor(() => {
            // Check if dialog appears with the correct title
            expect(screen.getByText('Add New Part')).toBeInTheDocument();
            const textFields = screen.getAllByTestId('mui-textfield');
            expect(textFields.length).toBe(3) // Total number including search field

            const nameField = textFields.find(field => field.getAttribute('label') === 'Part Name');
            expect(nameField).toBeInTheDocument()

            const descriptionField = textFields.find(field => field.getAttribute('label') === 'Description')
            expect(descriptionField).toBeInTheDocument()

        });
    });

    test('displays edit and delete buttons only for parts owned by user', () => {
        render(<Parts/>);

        // The first two parts should have edit/delete buttons (isOwner: true)
        const editButtons = screen.getAllByTestId('mui-icon-edit');
        const deleteButtons = screen.getAllByTestId('mui-icon-delete');

        // We expect 2 edit and 2 delete buttons (one for each owned part)
        expect(editButtons.length).toBe(2);
        expect(deleteButtons.length).toBe(2);
    });

    test('opens delete confirmation dialog when delete button is clicked', async () => {
        const user = userEvent.setup();
        render(<Parts/>);

        // Find and click the delete button for the first part
        const deleteButtons = screen.getAllByTestId('mui-icon-delete');
        await user.click(deleteButtons[0]);

        // Check if confirmation dialog appears
        await waitFor(() => {
            expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
            expect(screen.getByText('Are you sure you want to delete the part ? This action cannot be undone.'))

            expect(screen.getByText('Delete')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
        })

    });

    test('successfully adds a new part', async () => {
        const user = userEvent.setup();

        // Mock axios post to return a new part
        const mockNewPart = {id: '4', name: 'New Part', description: 'Test description', isOwner: true};
        axios.post = vi.fn().mockResolvedValue({data: mockNewPart});

        render(<Parts/>);

        // Open add dialog
        await user.click(screen.getByText('Add Part'));

        // Fill in form
        const textFields = screen.getAllByTestId('mui-textfield')
        const nameField = textFields.find(field => field.getAttribute('label') === 'Part Name');
        const descriptionField = textFields.find(field => field.getAttribute('label') === 'Description')
        if (!nameField || !descriptionField) {
            throw new Error('Could not find part name or description field');
        }
        await user.type(nameField, 'New Part');
        await user.type(descriptionField, 'Test description');

        const buttons = screen.getAllByTestId('mui-button-contained')
        const saveButton = buttons.find(button => button.textContent === 'Add Part')
        expect(saveButton).not.toBeUndefined();
        await user.click(saveButton!);

        // Check if API was called correctly
        expect(axios.post).toHaveBeenCalledTimes(1);

        // Check if store was updated
        await waitFor(() => {
            expect(mockSetGeneralData).toHaveBeenCalledTimes(1);
            const updatedData = mockSetGeneralData.mock.calls[0][0];
            expect(updatedData.parts).toContainEqual(mockNewPart);
        });
    });

    test('successfully updates an existing part', async () => {
        const user = userEvent.setup();

        // Mock axios put to return updated part
        const updatedPart = {...mockParts[0], name: 'Updated Brake Pad', description: 'Updated description'};
        axios.put = vi.fn().mockResolvedValue({data: updatedPart});

        render(<Parts/>);

        // Open edit dialog for first part
        const editButtons = screen.getAllByTestId('mui-icon-edit');
        await user.click(editButtons[0]);

        // Clear inputs and type new values
        const textFields = screen.getAllByTestId('mui-textfield')
        const nameField = textFields.find(field => field.getAttribute('label') === 'Part Name');
        const descriptionField = textFields.find(field => field.getAttribute('label') === 'Description')
        expect(nameField).not.toBeUndefined();
        expect(descriptionField).not.toBeUndefined();

        await user.clear(nameField!);
        await user.clear(descriptionField!);
        await user.type(nameField!, 'Updated Brake Pad');
        await user.type(descriptionField!, 'Updated description');

        // Submit form
        await user.click(screen.getByText('Save Changes'));

        // Check if API was called correctly
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(
            expect.stringContaining('1'),
            expect.objectContaining({
                id: '1',
                name: 'Updated Brake Pad',
                description: 'Updated description'
            }),
            expect.anything()
        );

        // Check if store was updated
        await waitFor(() => {
            expect(mockSetGeneralData).toHaveBeenCalledTimes(1);
        });
    });

    test('successfully deletes a part', async () => {
        const user = userEvent.setup();

        // Mock axios delete
        axios.delete = vi.fn().mockResolvedValue({});

        render(<Parts/>);

        // Open delete dialog for first part
        const deleteButtons = screen.getAllByTestId('mui-icon-delete');
        await user.click(deleteButtons[0]);

        // Confirm deletion
        await user.click(screen.getByText('Delete'));

        // Check if API was called correctly
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.delete).toHaveBeenCalledWith(
            expect.stringContaining('1'),
            expect.anything()
        );

        // Check if store was updated to remove the part
        await waitFor(() => {
            expect(mockSetGeneralData).toHaveBeenCalledTimes(1);
            const updatedData = mockSetGeneralData.mock.calls[0][0];
            expect(updatedData.parts).not.toContainEqual(expect.objectContaining({id: '1'}));
        });
    });

    test('handles file upload correctly', async () => {
        const user = userEvent.setup();

        // Mock axios post for file upload
        const mockUploadedParts = [
            {id: '4', name: 'Uploaded Part 1', description: 'CSV Part 1', isOwner: true},
            {id: '5', name: 'Uploaded Part 2', description: 'CSV Part 2', isOwner: true}
        ];
        axios.post = vi.fn().mockResolvedValue({data: mockUploadedParts});

        render(<Parts/>);

        // Create a test file and trigger upload
        const file = new File(['name,description\npart1,desc1'], 'test.csv', {type: 'text/csv'});
        const fileInput = screen.getByTestId('csv-upload-input');
        await user.upload(fileInput, file);

        // Check if API was called correctly
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);

            // FormData is hard to assert directly, so we just check the URL
            expect(axios.post.mock.calls[0][0]).toContain('upload-parts');
        });

        // Check if store was updated with new parts
        await waitFor(() => {
            expect(mockSetGeneralData).toHaveBeenCalledTimes(1);
            const updatedData = mockSetGeneralData.mock.calls[0][0];
            // Should contain original parts plus uploaded parts
            expect(updatedData.parts.length).toBe(mockParts.length + mockUploadedParts.length);
        });
    });

    test('shows error notification when API calls fail', async () => {
        const user = userEvent.setup();

        // Mock axios post to throw error
        axios.post = vi.fn().mockRejectedValue(new Error('API Error'));

        render(<Parts/>);

        // Open add dialog
        await user.click(screen.getByText('Add Part'));

        // Fill in form
        const textFields = screen.getAllByTestId('mui-textfield')
        const nameField = textFields.find(field => field.getAttribute('label') === 'Part Name');
        expect(nameField).not.toBeUndefined()
        await user.type(nameField!, 'New Part');

        // Submit form
        const buttons = screen.getAllByTestId('mui-button-contained')
        const saveButton = buttons.find(button => button.textContent === 'Add Part')
        expect(saveButton).not.toBeUndefined();
        await user.click(saveButton!);

        // Check if error notification appears
        await waitFor(() => {
            expect(screen.getByTestId('snackbar-error')).toBeInTheDocument();
            expect(screen.getByText('Error while creating part')).toBeInTheDocument();
        });
    });

    test('pagination controls work correctly', async () => {
        // Create more mock parts to test pagination
        const manyParts = Array.from({length: 20}, (_, i) => ({
            id: `${i + 10}`,
            name: `Part ${i + 10}`,
            description: `Description ${i + 10}`,
            isOwner: true
        }));

        mockGeneralData.parts = [...mockParts, ...manyParts];

        const user = userEvent.setup();
        render(<Parts/>);

        // Check total parts count
        expect(screen.getByText('23 total parts')).toBeInTheDocument();

        // First check that page 2 button exists
        expect(screen.getByTestId('pagination-button-2')).toBeInTheDocument();

        // Check that we start on page 1
        expect(screen.getByTestId('pagination-info')).toHaveTextContent('Page 1 of 3');

        // First page should show the first items by default
        // We should not see Part 17 on page 1
        expect(screen.queryByText('Part 17')).not.toBeInTheDocument();

        // Change to page 2
        await user.click(screen.getByTestId('pagination-button-2'));

        // Verify second page items are visible
        await waitFor(() => {
            // Using exact text match for pagination info to verify we're on page 2
            expect(screen.getByTestId('pagination-info')).toHaveTextContent('Page 2 of 3');

            // Check that Part 17 is now visible (should be on page 2)
            expect(screen.getByText('Part 17')).toBeInTheDocument();
        });

        // Change items per page
        await user.click(screen.getByTestId('mui-select'));
        await user.click(screen.getByRole('option', {name: '5'}));

        // After changing items per page, we should be back on page 1
        // await waitFor(() => {
        //     // We need to be exact here to match what's in the mock
        //     expect(screen.getByTestId('pagination-info')).toHaveTextContent('Page 1 of');
        // });
    });
});