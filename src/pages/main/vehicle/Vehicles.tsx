import {Alert, Box, Button, Container, Divider, Snackbar, Typography, useTheme} from "@mui/material";
import {Add} from "@mui/icons-material";
import {DeleteVehicle, VehicleCardComponent} from "../../../components";
import {useVehicle} from "@/hooks/main/useVehicle";
import {useNavigate} from "react-router-dom";
import useGeneralDataStore from "../../../store/useGeneralDataStore";
import {VehicleType} from "@/types/types";
import {useTranslation} from "react-i18next";
import {Filter, VehicleDialog} from "@/components";

const Vehicles = () => {
    const {t} = useTranslation();
    const {
        openDialog,
        setOpenDialog,
        formData,
        handleFormChange,
        handleSubmit,
        loading,
        isEditing,
        formError,
        setFormError,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        filteredVehicles,
        vehicleToDelete,
        handleEditVehicle,
        handleDeleteConfirm,
        handleDeleteClick,
        openDeleteDialog,
        setOpenDeleteDialog,
        setSnackbar,
        snackbar
    } = useVehicle()

    const navigate = useNavigate()
    const theme = useTheme()
    const {setVehicle} = useGeneralDataStore()
    const menuItems = [
        {label: "pages.vehicle.filter.all", value: "ALL"},
        {label: "pages.vehicle.filter.active", value: "ACTIVE"},
        {label: "pages.vehicle.filter.onLeave", value: "ON_LEAVE"},
        {label: "pages.vehicle.filter.outOfService", value: "OUT_OF_SERVICE"},
    ]
    const handleVehicleMaintenance = (vehicle: VehicleType) => {
        setVehicle(vehicle)
        navigate(`/maintenance-overview`)
    }
    return (
        <Container maxWidth={'lg'} sx={{py: 4}}>
            <Box sx={{mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant={"h4"} component={"h1"} sx={{fontWeight: 'bold'}}>
                    {t('pages.vehicle.title')}
                </Typography>
                <Button variant="contained"
                        sx={{
                            backgroundColor: theme.palette.custom.primary[600],
                            '&:hover': {
                                backgroundColor: theme.palette.custom.primary[700]
                            }
                        }}
                        startIcon={<Add/>}
                        size={"large"}
                        onClick={() => setOpenDialog(true)}>
                    {t('pages.vehicle.addButton')}
                </Button>
            </Box>
            <Typography variant={"body1"} sx={{mb: 4}}>
                {t('pages.vehicle.subtitle')}
            </Typography>

            <Filter searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    inputLabel={'pages.vehicle.filter.status'}
                    filterInput={filterStatus}
                    setFilterInput={setFilterStatus}
                    items={menuItems}
            />

            <Typography variant={'subtitle1'} sx={{mb: 2}}>
                {filteredVehicles.length} {filteredVehicles.length === 1 ?
                t('pages.vehicle.resultsCount.single') :
                t('pages.vehicle.resultsCount.plural')
            }
            </Typography>

            <Divider sx={{mb: 4}}/>
            {filteredVehicles.length === 0 && (
                <Box sx={{textAlign: 'center', py: 8}}>
                    <Typography variant={"h6"} color="text.secondary" gutterBottom>
                        {searchQuery
                            ? t('pages.vehicle.noResults.withSearch')
                            : t('pages.vehicle.noResults.empty')
                        }
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {searchQuery
                            ? t('pages.vehicle.noResults.tryDifferent')
                            : t('pages.vehicle.noResults.addFirst')
                        }
                    </Typography>
                </Box>
            )}

            {filteredVehicles.map(vehicle => <VehicleCardComponent
                key={vehicle.id}
                vehicle={vehicle}
                handleVehicleEdition={() => handleEditVehicle(vehicle)}
                handleVehicleDeletion={() => handleDeleteClick(vehicle)}
                handleMaintenance={() => handleVehicleMaintenance(vehicle)}/>)
            }

            <VehicleDialog openDialog={openDialog}
                           setOpenDialog={setOpenDialog}
                           formData={formData}
                           handleFormChange={handleFormChange}
                           loading={loading}
                           handleSubmit={handleSubmit}
                           isEditing={isEditing}
                           formError={formError}
                           setFormError={setFormError}
            />

            <DeleteVehicle openDeleteDialog={openDeleteDialog}
                           setOpenDeleteDialog={setOpenDeleteDialog}
                           vehicleToDelete={vehicleToDelete}
                           handleDeleteConfirm={handleDeleteConfirm}
                           loading={loading}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    severity={snackbar.severity}
                    sx={{width: '100%', color: 'white'}}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Container>

    )
}

export default Vehicles;