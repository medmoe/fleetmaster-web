import React from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
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
import {VehicleType} from "@/types/types";
import {useTranslation} from "react-i18next";
import {TOptions} from "i18next";

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
const vehicleTypes = ['CAR', 'MOTORCYCLE', 'TRUCK', 'VAN'];
const vehicleStatuses = ['ACTIVE', 'IN_MAINTENANCE', 'OUT_OF_SERVICE'];
const fuelTypes = ['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID'];

// Helper functions to create input groups
const createFirstInputTextPropsBlock = (
    vehicleData: VehicleType,
    handleChange: (name: string, value: string) => void,
    t: (key: string | string[], options?: TOptions) => string
): TextFieldProps[] => [
    {
        placeholder: t('pages.vehicle.vehicles.form.registration'),
        value: vehicleData.registration_number || "",
        onChange: handleChange,
        name: "registration_number"
    },
    {placeholder: t('pages.vehicle.vehicles.form.make'), value: vehicleData.make || "", onChange: handleChange, name: "make"},
    {placeholder: t('pages.vehicle.vehicles.form.model'), value: vehicleData.model || "", onChange: handleChange, name: "model"},
    {placeholder: t('pages.vehicle.vehicles.form.year'), value: vehicleData.year || "", onChange: handleChange, name: "year"},
    {placeholder: t('pages.vehicle.vehicles.form.vin'), value: vehicleData.vin || "", onChange: handleChange, name: "vin"},
];

const createSecondInputTextPropsBlock = (
    vehicleData: VehicleType,
    handleChange: (name: string, value: string) => void,
    t: (key: string | string[], options?: TOptions) => string
): TextFieldProps[] => [
    {placeholder: t('pages.vehicle.vehicles.form.color'), value: vehicleData.color || "", onChange: handleChange, name: "color"},
    {placeholder: t('pages.vehicle.vehicles.form.mileage'), value: vehicleData.mileage, onChange: handleChange, name: "mileage"},
    {placeholder: t('pages.vehicle.vehicles.form.capacity'), value: vehicleData.capacity, onChange: handleChange, name: "capacity"},
    {
        placeholder: t('pages.vehicle.vehicles.form.insurancePolicyNum'),
        value: vehicleData.insurance_policy_number || "",
        onChange: handleChange,
        name: "insurance_policy_number"
    },
    {placeholder: t('pages.vehicle.vehicles.form.notes'), value: vehicleData.notes || "", onChange: handleChange, name: "notes"}
];

const VehicleForm: React.FC<VehicleFormProps> = ({
                                                     vehicleData,
                                                     handleChange,
                                                     handleDateChange,
                                                     dates,
                                                     submitForm,
                                                     cancelSubmission,
                                                 }) => {
    const {t} = useTranslation();
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
                        {t('pages.vehicle.vehicles.form.title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{mt: 1}}>{t('pages.vehicle.vehicles.form.subtitle')}</Typography>
                </Box>

                <Box sx={{mt: 3}}>
                    {/* First block of text fields */}
                    <Grid container spacing={2}>
                        {createFirstInputTextPropsBlock(vehicleData, handleChange, t).map((field, idx) => (
                            <Grid key={idx}>
                                <TextField
                                    fullWidth
                                    label={field.placeholder}
                                    name={field.name}
                                    value={field.value}
                                    onChange={handleTextChange}
                                    variant="outlined"
                                    sx={{bgcolor: 'background.paper'}}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Vehicle Type Picker */}
                    <FormControl fullWidth sx={{mt: 2}}>
                        <InputLabel id="type-label">{t('pages.vehicle.vehicles.form.type.title')}</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            value={vehicleData.type || ''}
                            onChange={handleSelectChange}
                            label={t('pages.vehicle.vehicles.form.type.title')}
                        >
                            {vehicleTypes.map((type) => (
                                <MenuItem key={type} value={type}>{t(`pages.vehicle.vehicles.form.type.types.${type}`)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Vehicle Status Picker */}
                    <FormControl fullWidth sx={{mt: 2}}>
                        <InputLabel id="status-label">{t('pages.vehicle.vehicles.form.status.title')}</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={vehicleData.status || ''}
                            onChange={handleSelectChange}
                            label="Vehicle Status"
                        >
                            {vehicleStatuses.map((status) => (
                                <MenuItem key={status} value={status}>{t(`pages.vehicle.vehicles.form.status.statuses.${status}`)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Date Pickers */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={2} sx={{mt: 1}}>
                            <Grid>
                                <DatePicker
                                    label={t('pages.vehicle.vehicles.form.purchaseDate')}
                                    value={dates.purchase_date}
                                    onChange={(newValue) => handleDateChange('purchase_date', newValue)}
                                    slotProps={{
                                        textField: {fullWidth: true},
                                        popper: {disablePortal: true},
                                        openPickerIcon: {sx: {color: "#9c27b0"}}
                                    }}
                                />
                            </Grid>
                            <Grid>
                                <DatePicker
                                    label={t('pages.vehicle.vehicles.form.lastServiceDate')}
                                    value={dates.last_service_date}
                                    onChange={(newValue) => handleDateChange('last_service_date', newValue)}
                                    slotProps={{
                                        textField: {fullWidth: true},
                                        popper: {disablePortal: true},
                                        openPickerIcon: {sx: {color: "#9c27b0"}}
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{mt: 2}}>
                            <DatePicker
                                label={t('pages.vehicle.vehicles.form.nextServiceDue')}
                                value={dates.next_service_due}
                                onChange={(newValue) => handleDateChange('next_service_due', newValue)}
                                slotProps={{textField: {fullWidth: true}, popper: {disablePortal: true}, openPickerIcon: {sx: {color: "#9c27b0"}}}}
                            />
                        </Box>
                    </LocalizationProvider>

                    {/* Fuel Type Picker */}
                    <FormControl fullWidth sx={{mt: 2}}>
                        <InputLabel id="fuel-type-label">{t('pages.vehicle.vehicles.form.fuel.title')}</InputLabel>
                        <Select
                            labelId="fuel-type-label"
                            id="fuel_type"
                            name="fuel_type"
                            value={vehicleData.fuel_type || ''}
                            onChange={handleSelectChange}
                            label={t('pages.vehicle.vehicles.form.fuel.title')}
                        >
                            {fuelTypes.map((type) => (
                                <MenuItem key={type} value={type}>{t(`pages.vehicle.vehicles.form.fuel.types.${type}`)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* More Date Pickers */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={2} sx={{mt: 2}}>
                            <Grid>
                                <DatePicker
                                    label={t('pages.vehicle.vehicles.form.insuranceExpiryDate')}
                                    value={dates.insurance_expiry_date}
                                    onChange={(newValue) => handleDateChange('insurance_expiry_date', newValue)}
                                    slotProps={{
                                        textField: {fullWidth: true},
                                        popper: {disablePortal: true},
                                        openPickerIcon: {sx: {color: "#9c27b0"}}
                                    }}
                                />
                            </Grid>
                            <Grid>
                                <DatePicker
                                    label={t('pages.vehicle.vehicles.form.licenseExpiryDate')}
                                    value={dates.license_expiry_date}
                                    onChange={(newValue) => handleDateChange('license_expiry_date', newValue)}
                                    slotProps={{
                                        textField: {fullWidth: true},
                                        popper: {disablePortal: true},
                                        openPickerIcon: {sx: {color: "#9c27b0"}}
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>

                    {/* Second block of text fields */}
                    <Grid container spacing={2} sx={{mt: 1}}>
                        {createSecondInputTextPropsBlock(vehicleData, handleChange, t).map((field, idx) => (
                            <Grid key={idx}>
                                <TextField
                                    fullWidth
                                    label={field.placeholder}
                                    name={field.name}
                                    value={field.value}
                                    onChange={handleTextChange}
                                    variant="outlined"
                                    sx={{bgcolor: 'background.paper'}}
                                />
                            </Grid>
                        ))}
                    </Grid>
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
                        {t('common.submit')}
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={cancelSubmission}
                        sx={{mt: 1.5, py: 1.5, bgcolor: "#9BA1A6"}}
                    >
                        {t('common.cancel')}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default VehicleForm;