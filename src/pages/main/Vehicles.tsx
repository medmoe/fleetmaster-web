import VehicleCardComponent from "../../components/cards/VehicleCardComponent.tsx";
import {VehicleType} from "../../types/types.ts";

const Vehicles = () => {
    const vehicle: VehicleType = {year: "2020", type: "Truck", status: "active", mileage: "30000", capacity: "3000"}
    return (
        <div className={"min-h-screen bg-gray-100 py-8"}>
            <div className={"w-full flex justify-center"}>
                <div className={"w-full max-w-3xl bg-white rounded-lg shadow p-5"}>
                    <div>
                        <h1 className={"font-semibold text-lg text-txt"}>Vehicle's list</h1>
                    </div>
                    <div className={"mt-5"}>
                        <p className={"font-open-sans text-txt"}>Here is the list of vehicles.</p>
                    </div>
                    <div className={"mt-4 space-y-4"}>
                        <VehicleCardComponent vehicle={vehicle}
                                              onPress={() => console.log("on press")}
                                              handleMaintenance={() => console.log("handleMaintenance")}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vehicles;