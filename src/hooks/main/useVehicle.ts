import {useState} from "react";
import {VehicleType} from "@/types/types";
import {isPositiveInteger} from "@/utils/common";
import {API} from "@/constants/endpoints";
import axios, {AxiosResponse} from "axios";
import useAuthStore from "../../store/useAuthStore";
import {useTranslation} from "react-i18next";


export const useVehicle = () => {
    const {t} = useTranslation();
    const {addVehicle, authResponse, editVehicle, removeVehicle} = useAuthStore();
    const vehicles = authResponse?.vehicles || []
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<VehicleType | null>(null);
    const [isEditing, setIsEditing] = useState(true)
    const [formError, setFormError] = useState({message: "", isError: false,})
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error"
    })
    const [formData, setFormData] = useState<VehicleType>({year: "", type: "", status: "", mileage: "", capacity: ""})

    // Filter vehicles based on search query and status
    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = searchQuery === "" ||
            vehicle.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.registration_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.year.toString().includes(searchQuery) ||
            vehicle.status.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === "ALL" || filterStatus === vehicle.status.toUpperCase()
        return matchesSearch && matchesStatus
    })

    // Handle dialog form field changes
    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Open add vehicle dialog
    const handleAddVehicle = () => {
        setIsEditing(false)
        setOpenDialog(true)
    }

    // Open edit vehicle dialog
    const handleEditVehicle = (vehicle: VehicleType) => {
        setFormData(vehicle)
        setIsEditing(true)
        setOpenDialog(true)
    }

    // Open delete confirmation dialog
    const handleDeleteClick = (vehicle: VehicleType) => {
        setVehicleToDelete(vehicle)
        setOpenDeleteDialog(true)
    }

    // Submit vehicle form (create or update vehicle)
    const handleSubmit = async () => {
        const [isValid, message] = validateForm()
        if (!isValid) {
            setFormError({message, isError: true,})
            return
        }
        setLoading(true)
        try {
            const options = {headers: {"Content-Type": "application/json"}, withCredentials: true};
            let response: AxiosResponse;
            if (isEditing && formData.id) {
                response = await axios.put(`${API}vehicles/${formData.id}/`, formData, options)
                editVehicle(formData.id, response.data)
                setSnackbar({open: true, message: t('pages.vehicle.snackbar.updated'), severity: "success"})
            } else {
                response = await axios.post(`${API}vehicles/`, formData, options);
                addVehicle(response.data)
                setSnackbar({open: true, message: t('pages.vehicle.snackbar.added'), severity: "success"})
            }
            setOpenDialog(false)
        } catch (error) {
            console.error("Error saving vehicle: ", error)
            setFormError({
                isError: true,
                message: isEditing
                    ? t('pages.vehicle.errors.updateError')
                    : t('pages.vehicle.errors.createError')
            })
        } finally {
            setLoading(false)
        }
    }


    const validateForm = (): [boolean, string] => {
        if (!isPositiveInteger(formData.year)) {
            return [false, "Year must be a positive number!"]
        }
        if (!isPositiveInteger(formData.mileage)) {
            return [false, "Mileage must be a positive number!"]
        }
        if (!isPositiveInteger(formData.capacity)) {
            return [false, "Capacity must be a positive number!"]
        }
        if (!formData.type) {
            return [false, "Vehicle type is required!"]
        }
        if (!formData.status) {
            return [false, "Vehicle status is required!"]
        }
        if (!formData.purchase_date) {
            return [false, "Vehicle purchase date is required!"]
        }
        return [true, ""]
    }

    const handleDeleteConfirm = async () => {
        if (!vehicleToDelete || !vehicleToDelete.id) return

        setLoading(true)
        try {
            const options = {headers: {"Content-Type": "application/json"}, withCredentials: true};
            await axios.delete(`${API}vehicles/${vehicleToDelete.id}`, options)
            removeVehicle(vehicleToDelete.id as string)
            setOpenDeleteDialog(false)
            setSnackbar({open: true, message: t('pages.vehicle.snackbar.deleted'), severity: "success"});
        } catch (error) {
            console.error("Error deleting vehicle: ", error)
            setSnackbar({open: true, message: t('pages.vehicle.errors.deleteError'), severity: "error"})
        } finally {
            setLoading(false)
        }
    }
    return {
        openDialog,
        setOpenDialog,
        setOpenDeleteDialog,
        formData,
        handleFormChange,
        handleSubmit,
        handleAddVehicle,
        handleEditVehicle,
        handleDeleteClick,
        handleDeleteConfirm,
        vehicleToDelete,
        filterStatus,
        setFilterStatus,
        loading,
        isEditing,
        formError,
        setFormError,
        searchQuery,
        setSearchQuery,
        filteredVehicles,
        openDeleteDialog,
        snackbar,
        setSnackbar,
    }
}

