import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import axios from 'axios';
import {GeneralDataType, MaintenanceReportWithStringsType} from "@/types/maintenance";
import {API} from "@/constants/endpoints";
import {VehicleType} from "@/types/types";
import i18n from "i18next";

type requestType = 'delete' | 'add' | 'edit' | 'idle';

interface GeneralDataStore {
    // State
    generalData: GeneralDataType;
    isLoading: boolean;
    snackbar: { open: boolean, message: string, severity: "success" | "error" }
    maintenanceReports: MaintenanceReportWithStringsType[];
    request: requestType;
    vehicle: VehicleType | null;

    // Actions
    fetchGeneralData: () => Promise<void>;
    setGeneralData: (data: GeneralDataType) => void;
    fetchMaintenanceReports: () => Promise<void>;
    setMaintenanceReports: (reports: MaintenanceReportWithStringsType[]) => void;
    clearError: () => void;
    setRequest: (request: requestType) => void;
    setVehicle: (vehicle: VehicleType) => void;
    setSnackbar: (snackbar: { open: boolean, message: string, severity: "success" | "error" }) => void;
}

const generalDataInitialState: GeneralDataType = {
    parts: [],
    part_providers: [],
    service_providers: [],
}



const useGeneralDataStore = create<GeneralDataStore>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                generalData: generalDataInitialState,
                isLoading: false,
                maintenanceReports: [],
                request: 'idle',
                vehicle: null,
                snackbar: {open: false, message: '', severity: 'success'},

                // Actions
                fetchGeneralData: async () => {
                    try {
                        const response = await axios.get(`${API}maintenance/general-data/`, {
                            headers: {"Accept": "application/json", "Content-Type": "application/json"},
                            withCredentials: true,
                        });
                        set({generalData: response.data, isLoading: false});
                    } catch (error: any) {
                        if (error.response?.status === 401) {
                            set({
                                snackbar: {
                                    open: true,
                                    message: i18n.t('common.errorMessages.unauthorized'),
                                    severity: 'error',
                                }
                            })
                        } else {
                            set({
                                snackbar: {
                                    open: true,
                                    message: error.message,
                                    severity: 'error',
                                }
                            })
                            console.error('Error fetching general data:', error);
                        }
                    } finally {
                        set({isLoading: false});
                    }
                },
                setGeneralData: (data: GeneralDataType) => set({generalData: data}),
                clearError: () => set({snackbar: {open: false, message: '', severity: 'success'}}),
                fetchMaintenanceReports: async () => {
                    const vehicleID = get().vehicle?.id;
                    try {
                        const response = await axios.get(`${API}maintenance/overview/?vehicle_id=${vehicleID}`, {
                            headers: {"accept": "application/json", "Content-Type": "application/json"},
                            withCredentials: true,
                        })
                        set({maintenanceReports: response.data, isLoading: false});
                    } catch (error: any) {
                        if (error.response?.status === 401) {
                            set({
                                snackbar: {
                                    open: true,
                                    message: i18n.t('common.errorMessages.unauthorized'),
                                    severity: 'error',
                                }
                            })
                        } else {
                            set({snackbar: {open: true, message: error.message, severity: 'error'}});
                            console.error('Error fetching maintenance reports:', error);
                        }
                    } finally {
                        set({isLoading: false});
                    }
                },
                setMaintenanceReports: (reports: MaintenanceReportWithStringsType[]) => set({maintenanceReports: reports}),
                setRequest: (request: requestType) => set({request: request}),
                setVehicle: (vehicle: VehicleType) => set({vehicle: vehicle}),
                setSnackbar: (snackbar: { open: boolean, message: string, severity: "success" | "error" }) => set({snackbar: snackbar})
            }),
            {
                name: 'general-data-storage', // unique name for the storage
                storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
                partialize: (state) => ({
                    generalData: state.generalData,
                    maintenanceReports: state.maintenanceReports,
                    vehicle: state.vehicle,
                    // Only persist the generalData, not loading states or errors
                }),
            }
        )
    )
);

export default useGeneralDataStore;