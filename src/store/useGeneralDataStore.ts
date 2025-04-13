import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import axios from 'axios';
import {GeneralDataType, MaintenanceReportWithStringsType} from "../types/maintenance.ts";
import {API} from "../constants/endpoints.ts";


type requestType = 'delete' | 'add' | 'edit' | 'idle';

interface GeneralDataStore {
    // State
    generalData: GeneralDataType;
    isLoading: boolean;
    error: string | null;
    maintenanceReports: MaintenanceReportWithStringsType[];
    vehicleID?: string;
    request: requestType;

    // Actions
    setVehicleID: (id: string) => void;
    fetchGeneralData: () => Promise<void>;
    setGeneralData: (data: GeneralDataType) => void;
    fetchMaintenanceReports: () => Promise<void>;
    setMaintenanceReports: (reports: MaintenanceReportWithStringsType[]) => void;
    clearError: () => void;
    setRequest: (request: requestType) => void;
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
                        console.error('Error fetching general data:', error);
                        set({error: error.message});
                    } finally {
                        set({isLoading: false});
                    }
                },
                setGeneralData: (data: GeneralDataType) => set({generalData: data}),
                clearError: () => set({error: null}),
                fetchMaintenanceReports: async () => {
                    set({isLoading: true, error: null});
                    const vehicleID = get().vehicleID;
                    try {
                        const response = await axios.get(`${API}maintenance/overview/?vehicle_id=${vehicleID}`, {
                            headers: {"accept": "application/json", "Content-Type": "application/json"},
                            withCredentials: true,
                        })
                        set({maintenanceReports: response.data, isLoading: false});
                    } catch (error: any) {
                        console.error('Error fetching maintenance reports:', error);
                        set({error: error.message});
                    } finally {
                        set({isLoading: false});
                    }
                },
                setMaintenanceReports: (reports: MaintenanceReportWithStringsType[]) => set({maintenanceReports: reports}),
                setVehicleID: (id: string) => set({vehicleID: id}),
                setRequest: (request: requestType) => set({request: request}),
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