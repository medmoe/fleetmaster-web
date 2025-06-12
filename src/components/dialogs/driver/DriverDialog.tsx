import {Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {useTranslation} from "react-i18next";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DriverType} from "@/types/types.ts";
import useAuthStore from "@/store/useAuthStore.ts";
import {NotificationBar} from "@/components";

interface DriverDialogProps {
    openDialog: boolean;
    setOpenDialog: (value: boolean) => void;
    formData: DriverType;
    handleFormChange: (name: string, value: string) => void;
    loading: boolean;
    handleSubmit: () => void;
    isEditing: boolean;
    formError: { isError: boolean, message: string };
    setFormError: (value: { isError: boolean, message: string }) => void;
}

const DriverDialog = ({
                          openDialog,
                          setOpenDialog,
                          formError,
                          setFormError,
                          handleFormChange,
                          handleSubmit,
                          isEditing,
                          loading,
                          formData
                      }: DriverDialogProps) => {
    const {t} = useTranslation();
    const {authResponse} = useAuthStore();
    return (
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {isEditing ? t('pages.driver.dialog.edit') : t('pages.driver.dialog.add')}
                    <IconButton onClick={() => setOpenDialog(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'}, gap: 2, mt: 1}}>
                        {/* Personal Information */}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}}}>
                            <Typography variant="h6" sx={{mb: 2}}>{t('pages.driver.dialog.sections.personal')}</Typography>
                        </Box>

                        <TextField
                            required
                            label={t('pages.driver.dialog.firstName')}
                            value={formData.first_name}
                            onChange={(e) => handleFormChange('first_name', e.target.value)}
                            fullWidth
                        />

                        <TextField
                            required
                            label={t('pages.driver.dialog.lastName')}
                            value={formData.last_name}
                            onChange={(e) => handleFormChange('last_name', e.target.value)}
                            fullWidth
                        />

                        <TextField
                            required
                            label={t('pages.driver.dialog.phone')}
                            value={formData.phone_number}
                            onChange={(e) => handleFormChange('phone_number', e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label={t('pages.driver.dialog.email')}
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            fullWidth
                        />

                        <DatePicker
                            label={t('pages.driver.dialog.dob')}
                            value={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
                            onChange={(date) => handleFormChange('date_of_birth', date ? date.toISOString().split('T')[0] : '')}
                            slotProps={{textField: {fullWidth: true}}}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="employment-status-label">{t('pages.driver.dialog.status')}</InputLabel>
                            <Select
                                labelId="employment-status-label"
                                value={formData.employment_status}
                                label={t('pages.driver.dialog.status')}
                                onChange={(e) => handleFormChange('employment_status', e.target.value)}
                            >
                                <MenuItem value="ACTIVE">{t('pages.driver.dialog.statusOptions.active')}</MenuItem>
                                <MenuItem value="ON_LEAVE">{t('pages.driver.dialog.statusOptions.onLeave')}</MenuItem>
                                <MenuItem value="INACTIVE">{t('pages.driver.dialog.statusOptions.inactive')}</MenuItem>
                            </Select>
                        </FormControl>

                        <DatePicker
                            label={t('pages.driver.dialog.hireDate')}
                            value={formData.hire_date ? new Date(formData.hire_date) : null}
                            onChange={(date) => handleFormChange('hire_date', date ? date.toISOString().split('T')[0] : '')}
                            slotProps={{textField: {fullWidth: true}}}
                        />

                        {/* Divider */}
                        <Divider sx={{gridColumn: {xs: '1', md: '1 / 3'}, my: 2}}/>

                        {/* License Information */}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}}}>
                            <Typography variant="h6" sx={{mb: 2}}>{t('pages.driver.dialog.sections.license')}</Typography>
                        </Box>

                        <TextField
                            label={t('pages.driver.dialog.licenseNumber')}
                            value={formData.license_number || ''}
                            onChange={(e) => handleFormChange('license_number', e.target.value)}
                            fullWidth
                        />

                        <DatePicker
                            label={t('pages.driver.dialog.licenseExpiry')}
                            value={formData.license_expiry_date ? new Date(formData.license_expiry_date) : null}
                            onChange={(date) => handleFormChange('license_expiry_date', date ? date.toISOString().split('T')[0] : '')}
                            slotProps={{textField: {fullWidth: true}}}
                        />

                        {/* Divider */}
                        <Divider sx={{gridColumn: {xs: '1', md: '1 / 3'}, my: 2}}/>

                        {/* Address Information */}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}}}>
                            <Typography variant="h6" sx={{mb: 2}}>{t('pages.driver.dialog.sections.address')}</Typography>
                        </Box>

                        <TextField
                            label={t('pages.driver.dialog.address')}
                            value={formData.address || ''}
                            onChange={(e) => handleFormChange('address', e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label={t('pages.driver.dialog.city')}
                            value={formData.city || ''}
                            onChange={(e) => handleFormChange('city', e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label={t('pages.driver.dialog.state')}
                            value={formData.state || ''}
                            onChange={(e) => handleFormChange('state', e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label={t('pages.driver.dialog.zipCode')}
                            value={formData.zip_code || ''}
                            onChange={(e) => handleFormChange('zip_code', e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label={t('pages.driver.dialog.country')}
                            value={formData.country || ''}
                            onChange={(e) => handleFormChange('country', e.target.value)}
                            fullWidth
                        />

                        {/* Divider */}
                        <Divider sx={{gridColumn: {xs: '1', md: '1 / 3'}, my: 2}}/>

                        {/* Emergency Contact */}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}}}>
                            <Typography variant="h6" sx={{mb: 2}}>{t('pages.driver.dialog.sections.emergency')}</Typography>
                        </Box>

                        <TextField
                            label={t('pages.driver.dialog.emergencyName')}
                            value={formData.emergency_contact_name || ''}
                            onChange={(e) => handleFormChange('emergency_contact_name', e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label={t('pages.driver.dialog.emergencyPhone')}
                            value={formData.emergency_contact_phone || ''}
                            onChange={(e) => handleFormChange('emergency_contact_phone', e.target.value)}
                            fullWidth
                        />

                        {/* Divider */}
                        <Divider sx={{gridColumn: {xs: '1', md: '1 / 3'}, my: 2}}/>

                        {/* Vehicle Assignment */}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}}}>
                            <Typography variant="h6" sx={{mb: 2}}>{t('pages.driver.dialog.sections.vehicle')}</Typography>
                        </Box>

                        <FormControl fullWidth>
                            <InputLabel id="assigned-vehicle-label">{t('pages.driver.dialog.assignedVehicle')}</InputLabel>
                            <Select
                                labelId="assigned-vehicle-label"
                                value={formData.vehicle || ''}
                                label={t('pages.driver.dialog.assignedVehicle')}
                                onChange={(e) => handleFormChange('vehicle', e.target.value)}
                            >
                                <MenuItem value="">{t('pages.driver.dialog.noVehicle')}</MenuItem>
                                {/* This would need to be populated with actual vehicles from an API call or context */}
                                {authResponse?.vehicles?.map(vehicle => (
                                    <MenuItem key={vehicle.id} value={vehicle.id}>
                                        {vehicle.model} {vehicle.make} {vehicle.year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Notes */}
                        <Box sx={{gridColumn: {xs: '1', md: '1 / 3'}, mt: 2}}>
                            <TextField
                                label={t('pages.driver.dialog.notes')}
                                value={formData.notes || ''}
                                onChange={(e) => handleFormChange('notes', e.target.value)}
                                multiline
                                rows={3}
                                fullWidth
                            />
                        </Box>
                    </Box>
                </LocalizationProvider>
            </DialogContent>

            <DialogActions sx={{px: 3, py: 2}}>
                <Button
                    onClick={() => setOpenDialog(false)}
                    color="inherit"
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !formData.first_name || !formData.last_name || !formData.phone_number || !formData.license_expiry_date || !formData.date_of_birth || !formData.hire_date || !formData.license_number}
                    startIcon={loading && <CircularProgress size={20} color="inherit"/>}
                    sx={{
                        backgroundColor: '#3f51b5',
                        '&:hover': {backgroundColor: '#303f9f'}
                    }}
                >
                    {isEditing ? t('pages.driver.dialog.updateButton') : t('pages.driver.dialog.addButton')}
                </Button>
            </DialogActions>
            <NotificationBar snackbar={{open: formError.isError, message: formError.message, severity: 'error'}} setSnackbar={() => setFormError({isError: false, message: ""})}/>
        </Dialog>
    )
}

export default DriverDialog;