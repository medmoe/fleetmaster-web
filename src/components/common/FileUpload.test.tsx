import React from 'react';
import {fireEvent, render, screen} from "../../__test__/test-utils"
import FileUpload from "./FileUpload";
import {expect, test, vi} from 'vitest';
import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event";

describe('FileUpload', () => {
    // Mock functions
    const mockHandleCancel = vi.fn();
    const mockHandleUpload = vi.fn();
    const mockFile = new File(['name,description\npart1,test'], 'test.csv', {type: 'text/csv'});

    beforeEach(() => {
        vi.clearAllMocks()
    });

    test('renders basic file upload component', () => {
        render(
            <FileUpload onUpload={mockHandleUpload}/>
        )
        expect(screen.getByText('Import CSV File')).toBeInTheDocument()
        expect(screen.getByText('Drag & drop or click to select')).toBeInTheDocument();
        expect(screen.getByText('Only CSV Files accepted')).toBeInTheDocument();
        expect(screen.queryByTestId('cancel-upload-button')).toBeNull();
        expect(screen.queryByTestId('upload-button')).toBeNull();
    })

    test('handles file selection via input', async () => {
        const user = userEvent.setup();
        render(
            <FileUpload onUpload={mockHandleUpload}/>
        )
        const fileInput = screen.getByTestId('csv-upload-input') as HTMLInputElement
        await user.upload(fileInput, mockFile)

        expect(fileInput.files?.[0]).toEqual(mockFile);

        // Verify action buttons are visible
        expect(screen.getByTestId('cancel-upload-button')).toBeInTheDocument();
        expect(screen.getByTestId('upload-button')).toBeInTheDocument();
        expect(screen.getByText(mockFile.name)).toBeInTheDocument();
    })

    test('handle upload cancellation', async () => {
        render(<FileUpload onUpload={mockHandleUpload}/>)
        // Select a file to upload
        const fileInput = screen.getByTestId('csv-upload-input') as HTMLInputElement
        await userEvent.upload(fileInput, mockFile)
        expect(screen.getByTestId('cancel-upload-button')).toBeInTheDocument();

        // Cancel uploading
        const cancelBtn = screen.getByTestId('cancel-upload-button')
        fireEvent.click(cancelBtn)

        // Assertions
        expect(screen.getByText('Import CSV File')).toBeInTheDocument()
        expect(screen.queryByTestId('cancel-upload-button')).toBeNull();
        expect(screen.queryByTestId('upload-button')).toBeNull();

    })
})

