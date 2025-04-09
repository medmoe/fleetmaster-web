import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import axios from 'axios';
import {GeneralDataType} from "../types/maintenance.ts";
import {API} from "../constants/endpoints.ts";

interface GeneralDataStore {
    // State
    generalData: GeneralDataType;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchGeneralData: () => Promise<void>;
    setGeneralData: (data: GeneralDataType) => void;
    clearError: () => void;
}

const generalDataInitialState: GeneralDataType = {
    parts: [],
    part_providers: [],
    service_providers: [],
}

const useGeneralDataStore = create<GeneralDataStore>()(
    persist(
        (set) => ({
            // Initial state
            generalData: generalDataInitialState,
            isLoading: false,
            error: null,

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
                    set({isLoading: false, error: error.message});
                }
            },
            setGeneralData: (data: GeneralDataType) => set({generalData: data}),
            clearError: () => set({error: null}),
        }),
        {
            name: 'general-data-storage', // unique name for the storage
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({
                generalData: state.generalData,
                // Only persist the generalData, not loading states or errors
            }),
        }
    )
);

export default useGeneralDataStore;