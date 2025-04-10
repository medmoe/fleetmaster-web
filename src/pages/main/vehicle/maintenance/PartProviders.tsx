import React, {useState} from "react";
import {
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
    IconButton,
    Stack,
    TextField
} from "@mui/material";
import {Add, Close, Delete} from "@mui/icons-material";
import useGeneralDataStore from "../../../../store/useGeneralDataStore.ts";
import {PartProviderCard} from "../../../../components";
import {PartProviderType} from "../../../../types/maintenance.ts";
import axios from "axios";
import {API} from "../../../../constants/endpoints.ts";

const PartProviders = () => {
    const {generalData, setGeneralData} = useGeneralDataStore();
    const [isLoading, setIsLoading] = useState(false);
    const [partProviderFormData, setPartProviderFormData] = useState<PartProviderType>({
        name: "",
        address: "",
        phone_number: ""
    });
    const [isPostRequest, setIsPostRequest] = useState(true);

    // Dialog states
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [partProviderToDelete, setPartProviderToDelete] = useState<string | undefined>(undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setPartProviderFormData({
            ...partProviderFormData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const options = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
            const url = isPostRequest
                ? `${API}maintenance/parts-providers/`
                : `${API}maintenance/parts-providers/${partProviderFormData.id}/`;

            const response = isPostRequest
                ? await axios.post(url, partProviderFormData, options)
                : await axios.put(url, partProviderFormData, options);

            if (isPostRequest) {
                setGeneralData({
                    ...generalData,
                    part_providers: [...generalData.part_providers, response.data]
                });
            } else {
                setGeneralData({
                    ...generalData,
                    part_providers: generalData.part_providers.map(partProvider =>
                        partProvider.id === partProviderFormData.id ? response.data : partProvider
                    )
                });
            }

            closeFormDialog();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (partProvider: PartProviderType) => {
        setPartProviderFormData(partProvider);
        setIsPostRequest(false);
        setOpenFormDialog(true);
    };

    const handleDeleteConfirm = (id?: string) => {
        setPartProviderToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!partProviderToDelete) return;

        setIsLoading(true);
        try {
            const options = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
            const url = `${API}maintenance/parts-providers/${partProviderToDelete}/`;
            await axios.delete(url, options);

            setGeneralData({
                ...generalData,
                part_providers: generalData.part_providers.filter(
                    partProvider => partProvider.id !== partProviderToDelete
                )
            });

            closeDeleteDialog();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const openAddDialog = () => {
        setPartProviderFormData({name: "", address: "", phone_number: ""});
        setIsPostRequest(true);
        setOpenFormDialog(true);
    };

    const closeFormDialog = () => {
        setOpenFormDialog(false);
        setPartProviderFormData({name: "", address: "", phone_number: ""});
        setIsPostRequest(true);
    };

    const closeDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setPartProviderToDelete(undefined);
    };

    return (
        <div className={"min-h-screen bg-gray-100 py-8"}>
            <div className={"w-full flex justify-center"}>
                <div className={"w-full max-w-3xl bg-white rounded-lg shadow p-5"}>
                    <div>
                        <h1 className={"font-semibold text-lg text-txt"}>Part Provider's List</h1>
                    </div>
                    <div className={"mt-5 flex items-center gap-2"}>
                        <p className={"font-open-sans text-txt"}>Here is the list of part providers.</p>
                        {isLoading && <CircularProgress color="primary" size={20} thickness={4}/>}
                    </div>
                    <div className={"mt-4 space-y-4"}>
                        {generalData.part_providers.map((partProvider) => (
                            <PartProviderCard
                                partProvider={partProvider}
                                handlePartProviderEdition={() => handleEdit(partProvider)}
                                handlePartProviderDeletion={() => handleDeleteConfirm(partProvider.id)}
                                key={partProvider.id}
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
                                Add part provider
                            </Button>
                        </Container>
                    </div>
                </div>
            </div>

            {/* Part Provider Form Dialog */}
            <Dialog
                open={openFormDialog}
                onClose={closeFormDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {isPostRequest ? "Add New Part Provider" : "Edit Part Provider"}
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
                            label="Provider Name"
                            fullWidth
                            value={partProviderFormData.name}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                        <TextField
                            name="address"
                            label="Address"
                            fullWidth
                            value={partProviderFormData.address}
                            onChange={handleChange}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                        <TextField
                            required
                            name="phone_number"
                            label="Phone Number"
                            fullWidth
                            value={partProviderFormData.phone_number}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{px: 3, pb: 3}}>
                    <Button
                        onClick={closeFormDialog}
                        color="inherit"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={isLoading || !partProviderFormData.name}
                        startIcon={isLoading ? <CircularProgress size={20}/> : null}
                    >
                        {isPostRequest ? "Add Provider" : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={closeDeleteDialog}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this part provider? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit"/> : <Delete/>}
                        disabled={isLoading}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PartProviders;