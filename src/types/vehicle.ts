import {VehicleType} from "./types.ts";

export interface VehicleDatesType {
    purchase_date: Date
    last_service_date: Date
    next_service_due: Date
    insurance_expiry_date: Date
    license_expiry_date: Date
}

export interface VehicleFormProps {
    vehicleData: VehicleType
    handleChange: (name: string, value: string) => void
    handleDateChange: (name: string) => (_: string, date: Date | undefined) => void
    submitForm: () => void
    cancelSubmission: () => void
    dates: VehicleDatesType

}