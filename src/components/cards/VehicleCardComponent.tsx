import {VehicleType} from "@/types/types";
import {ListItemDetail} from "../index";
import {vehicleStatusMapping} from "@/constants/forms/vehicle";
import {Button, Container} from "@mui/material";
import {Delete, Edit, Handyman} from "@mui/icons-material";

interface VehicleProps {
    vehicle: VehicleType
    handleMaintenance: () => void
    handleVehicleEdition: () => void
    handleVehicleDeletion: () => void
}


const VehicleCardComponent = ({vehicle, handleMaintenance, handleVehicleDeletion, handleVehicleEdition}: VehicleProps) => {
    const [style, label] = vehicleStatusMapping[vehicle.status] || ["text-gray-500", "Unknown"];
    return (
        <Container maxWidth="md">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 p-4">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Vehicle Details Section */}
                    <div className="flex-1 space-y-2">
                        <ListItemDetail
                            label="Vehicle name"
                            value={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                            textStyle="text-txt font-medium"
                        />
                        <ListItemDetail
                            label="Purchase date"
                            value={vehicle.purchase_date}
                            textStyle="text-txt"
                        />
                        <ListItemDetail
                            label="Capacity"
                            value={vehicle.capacity}
                            textStyle="text-txt"
                        />
                        <ListItemDetail
                            label="Mileage"
                            value={vehicle.mileage}
                            textStyle="text-txt"
                        />
                        <ListItemDetail
                            label="Next service due"
                            value={vehicle.next_service_due}
                            textStyle="text-txt"
                        />
                        <ListItemDetail
                            label="Status"
                            value={label}
                            textStyle={`${style} font-medium`}
                        />
                    </div>

                    {/* Actions Section */}
                    <div className="flex flex-col space-y-3 md:self-start gap-2">
                        <Button
                            variant="outlined"
                            startIcon={<Edit/>}
                            size="medium"
                            onClick={handleVehicleEdition}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Delete/>}
                            color="error"
                            size="medium"
                            onClick={handleVehicleDeletion}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Handyman/>}
                            color="success"
                            size="medium"
                            onClick={handleMaintenance}
                        >
                            Maintenance
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default VehicleCardComponent;