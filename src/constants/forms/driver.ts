import {PickerItemType} from "../../types/types.ts";
import countries from "../countries.json";
import {TEXT_ERROR, TEXT_WIN, TEXT_WARNING} from "../constants.ts";

export const driverStatus = {
    active: "ACTIVE",
    inactive: "INACTIVE",
    on_leave: "ON_LEAVE",
}

export const driverStatusMapping: {[key: string]: [string, string]} = {
    "ACTIVE": [TEXT_WIN, "Active"],
    "INACTIVE": [TEXT_WARNING, "Inactive"],
    "ON_LEAVE": [TEXT_ERROR, "On leave"],
}

export const countriesLst: PickerItemType[] = countries.map((country) => {
    return {label: `${country.name} ${country.emoji}`, value: country.name}
})
export const driverStatuses: PickerItemType[] = [
    {label: "Active", value: driverStatus.active},
    {label: "Inactive", value: driverStatus.inactive},
    {label: "On leave", value: driverStatus.on_leave}
]