import {VehicleType} from "@/types/types";
import {ListItemDetail} from "../index";
import {vehicleStatusMapping} from "@/constants/forms/vehicle";
import {Button, Container} from "@mui/material";
import {Delete, Edit, Handyman} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

interface VehicleProps {
    vehicle: VehicleType
    handleMaintenance: () => void
    handleVehicleEdition: () => void
    handleVehicleDeletion: () => void
}


const VehicleCardComponent = ({vehicle, handleMaintenance, handleVehicleDeletion, handleVehicleEdition}: VehicleProps) => {
    const [style, label] = vehicleStatusMapping[vehicle.status] || ["text-gray-500", "Unknown"];
    const {t} = useTranslation();
    return (
        <Container maxWidth="md">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 p-4">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Vehicle Details Section */}
                    <div className="flex-1 space-y-2">
                        <ListItemDetail
                            label={t('pages.vehicle.vehicles.card.name')}
                            value={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                            textStyle="text-txt font-medium"
                        />
                        <ListItemDetail
                            label={t('pages.vehicle.vehicles.card.purchaseDate')}
                            value={vehicle.purchase_date}
                            textStyle="text-txt"
                        />
                        <ListItemDetail
                            label={t('pages.vehicle.vehicles.card.capacity')}
                            value={vehicle.capacity}
                            textStyle="text-txt"
                        />
                        <ListItemDetail
                            label={t('pages.vehicle.vehicles.card.mileage')}
                            value={vehicle.mileage}
                            textStyle="text-txt"
                        />
                        <ListItemDetail
                            label={t('pages.vehicle.vehicles.card.nextServiceDue')}
                            value={vehicle.next_service_due}
                            textStyle="text-txt"
                        />
                        <ListItemDetail
                            label={t('pages.vehicle.vehicles.card.status')}
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
                            {t('common.edit')}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Delete/>}
                            color="error"
                            size="medium"
                            onClick={handleVehicleDeletion}
                        >
                            {t("common.delete")}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Handyman/>}
                            color="success"
                            size="medium"
                            onClick={handleMaintenance}
                        >
                            {t('pages.vehicle.vehicles.card.maintenance')}
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default VehicleCardComponent;