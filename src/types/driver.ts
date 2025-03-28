import {DriverType, PickerItemType} from "@/types/types";
import {DateTimePickerEvent} from "@react-native-community/datetimepicker";

export interface DriverDatesType {
    date_of_birth: Date
    license_expiry_date: Date
    hire_date: Date
}

export interface DriverFormProps {
    handleChange: (name: string, value: string) => void
    driverData: DriverType
    handleDateChange: (name: string) => (_: DateTimePickerEvent, date: Date | undefined) => void
    submitForm: () => void
    cancelSubmission: () => void
    dates: DriverDatesType
    vehicles: PickerItemType[]
}