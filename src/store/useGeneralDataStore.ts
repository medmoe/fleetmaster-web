import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import axios from 'axios';
import {GeneralDataType, MaintenanceReportWithStringsType} from "@/types/maintenance";
import {API} from "@/constants/endpoints";
import {VehicleType} from "@/types/types";


type requestType = 'delete' | 'add' | 'edit' | 'idle';

interface GeneralDataStore {
    // State
    generalData: GeneralDataType;
    isLoading: boolean;
    error: string | null;
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
    setError: (error: string | null) => void;
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
                error: null,
                maintenanceReports: [],
                request: 'idle',
                vehicle: null,

                // Actions
                fetchGeneralData: async () => {
                    set({isLoading: true, error: null});
                    try {
                        const response = await axios.get(`${API}maintenance/general-data/`, {
                            headers: {"Accept": "application/json", "Content-Type": "application/json"},
                            withCredentials: true,
                        });
                        set({generalData: response.data, isLoading: false});
                    } catch (error: any) {
                        if (error.response?.status === 401) {
                            set({error: 'Unauthorized. Please log in again.'});
                        } else {
                            console.error('Error fetching general data:', error);
                            set({error: error.message});
                        }
                    } finally {
                        set({isLoading: false});
                    }
                },
                setGeneralData: (data: GeneralDataType) => set({generalData: data}),
                clearError: () => set({error: null}),
                fetchMaintenanceReports: async () => {
                    set({isLoading: true, error: null});
                    const vehicleID = get().vehicle?.id;
                    try {
                        const response = await axios.get(`${API}maintenance/overview/?vehicle_id=${vehicleID}`, {
                            headers: {"accept": "application/json", "Content-Type": "application/json"},
                            withCredentials: true,
                        })
                        set({maintenanceReports: response.data, isLoading: false});
                    } catch (error: any) {
                        if (error.response?.status === 401) {
                            set({error: 'Unauthorized. Please log in again.'});
                        } else {
                            console.error('Error fetching maintenance reports:', error);
                            set({error: error.message});
                        }
                    } finally {
                        set({isLoading: false});
                    }
                },
                setMaintenanceReports: (reports: MaintenanceReportWithStringsType[]) => set({maintenanceReports: reports}),
                setRequest: (request: requestType) => set({request: request}),
                setVehicle: (vehicle: VehicleType) => set({vehicle: vehicle}),
                setError: (error: string | null) => set({error: error}),
            }),
            {
                name: 'general-data-storage', // unique name for the storage
                storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
                partialize: (state) => ({
                    generalData: state.generalData,
                    maintenanceReports: state.maintenanceReports,
                    // Only persist the generalData, not loading states or errors
                }),
            }
        )
    )
);

export default useGeneralDataStore;