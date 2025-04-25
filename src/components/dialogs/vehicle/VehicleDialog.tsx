import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "react-i18next";
import {VehicleType} from "@/types/types.ts";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

interface VehicleDialogProps {
    openDialog: boolean;
    setOpenDialog: (value: boolean) => void;
    formData: VehicleType;
    handleFormChange: (name: string, value: string) => void;
    loading: boolean;
    handleSubmit: () => void;
    isEditing: boolean;
    formError: { isError: boolean, message: string };
    setFormError: (value: { isError: boolean, message: string }) => void;
}

const VehicleDialog = ({
                           openDialog,
                           setOpenDialog,
                           formError,
                           setFormError,
                           handleFormChange,
                           handleSubmit,
                           isEditing,
                           loading,
                           formData
                       }: VehicleDialogProps) => {
    const {t} = useTranslation();
    const theme = useTheme();
    return (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
            <DialogTitle>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    {isEditing ? t('pages.vehicle.dialog.edit') : t('pages.vehicle.dialog.add')}
                    <IconButton onClick={() => setOpenDialog(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {formError.isError && (
                    <Alert severity={"error"} sx={{mb: 3}} onClose={() => setFormError({isError: false, message: ""})}>
                        {formError.message}
                    </Alert>
                )}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'}, gap: 2, mt: 1}}>

                        {/*Identification and Basic Information : required fields: year, type, status, mileage, capacity*/}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}}}>
                            <Typography variant={"h6"} sx={{mb: 2}}>{t('pages.vehicle.dialog.sections.basic')}</Typography>
                        </Box>
                        <TextField
                            label={t('pages.vehicle.dialog.registration')}
                            value={formData.registration_number}
                            onChange={(e) => handleFormChange('registration_number', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label={t('pages.vehicle.dialog.vin')}
                            value={formData.vin}
                            onChange={(e) => handleFormChange('vin', e.target.value)}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel id={"vehicle-type-label"}>{t('pages.vehicle.dialog.type.title')}</InputLabel>
                            <Select
                                labelId={"vehicle-type-label"}
                                value={formData.type}
                                label={"pages.vehicle.dialog.type.title"}
                                onChange={(e) => handleFormChange('type', e.target.value)}
                            >
                                <MenuItem value={"CAR"}>{t('pages.vehicle.dialog.type.types.CAR')}</MenuItem>
                                <MenuItem value={"TRUCK"}>{t('pages.vehicle.dialog.type.types.TRUCK')}</MenuItem>
                                <MenuItem value={"MOTORCYCLE"}>{t('pages.vehicle.dialog.type.types.MOTORCYCLE')}</MenuItem>
                                <MenuItem value={"VAN"}>{t('pages.vehicle.dialog.type.types.VAN')}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id={"vehicle-status-label"}>{t('pages.vehicle.dialog.status.title')}</InputLabel>
                            <Select
                                labelId={"vehicle-status-label"}
                                value={formData.type}
                                label={"pages.vehicle.dialog.status.title"}
                                onChange={(e) => handleFormChange('status', e.target.value)}
                            >
                                <MenuItem value={"ACTIVE"}>{t('pages.vehicle.dialog.status.statuses.ACTIVE')}</MenuItem>
                                <MenuItem value={"IN_MAINTENANCE"}>{t('pages.vehicle.dialog.status.statuses.IN_MAINTENANCE')}</MenuItem>
                                <MenuItem value={"OUT_OF_SERVICE"}>{t('pages.vehicle.dialog.status.statuses.OUT_OF_SERVICE')}</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}, mt: 2}}>
                            <TextField
                                label={t('pages.vehicle.dialog.notes')}
                                value={formData.notes}
                                onChange={(e) => handleFormChange('notes', e.target.value)}
                                multiline
                                rows={3}
                                fullWidth
                            />
                        </Box>
                        <Divider sx={{gridColumn: {xs: '1', md: '1 / 3'}, my: 2}}/>

                        {/* Vehicle Specifications */}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}}}>
                            <Typography variant={"h6"} sx={{mb: 2}}>{t('pages.vehicle.dialog.sections.specs')}</Typography>
                        </Box>

                        <TextField
                            label={t('pages.vehicle.dialog.make')}
                            value={formData.make}
                            onChange={(e) => handleFormChange('make', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label={t('pages.vehicle.dialog.model')}
                            value={formData.model}
                            onChange={(e) => handleFormChange('model', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            required
                            label={t('pages.vehicle.dialog.year')}
                            value={formData.year}
                            onChange={(e) => handleFormChange('year', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label={t('pages.vehicle.dialog.color')}
                            value={formData.color}
                            onChange={(e) => handleFormChange('color', e.target.value)}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel id={"vehicle-fuel-label"}>{t('pages.vehicle.dialog.fuel.title')}</InputLabel>
                            <Select
                                labelId={"vehicle-fuel-label"}
                                value={formData.fuel_type}
                                label={"pages.vehicle.dialog.fuel.title"}
                                onChange={(e) => handleFormChange('fuel_type', e.target.value)}
                            >
                                <MenuItem value={"DIESEL"}>{t('pages.vehicle.dialog.fuel.types.DIESEL')}</MenuItem>
                                <MenuItem value={"GASOLINE"}>{t('pages.vehicle.dialog.fuel.types.GASOLINE')}</MenuItem>
                                <MenuItem value={"ELECTRIC"}>{t('pages.vehicle.dialog.fuel.types.ELECTRIC')}</MenuItem>
                                <MenuItem value={"HYBRID"}>{t('pages.vehicle.dialog.fuel.types.HYBRID')}</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            required
                            label={t('pages.vehicle.dialog.capacity')}
                            value={formData.capacity}
                            onChange={(e) => handleFormChange('capacity', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            required
                            label={t('pages.vehicle.dialog.mileage')}
                            value={formData.mileage}
                            onChange={(e) => handleFormChange('mileage', e.target.value)}
                            fullWidth
                        />
                        <Divider sx={{gridColumn: {xs: '1', md: '1 / 3'}, my: 2}}/>

                        {/* Dates */}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}}}>
                            <Typography variant={"h6"} sx={{mb: 2}}>{t('pages.vehicle.dialog.sections.dates')}</Typography>
                        </Box>
                        <DatePicker
                            label={t('pages.vehicle.dialog.purchaseDate')}
                            value={formData.purchase_date ? new Date(formData.purchase_date) : null}
                            onChange={(date) => handleFormChange('purchase_date', date ? date.toISOString().split('T')[0] : '')}
                            slotProps={{textField: {fullWidth: true}}}
                        />
                        <DatePicker
                            label={t('pages.vehicle.dialog.lastServiceDate')}
                            value={formData.last_service_date ? new Date(formData.last_service_date) : null}
                            onChange={(date) => handleFormChange('last_service_date', date ? date.toISOString().split('T')[0] : '')}
                            slotProps={{textField: {fullWidth: true}}}
                        />
                        <DatePicker
                            label={t('pages.vehicle.dialog.nextServiceDue')}
                            value={formData.next_service_due ? new Date(formData.next_service_due) : null}
                            onChange={(date) => handleFormChange('next_service_due', date ? date.toISOString().split('T')[0] : '')}
                            slotProps={{textField: {fullWidth: true}}}
                        />
                        <Divider sx={{gridColumn: {xs: '1', md: '1 / 3'}, my: 2}}/>

                        {/* Legal and Insurance */}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}}}>
                            <Typography variant={"h6"} sx={{mb: 2}}>{t('pages.vehicle.dialog.sections.legal')}</Typography>
                        </Box>
                        <TextField
                            label={t('pages.vehicle.dialog.insurancePolicyNum')}
                            value={formData.insurance_policy_number}
                            onChange={(e) => handleFormChange('insurance_policy_number', e.target.value)}
                            fullWidth
                        />
                        <DatePicker
                            label={t('pages.vehicle.dialog.insuranceExpiryDate')}
                            value={formData.insurance_expiry_date ? new Date(formData.insurance_expiry_date) : null}
                            onChange={(date) => handleFormChange('insurance_expiry_date', date ? date.toISOString().split('T')[0] : '')}
                            slotProps={{textField: {fullWidth: true}}}
                        />
                        <DatePicker
                            label={t('pages.vehicle.dialog.licenseExpiryDate')}
                            value={formData.license_expiry_date ? new Date(formData.license_expiry_date) : null}
                            onChange={(date) => handleFormChange('license_expiry_date', date ? date.toISOString().split('T')[0] : '')}
                            slotProps={{textField: {fullWidth: true}}}
                        />
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setOpenDialog(false)}
                    color={"inherit"}
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant={"contained"}
                    startIcon={loading && <CircularProgress size={20} color={"inherit"}/>}
                    sx={{
                        backgroundColor: theme.palette.custom.primary[600],
                        '&:hover': {backgroundColor: theme.palette.custom.primary[700]}
                    }}
                >
                    {isEditing ? t('pages.vehicle.dialog.updateButton') : t('pages.vehicle.dialog.addButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default VehicleDialog;