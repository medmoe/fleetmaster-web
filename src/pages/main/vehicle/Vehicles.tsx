import {Button, CircularProgress, Container} from "@mui/material";
import {Add} from "@mui/icons-material";
import {VehicleCardComponent, VehicleForm} from "../../../components";
import useAuthStore from "../../../store/useAuthStore.ts";
import {useVehicle} from "../../../hooks/main/useVehicle.ts";
import ErrorAlert from "../../../components/common/ErrorAlert.tsx";
import {useNavigate} from "react-router-dom";
import useGeneralDataStore from "../../../store/useGeneralDataStore.ts";
import {VehicleType} from "../../../types/types.ts";

const Vehicles = () => {
    const {authResponse} = useAuthStore()
    const {
        isLoading,
        showVehicleForm,
        vehicleDates,
        vehicleForm,
        errorState,
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
            {isLoading && <div className={"w-full h-screen flex items-center justify-center"}>
                <CircularProgress color="primary" size={200} thickness={5}/>
            </div>}
            {showVehicleForm ?
                <div>
                    {errorState.isError && <ErrorAlert severity="error" message={errorState.errorMessage} key={errorState.errorMessage}/>}
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
                            <h1 className={"font-semibold text-lg text-txt"}>Vehicle's list</h1>
                        </div>
                        <div className={"mt-5"}>
                            <p className={"font-open-sans text-txt"}>Here is the list of vehicles.</p>
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
                                    Add vehicle
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