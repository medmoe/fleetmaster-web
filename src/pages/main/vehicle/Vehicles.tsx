import {Alert, Button, CircularProgress, Container} from "@mui/material";
import {Add} from "@mui/icons-material";
import {VehicleCardComponent, VehicleForm} from "../../../components";
import useAuthStore from "../../../store/useAuthStore";
import {useVehicle} from "@/hooks/main/useVehicle";
import {useNavigate} from "react-router-dom";
import useGeneralDataStore from "../../../store/useGeneralDataStore";
import {VehicleType} from "@/types/types";
import {useTranslation} from "react-i18next";

const Vehicles = () => {
    const {authResponse} = useAuthStore()
    const {t} = useTranslation();
    const {
        isLoading,
        showVehicleForm,
        vehicleDates,
        vehicleForm,
        errorState,
        setErrorState,
        setShowVehicleForm,
        handleVehicleFormChange,
        handleVehicleFormDateChange,
        handleVehicleEdition,
        handleVehicleDeletion,
        submitVehicleForm
    } = useVehicle()
    const typedVehicleDates = vehicleDates as {
        purchase_date: Date | null;
        last_service_date: Date | null;
        next_service_due: Date | null;
        insurance_expiry_date: Date | null;
        license_expiry_date: Date | null;
    }
    const navigate = useNavigate()
    const {setVehicle} = useGeneralDataStore()
    const handleVehicleMaintenance = (vehicle: VehicleType) => {
        setVehicle(vehicle)
        navigate(`/maintenance-overview`)
    }
    return (
        <div className={"min-h-screen bg-gray-100 py-8"}>
            {isLoading && (
                <div className={"w-full h-screen flex items-center justify-center"}>
                    <CircularProgress color="primary" size={200} thickness={5}/>
                </div>
            )}
            {errorState.isError && (
                <Alert severity="error"
                       sx={{
                           mb: 2,
                           position: 'fixed',
                           bottom: 16,
                           left: '50%',
                           transform: 'translateX(-50%)',
                           zIndex: 9999,
                           maxWidth: 'calc(100% - 32px'
                       }}
                       onClose={() => setErrorState({isError: false, errorMessage: ""})}>
                    {errorState.errorMessage}
                </Alert>
            )}
            {showVehicleForm ?
                <div>
                    <VehicleForm vehicleData={vehicleForm}
                                 submitForm={submitVehicleForm}
                                 cancelSubmission={() => setShowVehicleForm(false)}
                                 handleChange={handleVehicleFormChange}
                                 handleDateChange={handleVehicleFormDateChange}
                                 dates={typedVehicleDates}
                    /></div> :
                <div className={"w-full flex justify-center"}>
                    <div className={"w-full max-w-3xl bg-white rounded-lg shadow p-5"}>
                        <div>
                            <h1 className={"font-semibold text-lg text-txt"}>{t('pages.vehicle.vehicles.title')}</h1>
                        </div>
                        <div className={"mt-5"}>
                            <p className={"font-open-sans text-txt"}>{t('pages.vehicle.vehicles.subtitle')}</p>
                        </div>
                        <div className={"mt-4 space-y-4"}>
                            {authResponse?.vehicles?.map((vehicle) => {
                                return <VehicleCardComponent key={vehicle.id} vehicle={vehicle}
                                                             handleVehicleEdition={() => handleVehicleEdition(vehicle)}
                                                             handleVehicleDeletion={() => handleVehicleDeletion(vehicle)}
                                                             handleMaintenance={() => handleVehicleMaintenance(vehicle)}/>;
                            })}
                            <Container maxWidth={"md"}>
                                <Button variant="contained"
                                        sx={{
                                            backgroundColor: "#3f51b5",
                                            '&:hover': {
                                                backgroundColor: "#3847a3"
                                            }
                                        }}
                                        startIcon={<Add/>}
                                        size={"large"}
                                        onClick={() => setShowVehicleForm(true)}>
                                    {t('pages.vehicle.vehicles.addButton')}
                                </Button>
                            </Container>
                        </div>


                    </div>
                </div>
            }

        </div>
    )
}

export default Vehicles;