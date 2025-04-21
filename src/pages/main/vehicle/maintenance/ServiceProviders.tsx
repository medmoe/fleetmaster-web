import {useState} from "react";
import {ServiceProviderCard} from "../../../../components";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";
import useGeneralDataStore from "../../../../store/useGeneralDataStore";
import {Add, Close, Delete} from "@mui/icons-material";
import {ServiceProviderType} from "@/types/maintenance";
import axios from "axios";
import {API} from "@/constants/endpoints.ts";
import {useTranslation} from "react-i18next";

const ServiceProviders = () => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        isError: false,
        message: ""
    });
    const {generalData, setGeneralData} = useGeneralDataStore();
    const [isPostRequest, setIsPostRequest] = useState(true);
    const [serviceProviderFormData, setServiceProviderFormData] = useState<ServiceProviderType>({
        name: "",
        address: "",
        phone_number: "",
        service_type: "MECHANIC"
    });

    // Dialog states
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [providerToDelete, setProviderToDelete] = useState<string | undefined>(undefined);

    const options = {headers: {"Content-Type": "application/json"}, withCredentials: true};
    const url = `${API}maintenance/service-providers/`;

    const handleEdit = (serviceProvider: ServiceProviderType) => {
        setServiceProviderFormData(serviceProvider);
        setIsPostRequest(false);
        setOpenFormDialog(true);
    };

    const handleDeleteConfirm = (id?: string) => {
        setProviderToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!providerToDelete) return;

        setIsLoading(true);
        try {
            await axios.delete(`${url}${providerToDelete}/`, options);
            setGeneralData({
                ...generalData,
                service_providers: generalData.service_providers.filter(
                    serviceProvider => serviceProvider.id !== providerToDelete
                )
            });
            closeDeleteDialog();
        } catch (error) {
            console.error(error);
            setError({
                isError: true,
                message: t('pages.vehicle.maintenance.serviceProviders.errors.deleteError')
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (name: string, value: string) => {
        setServiceProviderFormData({
            ...serviceProviderFormData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = isPostRequest
                ? await axios.post(url, serviceProviderFormData, options)
                : await axios.put(`${url}${serviceProviderFormData.id}/`, serviceProviderFormData, options);

            setGeneralData({
                ...generalData,
                service_providers: isPostRequest
                    ? [...generalData.service_providers, response.data]
                    : generalData.service_providers.map(serviceProvider =>
                        serviceProvider.id === serviceProviderFormData.id ? response.data : serviceProvider
                    )
            });

            closeFormDialog();
        } catch (error) {
            console.error(error);
            setError({
                isError: true,
                message: isPostRequest
                    ? t('pages.vehicle.maintenance.serviceProviders.errors.createError')
                    : t('pages.vehicle.maintenance.serviceProviders.errors.updateError')
            });
        } finally {
            setIsLoading(false);
        }
    };

    const openAddDialog = () => {
        setServiceProviderFormData({
            name: "",
            address: "",
            phone_number: "",
            service_type: "MECHANIC"
        });
        setIsPostRequest(true);
        setOpenFormDialog(true);
    };

    const closeFormDialog = () => {
        setOpenFormDialog(false);
        setServiceProviderFormData({
            name: "",
            address: "",
            phone_number: "",
            service_type: "MECHANIC"
        });
        setIsPostRequest(true);
    };

    const closeDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setProviderToDelete(undefined);
    };

    const handleCloseError = () => {
        setError({
            isError: false,
            message: ""
        });
    };

    return (
        <div className={"min-h-screen bg-gray-100 py-8"}>
            <div className={"w-full flex justify-center"}>
                <div className={"w-full max-w-3xl bg-white rounded-lg shadow p-5"}>
                    <div>
                        <h1 className={"font-semibold text-lg text-txt"}>{t('pages.vehicle.maintenance.serviceProviders.title')}</h1>
                    </div>
                    <div className={"mt-5 flex items-center gap-2"}>
                        <p className={"font-open-sans text-txt"}>{t('pages.vehicle.maintenance.serviceProviders.subtitle')}</p>
                    </div>

                    <Snackbar
                        open={error.isError}
                        autoHideDuration={6000}
                        onClose={handleCloseError}
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    >
                        <Alert onClose={handleCloseError} severity="error" sx={{width: '100%'}}>
                            {error.message}
                        </Alert>
                    </Snackbar>

                    <div className={"mt-4 space-y-4"}>
                        {generalData.service_providers.map((serviceProvider) => (
                            <ServiceProviderCard
                                serviceProvider={serviceProvider}
                                key={serviceProvider.id}
                                handleServiceProviderEdition={() => handleEdit(serviceProvider)}
                                handleServiceProviderDeletion={() => handleDeleteConfirm(serviceProvider.id)}
                            />
                        ))}
                        <Container maxWidth={"md"}>
                            <Button
                                variant="contained"
                                sx={{backgroundColor: "#3f51b5", '&:hover': {backgroundColor: "#3847a3"}}}
                                startIcon={<Add/>}
                                size={"large"}
                                onClick={openAddDialog}
                            >
                                {t('pages.vehicle.maintenance.serviceProviders.addButton')}
                            </Button>
                        </Container>
                    </div>
                </div>
            </div>

            {/* Service Provider Form Dialog */}
            <Dialog
                open={openFormDialog}
                onClose={closeFormDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {isPostRequest ? t('pages.vehicle.maintenance.serviceProviders.dialog.add') : t('pages.vehicle.maintenance.serviceProviders.dialog.edit')}
                        <IconButton edge="end" onClick={closeFormDialog}>
                            <Close/>
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Divider/>
                <DialogContent>
                    <Stack spacing={2} sx={{mt: 1}}>
                        <TextField
                            name="name"
                            label={t('pages.vehicle.maintenance.serviceProviders.dialog.name')}
                            fullWidth
                            value={serviceProviderFormData.name}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            variant="outlined"
                            required
                        />
                        <TextField
                            name="address"
                            label={t('pages.vehicle.maintenance.serviceProviders.dialog.address')}
                            fullWidth
                            value={serviceProviderFormData.address}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                        <TextField
                            required
                            name="phone_number"
                            label={t('pages.vehicle.maintenance.serviceProviders.dialog.phoneNumber')}
                            fullWidth
                            value={serviceProviderFormData.phone_number}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            variant="outlined"
                        />
                        <FormControl fullWidth>
                            <InputLabel id="service-type-label">{t('pages.vehicle.maintenance.serviceProviders.dialog.serviceType')}</InputLabel>
                            <Select
                                labelId="service-type-label"
                                name="service_type"
                                value={serviceProviderFormData.service_type}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                label={t('pages.vehicle.maintenance.serviceProviders.dialog.serviceType')}
                            >
                                <MenuItem value="MECHANIC">{t('pages.vehicle.maintenance.serviceProviders.dialog.serviceTypes.MECHANIC')}</MenuItem>
                                <MenuItem value="ELECTRICIAN">{t('pages.vehicle.maintenance.serviceProviders.dialog.serviceTypes.ELECTRICIAN')}</MenuItem>
                                <MenuItem value="CLEANING">{t('pages.vehicle.maintenance.serviceProviders.dialog.serviceTypes.CLEANING')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 3}}>
                    <Button
                        onClick={closeFormDialog}
                        color="inherit"
                        variant="outlined"
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={isLoading || !serviceProviderFormData.name}
                        startIcon={isLoading ? <CircularProgress size={20}/> : null}
                    >
                        {isPostRequest ? t('pages.vehicle.maintenance.serviceProviders.dialog.actions.add') : t('pages.vehicle.maintenance.serviceProviders.dialog.actions.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={closeDeleteDialog}
            >
                <DialogTitle>{t('pages.vehicle.maintenance.serviceProviders.deleteDialog.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('pages.vehicle.maintenance.serviceProviders.deleteDialog.subtitle')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit"/> : <Delete/>}
                        disabled={isLoading}
                    >
                        {t('common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ServiceProviders;