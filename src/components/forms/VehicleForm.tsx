import React from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid2,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {VehicleType} from "../../types/types.ts";

interface VehicleFormProps {
    vehicleData: VehicleType;
    handleChange: (name: string, value: string) => void;
    handleDateChange: (name: string, value: Date | null) => void;
    dates: {
        purchase_date: Date | null;
        last_service_date: Date | null;
        next_service_due: Date | null;
        insurance_expiry_date: Date | null;
        license_expiry_date: Date | null;
    };
    submitForm: () => void;
    cancelSubmission: () => void;
}

interface TextFieldProps {
    placeholder: string;
    value: string;
    onChange: (name: string, value: string) => void;
    name: string;
}

// Constants (assuming these would be imported from your constants file)
const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Van'];
const vehicleStatuses = ['Active', 'In maintenance', 'Out of service'];
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];

// Helper functions to create input groups
const createFirstInputTextPropsBlock = (
    vehicleData: VehicleType,
    handleChange: (name: string, value: string) => void
): TextFieldProps[] => [
    {placeholder: "Registration number", value: vehicleData.registration_number || "", onChange: handleChange, name: "registration_number"},
    {placeholder: "Make", value: vehicleData.make || "", onChange: handleChange, name: "make"},
    {placeholder: "Model", value: vehicleData.model || "", onChange: handleChange, name: "model"},
    {placeholder: "Year", value: vehicleData.year || "", onChange: handleChange, name: "year"},
    {placeholder: "Vin", value: vehicleData.vin || "", onChange: handleChange, name: "vin"},
];

const createSecondInputTextPropsBlock = (
    vehicleData: VehicleType,
    handleChange: (name: string, value: string) => void
): TextFieldProps[] => [
    {placeholder: "Color", value: vehicleData.color || "", onChange: handleChange, name: "color"},
    {placeholder: "Mileage", value: vehicleData.mileage, onChange: handleChange, name: "mileage"},
    {placeholder: "Capacity", value: vehicleData.capacity, onChange: handleChange, name: "capacity"},
    {
        placeholder: "Insurance policy number",
        value: vehicleData.insurance_policy_number || "",
        onChange: handleChange,
        name: "insurance_policy_number"
    },
    {placeholder: "Notes", value: vehicleData.notes || "", onChange: handleChange, name: "notes"}
];

const VehicleForm: React.FC<VehicleFormProps> = ({
                                                     vehicleData,
                                                     handleChange,
                                                     handleDateChange,
                                                     dates,
                                                     submitForm,
                                                     cancelSubmission,
                                                 }) => {
    // Create an adapter for MUI's handleChange to work with our API
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e.target.name, e.target.value);
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        handleChange(e.target.name, e.target.value);
    };

    return (
        <Container maxWidth="md" sx={{mt: 4}}>

            <Paper elevation={3} sx={{p: 4, borderRadius: 2}}>
                <Box>
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                        Vehicle Form
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{mt: 1}}>
                        Fill in vehicle's details below.
                    </Typography>
                </Box>

                <Box sx={{mt: 3}}>
                    {/* First block of text fields */}
                    <Grid2 container spacing={2}>
                        {createFirstInputTextPropsBlock(vehicleData, handleChange).map((field, idx) => (
                            <Grid2 key={idx}>
                                <TextField
                                    fullWidth
                                    label={field.placeholder}
                                    name={field.name}
                                    value={field.value}
                                    onChange={handleTextChange}
                                    variant="outlined"
                                    sx={{bgcolor: 'background.paper'}}
                                />
                            </Grid2>
                        ))}
                    </Grid2>

                    {/* Vehicle Type Picker */}
                    <FormControl fullWidth sx={{mt: 2}}>
                        <InputLabel id="type-label">Vehicle Type</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            value={vehicleData.type || ''}
                            onChange={handleSelectChange}
                            label="Vehicle Type"
                        >
                            {vehicleTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Vehicle Status Picker */}
                    <FormControl fullWidth sx={{mt: 2}}>
                        <InputLabel id="status-label">Vehicle Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={vehicleData.status || ''}
                            onChange={handleSelectChange}
                            label="Vehicle Status"
                        >
                            {vehicleStatuses.map((status) => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Date Pickers */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid2 container spacing={2} sx={{mt: 1}}>
                            <Grid2>
                                <DatePicker
                                    label="Purchase Date"
                                    value={dates.purchase_date}
                                    onChange={(newValue) => handleDateChange('purchase_date', newValue)}
                                    slotProps={{
                                        textField: {fullWidth: true},
                                        popper: {disablePortal: true},
                                        openPickerIcon: {sx: {color: "#9c27b0"}}
                                    }}
                                />
                            </Grid2>
                            <Grid2>
                                <DatePicker
                                    label="Last Service Date"
                                    value={dates.last_service_date}
                                    onChange={(newValue) => handleDateChange('last_service_date', newValue)}
                                    slotProps={{
                                        textField: {fullWidth: true},
                                        popper: {disablePortal: true},
                                        openPickerIcon: {sx: {color: "#9c27b0"}}
                                    }}
                                />
                            </Grid2>
                        </Grid2>

                        <Box sx={{mt: 2}}>
                            <DatePicker
                                label="Next Service Due"
                                value={dates.next_service_due}
                                onChange={(newValue) => handleDateChange('next_service_due', newValue)}
                                slotProps={{textField: {fullWidth: true}, popper: {disablePortal: true}, openPickerIcon: {sx: {color: "#9c27b0"}}}}
                            />
                        </Box>
                    </LocalizationProvider>

                    {/* Fuel Type Picker */}
                    <FormControl fullWidth sx={{mt: 2}}>
                        <InputLabel id="fuel-type-label">Fuel Type</InputLabel>
                        <Select
                            labelId="fuel-type-label"
                            id="fuel_type"
                            name="fuel_type"
                            value={vehicleData.fuel_type || ''}
                            onChange={handleSelectChange}
                            label="Fuel Type"
                        >
                            {fuelTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* More Date Pickers */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid2 container spacing={2} sx={{mt: 2}}>
                            <Grid2>
                                <DatePicker
                                    label="Insurance Expiry Date"
                                    value={dates.insurance_expiry_date}
                                    onChange={(newValue) => handleDateChange('insurance_expiry_date', newValue)}
                                    slotProps={{
                                        textField: {fullWidth: true},
                                        popper: {disablePortal: true},
                                        openPickerIcon: {sx: {color: "#9c27b0"}}
                                    }}
                                />
                            </Grid2>
                            <Grid2>
                                <DatePicker
                                    label="License Expiry Date"
                                    value={dates.license_expiry_date}
                                    onChange={(newValue) => handleDateChange('license_expiry_date', newValue)}
                                    slotProps={{
                                        textField: {fullWidth: true},
                                        popper: {disablePortal: true},
                                        openPickerIcon: {sx: {color: "#9c27b0"}}
                                    }}
                                />
                            </Grid2>
                        </Grid2>
                    </LocalizationProvider>

                    {/* Second block of text fields */}
                    <Grid2 container spacing={2} sx={{mt: 1}}>
                        {createSecondInputTextPropsBlock(vehicleData, handleChange).map((field, idx) => (
                            <Grid2 key={idx}>
                                <TextField
                                    fullWidth
                                    label={field.placeholder}
                                    name={field.name}
                                    value={field.value}
                                    onChange={handleTextChange}
                                    variant="outlined"
                                    sx={{bgcolor: 'background.paper'}}
                                />
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>

                {/* Action Buttons */}
                <Box sx={{mt: 3}}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={submitForm}
                        sx={{py: 1.5}}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={cancelSubmission}
                        sx={{mt: 1.5, py: 1.5, bgcolor: "#9BA1A6"}}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default VehicleForm;