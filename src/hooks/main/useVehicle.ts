import {useState} from "react";
import {VehicleType} from "../../types/types.ts";
import {isPositiveInteger} from "../../utils/common.ts";
import {API} from "../../constants/endpoints.ts";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore.ts";


export const useVehicle = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [vehicleDates, setvehicleDates] = useState<Record<string, Date | null>>({
        purchase_date: null,
        last_service_date: new Date(),
        next_service_due: new Date(),
        insurance_expiry_date: new Date(),
        license_expiry_date: new Date(),
    })
    const [vehicleForm, setVehicleForm] = useState<VehicleType>({year: "", type: "", status: "", mileage: "", capacity: ""})
    const [isPostRequest, setIsPostRequest] = useState(true)
    const [errorState, setErrorState] = useState({
        errorMessage: "",
        isError: false,
    })
    const [showVehicleForm, setShowVehicleForm] = useState(false);

    const {addVehicle, editVehicle} = useAuthStore();
    const validateForm = (): [boolean, string] => {
        if (!isPositiveInteger(vehicleForm.year)) {
            return [false, "Year must be a positive number!"]
        }
        if (!isPositiveInteger(vehicleForm.mileage)) {
            return [false, "Mileage must be a positive number!"]
        }
        if (!isPositiveInteger(vehicleForm.capacity)) {
            return [false, "Capacity must be a positive number!"]
        }
        if (!vehicleForm.type) {
            return [false, "Vehicle type is required!"]
        }
        if (!vehicleForm.status) {
            return [false, "Vehicle status is required!"]
        }
        if (!vehicleForm.purchase_date) {
            return [false, "Vehicle purchase date is required!"]
        }
        return [true, ""]
    }

    const handleVehicleFormChange = (name: string, value: string) => {
        setVehicleForm(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }
    const handleVehicleFormDateChange = (name: string, value: Date | null) => {
        setvehicleDates(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }
    const submitVehicleForm = async () => {
        let vehicleDateKeys = ["purchase_date", "last_service_date", "next_service_due", "insurance_expiry_date", "license_expiry_date"]
        for (let key of vehicleDateKeys) {
            if (key in vehicleDates && vehicleDates[key] !== null) {
                vehicleForm[key as keyof VehicleType] = vehicleDates[key]?.toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                })
            }
        }
        const [isValid, errorMessage] = validateForm()
        if (!isValid) {
            setErrorState({
                errorMessage,
                isError: true,
            })
            return
        }
        setIsLoading(true)

        // format data
        vehicleForm["type"] = vehicleForm["type"].toUpperCase()
        vehicleForm["status"] = vehicleForm["status"].replace(/ /g, "_").toUpperCase()

        const url = isPostRequest ? `${API}vehicles/` : `${API}vehicles/${vehicleForm.id}/`;
        const options = {headers: {"Content-Type": "application/json"}, withCredentials: true};
        try {
            const response = isPostRequest ? await axios.post(url, vehicleForm, options) : await axios.put(url, vehicleForm, options);
            if (isPostRequest) {
                addVehicle(response.data)
            } else {
                editVehicle(response.data.id, response.data)
            }
            setShowVehicleForm(false)
            setIsLoading(false)
        } catch (error: any) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }
    return {
        errorState,
        isLoading,
        vehicleDates,
        vehicleForm,
        showVehicleForm,
        setShowVehicleForm,
        handleVehicleFormChange,
        handleVehicleFormDateChange,
        submitVehicleForm,
    }
}

