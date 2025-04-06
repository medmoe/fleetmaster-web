import { create } from 'zustand';
import { AuthResponseDataType, VehicleType, DriverType } from "../types/types.ts";

interface AuthStore {
    // state
    authResponse: AuthResponseDataType | null;
    isAuthenticated: boolean;

    // auth actions
    setAuthResponse: (authResponse: AuthResponseDataType) => void;
    clearAuthResponse: () => void;
    logout: () => void;

    // vehicle actions
    addVehicle: (vehicle: VehicleType) => void;
    removeVehicle: (vehicleId: string | number) => void;
    editVehicle: (vehicleId: string | number, updatedVehicle: Partial<VehicleType>) => void;

    // driver actions
    addDriver: (driver: DriverType) => void;
    removeDriver: (driverId: string | number) => void;
    editDriver: (driverId: string | number, updatedDriver: Partial<DriverType>) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    // Initial state
    authResponse: null,
    isAuthenticated: false,

    // Auth actions
    setAuthResponse: (authResponse: AuthResponseDataType) => set(() => ({
        authResponse: authResponse,
        isAuthenticated: true
    })),

    clearAuthResponse: () => set(() => ({
        authResponse: null,
        isAuthenticated: false
    })),

    logout: () => set(() => ({
        authResponse: null,
        isAuthenticated: false
    })),

    // Vehicle actions
    addVehicle: (vehicle: VehicleType) => set((state) => {
        if (!state.authResponse) return state;

        return {
            authResponse: {
                ...state.authResponse,
                vehicles: [...(state.authResponse.vehicles || []), vehicle]
            }
        };
    }),

    removeVehicle: (vehicleId: string | number) => set((state) => {
        if (!state.authResponse?.vehicles) return state;

        return {
            authResponse: {
                ...state.authResponse,
                vehicles: state.authResponse.vehicles.filter(v =>
                    v.id !== vehicleId
                )
            }
        };
    }),

    editVehicle: (vehicleId: string | number, updatedVehicle: Partial<VehicleType>) => set((state) => {
        if (!state.authResponse?.vehicles) return state;

        return {
            authResponse: {
                ...state.authResponse,
                vehicles: state.authResponse.vehicles.map(vehicle =>
                    vehicle.id === vehicleId
                        ? { ...vehicle, ...updatedVehicle }
                        : vehicle
                )
            }
        };
    }),

    // Driver actions
    addDriver: (driver: DriverType) => set((state) => {
        if (!state.authResponse) return state;

        return {
            authResponse: {
                ...state.authResponse,
                drivers: [...(state.authResponse.drivers || []), driver]
            }
        };
    }),

    removeDriver: (driverId: string | number) => set((state) => {
        if (!state.authResponse?.drivers) return state;

        return {
            authResponse: {
                ...state.authResponse,
                drivers: state.authResponse.drivers.filter(d =>
                    d.id !== driverId
                )
            }
        };
    }),

    editDriver: (driverId: string | number, updatedDriver: Partial<DriverType>) => set((state) => {
        if (!state.authResponse?.drivers) return state;

        return {
            authResponse: {
                ...state.authResponse,
                drivers: state.authResponse.drivers.map(driver =>
                    driver.id === driverId
                        ? { ...driver, ...updatedDriver }
                        : driver
                )
            }
        };
    })
}));

export default useAuthStore;