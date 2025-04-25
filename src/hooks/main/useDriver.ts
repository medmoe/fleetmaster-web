import {useState} from "react";
import {DriverType} from "@/types/types.ts";
import axios, {AxiosResponse} from "axios";
import {API} from "@/constants/endpoints.ts";
import {useTranslation} from "react-i18next";
import useAuthStore from "@/store/useAuthStore";


export const useDriver = () => {
    const {t} = useTranslation();
    const {addDriver, authResponse, editDriver, removeDriver} = useAuthStore();
    const drivers = authResponse?.drivers || [];
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [driverToDelete, setDriverToDelete] = useState<DriverType | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formError, setFormError] = useState({isError: false, message: ""});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error"
    });

    const [formData, setFormData] = useState<DriverType>({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        employment_status: "ACTIVE",
        license_number: "",
        license_expiry_date: "",
        date_of_birth: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        hire_date: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        notes: "",
    });

    // Filter drivers based on search query and status filter
    const filteredDrivers = drivers.filter(driver => {
        const matchesSearch = searchQuery === "" ||
            `${driver.first_name} ${driver.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.phone_number.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "ALL" || driver.employment_status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Handle dialog form field changes
    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Open add driver dialog
    const handleAddDriver = () => {
        setFormData({
            first_name: "",
            last_name: "",
            phone_number: "",
            email: "",
            employment_status: "ACTIVE",
            license_number: "",
            license_expiry_date: "",
            date_of_birth: "",
            address: "",
            city: "",
            state: "",
            zip_code: "",
            country: "",
            hire_date: "",
            emergency_contact_name: "",
            emergency_contact_phone: "",
            notes: ""
        });
        setIsEditing(false);
        setOpenDialog(true);
    };

    // Open edit driver dialog
    const handleEditDriver = (driver: DriverType) => {
        setFormData(driver);
        setIsEditing(true);
        setOpenDialog(true);
    };

    // Open delete confirmation dialog
    const handleDeleteClick = (driver: DriverType) => {
        setDriverToDelete(driver);
        setOpenDeleteDialog(true);
    };

    // Submit form (create or update driver)
    const handleSubmit = async () => {
        // Validate form
        if (!formData.license_expiry_date || !formData.date_of_birth || !formData.hire_date || !formData.license_number || !formData.phone_number) {
            setFormError({
                isError: true,
                message: t('pages.driver.errors.requiredFields')
            });
            return;
        }

        setLoading(true);
        try {
            const options = {
                headers: {"Content-Type": "application/json"},
                withCredentials: true
            };

            let response: AxiosResponse;
            if (isEditing && formData.id) {
                response = await axios.put(`${API}drivers/${formData.id}/`, formData, options);
                // Update drivers list
                editDriver(formData.id, response.data);
                setSnackbar({
                    open: true,
                    message: t('pages.driver.snackbar.updated'),
                    severity: "success"
                });
            } else {
                response = await axios.post(`${API}drivers/`, formData, options);
                // Add new driver to the list
                addDriver(response.data);
                // Update global state if needed
                if (addDriver) addDriver(response.data);
                setSnackbar({
                    open: true,
                    message: t('pages.driver.snackbar.added'),
                    severity: "success"
                });
            }

            setOpenDialog(false);
        } catch (error) {
            console.error("Error saving driver:", error);
            setFormError({
                isError: true,
                message: isEditing
                    ? t('pages.driver.errors.updateError')
                    : t('pages.driver.errors.createError')
            });
        } finally {
            setLoading(false);
        }
    };

    // Delete driver
    const handleDeleteConfirm = async () => {
        if (!driverToDelete || !driverToDelete.id) return;

        setLoading(true);
        try {
            await axios.delete(`${API}drivers/${driverToDelete.id}/`, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true
            });

            // Remove driver from list
            removeDriver(driverToDelete.id);
            setOpenDeleteDialog(false);
            setSnackbar({
                open: true,
                message: t('pages.driver.snackbar.deleted'),
                severity: "success"
            });
        } catch (error) {
            console.error("Error deleting driver:", error);
            setSnackbar({
                open: true,
                message: t('pages.driver.errors.deleteError'),
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        driverToDelete,
        filterStatus,
        filteredDrivers,
        formData,
        formError,
        handleAddDriver,
        handleDeleteClick,
        handleDeleteConfirm,
        handleEditDriver,
        handleFormChange,
        handleSubmit,
        isEditing,
        loading,
        openDeleteDialog,
        openDialog,
        searchQuery,
        setFilterStatus,
        setFormError,
        setOpenDeleteDialog,
        setOpenDialog,
        setSearchQuery,
        setSnackbar,
        snackbar,
    }
}