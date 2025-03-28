import {VehicleType} from "../../types/types.ts";
import {ListItemDetail} from "../index.ts";
import {vehicleStatusMapping} from "../../constants/forms/vehicle.ts";
import {Button, Container, IconButton} from "@mui/material";
import {Handyman} from "@mui/icons-material";

interface VehicleProps {
    vehicle: VehicleType
    onPress: () => void
    handleMaintenance: () => void
}


const VehicleCardComponent = ({vehicle, onPress, handleMaintenance}: VehicleProps) => {
    const [style, label] = vehicleStatusMapping[vehicle.status] || ["text-gray-500", "Unknown"];
    return (
        <Container maxWidth={"md"} className={"border-2 border-primary-500"}>
            <Button onClick={onPress}>
                <div className={"flex-row p-[16px] bg-white rounded shadow mt-3"}>
                    <div className={"flex-1"}>
                        <ListItemDetail label={"Vehicle name"} value={`${vehicle.make} ${vehicle.model} ${vehicle.year}`} textStyle={"text-txt"}/>
                        <ListItemDetail label={"Purchase date"} value={vehicle.purchase_date} textStyle={"text-txt"}/>
                        <ListItemDetail label={"Capacity"} value={vehicle.capacity} textStyle={"text-txt"}/>
                        <ListItemDetail label={"Mileage"} value={vehicle.mileage} textStyle={"text-txt"}/>
                        <ListItemDetail label={"Next service due"} value={vehicle.next_service_due} textStyle={"text-txt"}/>
                        <ListItemDetail label={"Status"} value={label} textStyle={style}/>
                    </div>

                </div>
            </Button>
            <IconButton onClick={handleMaintenance}>
                <Handyman color={"success"}/>
            </IconButton>
        </Container>
    )
}

export default VehicleCardComponent;