import React, {useState} from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import {getLocalDateString} from '@/utils/common';
import {MaintenanceReportWithStringsType, PartPurchaseEventWithNumbersType, ServiceProviderEventWithNumbersType} from '@/types/maintenance';
import useGeneralDataStore from '../../store/useGeneralDataStore';

interface NewReportDialogProps {
    open: boolean;
    onClose: () => void;
    handleAddPartPurchase: () => void;
    handleAddServiceEvent: () => void;
    handlePartPurchaseChange: (name: string, value: string) => void;
    handleServiceProviderChange: (name: string, value: string) => void;
    partPurchaseEvent: PartPurchaseEventWithNumbersType;
    serviceProviderEvent: ServiceProviderEventWithNumbersType;
    handleRemovePartPurchase: (idx: number) => void;
    handleRemoveServiceEvent: (idx: number) => void;
    maintenanceReportFormData: MaintenanceReportWithStringsType;
    handleMaintenanceReportFormChange: (name: string, value: string) => void;
    handleMaintenanceReportSubmission: () => void;
    errorState: { isError: boolean, message: string }
    isLoading: boolean;
    handleErrorClosing: () => void;
}

const NewMaintenanceReportDialog: React.FC<NewReportDialogProps> = ({
                                                                        errorState,
                                                                        handleAddPartPurchase,
                                                                        handleAddServiceEvent,
                                                                        handleErrorClosing,
                                                                        handleMaintenanceReportFormChange,
                                                                        handleMaintenanceReportSubmission,
                                                                        handlePartPurchaseChange,
                                                                        handleRemovePartPurchase,
                                                                        handleRemoveServiceEvent,
                                                                        handleServiceProviderChange,
                                                                        isLoading,
                                                                        maintenanceReportFormData,
                                                                        onClose,
                                                                        open,
                                                                        partPurchaseEvent,
                                                                        serviceProviderEvent,
                                                                    }) => {

    // Temporary states for part purchase and service provider forms
    const [showPartPurchaseForm, setShowPartPurchaseForm] = useState(false);
    const [showServiceProviderForm, setShowServiceProviderForm] = useState(false);
    const {generalData} = useGeneralDataStore();
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    New Maintenance Report
                    <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {errorState.isError && (
                    <Alert severity="error"
                           sx={{
                               position: 'fixed',
                               bottom: 16,
                               left: '50%',
                               transform: 'translateX(-50%)',
                               zIndex: 9999,
                               maxWidth: 'calc(100% - 32px'
                           }}
                           onClose={handleErrorClosing}
                    >
                        {errorState.message}
                    </Alert>
                )}
                <Grid container spacing={2}>
                    {/* Basic Report Info */}
                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="maintenance-type-label">Maintenance Type</InputLabel>
                            <Select
                                labelId="maintenance-type-label"
                                value={maintenanceReportFormData.maintenance_type}
                                name="maintenance_type"
                                onChange={(e) => handleMaintenanceReportFormChange(e.target.name, e.target.value)}
                                label="Maintenance Type"
                            >
                                <MenuItem value="PREVENTIVE">Preventive</MenuItem>
                                <MenuItem value="CURATIVE">Curative</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Mileage"
                            value={maintenanceReportFormData.mileage}
                            name="mileage"
                            onChange={(e) => handleMaintenanceReportFormChange(e.target.name, e.target.value)}
                            type="text"
                        />
                    </Grid>
                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Start Date"
                                value={maintenanceReportFormData.start_date ? new Date(`${maintenanceReportFormData.start_date}T12:00:00`) : null}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const localDate = new Date(
                                            newValue.getFullYear(),
                                            newValue.getMonth(),
                                            newValue.getDate(),
                                            12 // Set to noon to avoid timezone issues
                                        );
                                        handleMaintenanceReportFormChange('start_date', getLocalDateString(localDate));
                                    } else {
                                        handleMaintenanceReportFormChange('start_date', '');
                                    }
                                }}
                                slotProps={{
                                    textField: {fullWidth: true, margin: 'normal'},
                                    popper: {disablePortal: true},
                                    openPickerIcon: {sx: {color: "#9c27b0"}}
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="End Date"
                                value={maintenanceReportFormData.end_date ? new Date(`${maintenanceReportFormData.end_date}T12:00:00`) : null}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const localDate = new Date(
                                            newValue.getFullYear(),
                                            newValue.getMonth(),
                                            newValue.getDate(),
                                            12 // Set to noon to avoid timezone issues
                                        );
                                        handleMaintenanceReportFormChange('end_date', getLocalDateString(localDate));
                                    } else {
                                        handleMaintenanceReportFormChange('end_date', '');
                                    }
                                }}
                                slotProps={{
                                    textField: {fullWidth: true, margin: 'normal'},
                                    popper: {disablePortal: true},
                                    openPickerIcon: {sx: {color: "#9c27b0"}}
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Description"
                            name={"description"}
                            value={maintenanceReportFormData.description}
                            onChange={(e) => handleMaintenanceReportFormChange(e.target.name, e.target.value)}
                            multiline
                            rows={3}
                        />
                    </Grid>

                    {/* Part Purchases Section */}
                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                        <Typography variant="subtitle1" gutterBottom>
                            Part Purchases
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                            {maintenanceReportFormData.part_purchase_events.map((purchaseEvent, idx) => {
                                    const part = generalData.parts.find((part) => part.id === purchaseEvent.part);
                                    return (
                                        <Chip
                                            key={idx}
                                            label={`${part?.name} ($${purchaseEvent.cost})`}
                                            onDelete={() => handleRemovePartPurchase(idx)}
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    )
                                }
                            )}
                        </Box>

                        {showPartPurchaseForm ? (
                            <Box sx={{p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2}}>
                                <Grid container spacing={2}>
                                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                                        <Autocomplete
                                            fullWidth
                                            options={generalData.parts}
                                            getOptionLabel={(option) => option.name}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={generalData.parts.find((part) => part.id === partPurchaseEvent.id)}
                                            onChange={(_, newValue) => {
                                                handlePartPurchaseChange('part', newValue?.id || "");
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Part Name"
                                                    margin="normal"
                                                    error={!!partPurchaseEvent.part_details?.name &&
                                                        !generalData.parts.some(part =>
                                                            part.name === partPurchaseEvent.part_details?.name
                                                        )}
                                                    helperText={
                                                        partPurchaseEvent.part_details?.name &&
                                                        !generalData.parts.some(part =>
                                                            part.name === partPurchaseEvent.part_details?.name
                                                        ) ? "Part not found" : ""
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                                        <FormControl fullWidth>
                                            <InputLabel id={"parts-provider"}>Parts provider</InputLabel>
                                            <Select labelId={"parts-provider-label"}
                                                    name={"provider"}
                                                    value={partPurchaseEvent.provider}
                                                    onChange={(e) => handlePartPurchaseChange(e.target.name, e.target.value)}
                                                    label={"Parts Provider"}
                                            >
                                                {generalData.part_providers.map((provider) => (
                                                    <MenuItem key={provider.id} value={provider.id}>{provider.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                                            <DatePicker
                                                label="Purchase Date"
                                                value={partPurchaseEvent.purchase_date ? new Date(`${partPurchaseEvent.purchase_date}T12:00:00`) : null}
                                                onChange={(newValue) => {
                                                    if (newValue) {
                                                        const localDate = new Date(
                                                            newValue.getFullYear(),
                                                            newValue.getMonth(),
                                                            newValue.getDate(),
                                                            12 // Set to noon to avoid timezone issues
                                                        );
                                                        handlePartPurchaseChange('purchase_date', getLocalDateString(localDate))
                                                    }
                                                }}
                                                slotProps={{
                                                    textField: {fullWidth: true, margin: 'normal'},
                                                    popper: {disablePortal: true},
                                                    openPickerIcon: {sx: {color: "#9c27b0"}}
                                                }}
                                            />
                                        </Grid>
                                    </LocalizationProvider>
                                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                                        <TextField
                                            fullWidth
                                            label="Cost"
                                            name={"cost"}
                                            value={partPurchaseEvent.cost}
                                            onChange={(e) => handlePartPurchaseChange(e.target.name, e.target.value)}
                                            type="number"
                                        />
                                    </Grid>
                                </Grid>
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button
                                        onClick={() => setShowPartPurchaseForm(false)}
                                        sx={{mr: 1}}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            handleAddPartPurchase();
                                            setShowPartPurchaseForm(false);
                                        }}
                                        disabled={!partPurchaseEvent.part || !partPurchaseEvent.provider || !partPurchaseEvent.purchase_date}
                                    >
                                        Add Part
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Button
                                startIcon={<AddIcon/>}
                                onClick={() => setShowPartPurchaseForm(true)}
                                variant="outlined"
                                size="small"
                                sx={{mb: 2}}
                            >
                                Add Part Purchase
                            </Button>
                        )}
                    </Grid>

                    {/* Service Providers Section */}
                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                        <Typography variant="subtitle1" gutterBottom>
                            Services
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                            {maintenanceReportFormData.service_provider_events.map((serviceEvent, idx) => {
                                    const serviceProvider = generalData.service_providers.find((provider) => provider.id === serviceEvent.service_provider);
                                    return (
                                        <Chip
                                            key={idx}
                                            label={`${serviceProvider?.name}: ${serviceProvider?.service_type} ($${serviceEvent.cost})`}
                                            onDelete={() => handleRemoveServiceEvent(idx)}
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    )
                                }
                            )}
                        </Box>

                        {showServiceProviderForm ? (
                            <Box sx={{p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2}}>
                                <Grid container spacing={2}>
                                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                                        <FormControl fullWidth>
                                            <InputLabel id={"provider"}>Service provider</InputLabel>
                                            <Select labelId={"provider-label"}
                                                    name={"service_provider"}
                                                    value={serviceProviderEvent.service_provider}
                                                    onChange={(e) => handleServiceProviderChange(e.target.name, e.target.value)}
                                                    label={"Service Provider"}
                                            >
                                                {generalData.service_providers.map((provider) => (
                                                    <MenuItem key={provider.id} value={provider.id}>{provider.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                                            <DatePicker
                                                label="Service Date"
                                                value={serviceProviderEvent.service_date ? new Date(`${serviceProviderEvent.service_date}T12:00:00`) : null}
                                                onChange={(newValue) => {
                                                    if (newValue) {
                                                        // Ensure we're working with the correct local date
                                                        const localDate = new Date(
                                                            newValue.getFullYear(),
                                                            newValue.getMonth(),
                                                            newValue.getDate(),
                                                            12  // Set to noon to avoid timezone issues
                                                        );
                                                        handleServiceProviderChange('service_date', getLocalDateString(localDate));
                                                    }
                                                }}
                                                slotProps={{
                                                    textField: {fullWidth: true, margin: 'normal'},
                                                    popper: {disablePortal: true},
                                                    openPickerIcon: {sx: {color: "#9c27b0"}}
                                                }}
                                            />
                                        </Grid>
                                    </LocalizationProvider>
                                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                                        <TextField
                                            fullWidth
                                            label="Cost"
                                            name={"cost"}
                                            value={serviceProviderEvent.cost}
                                            onChange={(e) => handleServiceProviderChange(e.target.name, e.target.value)}
                                            type="number"
                                        />
                                    </Grid>
                                    <Grid sx={{width: {xs: "100%", sm: "50%"}}}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name={"description"}
                                            value={serviceProviderEvent.description}
                                            onChange={(e) => handleServiceProviderChange(e.target.name, e.target.value)}
                                            type="text"
                                        />
                                    </Grid>
                                </Grid>
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button
                                        onClick={() => setShowServiceProviderForm(false)}
                                        sx={{mr: 1}}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            handleAddServiceEvent()
                                            setShowServiceProviderForm(false)
                                        }}
                                        disabled={!serviceProviderEvent.service_provider || !serviceProviderEvent.service_date}
                                    >
                                        Add Service
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Button
                                startIcon={<AddIcon/>}
                                onClick={() => setShowServiceProviderForm(true)}
                                variant="outlined"
                                size="small"
                                color="primary"
                            >
                                Add Service Event
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleMaintenanceReportSubmission}
                    variant="contained"
                    color="primary"
                    disabled={!maintenanceReportFormData.maintenance_type || !maintenanceReportFormData.start_date || !maintenanceReportFormData.end_date}
                >
                    {isLoading && (
                        <CircularProgress size={24} color={"inherit"} sx={{mr: 1}}/>
                    )}
                    Save Report
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewMaintenanceReportDialog;