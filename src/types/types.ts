export interface DriverType {
    id?: string
    vehicle?: string
    first_name: string
    last_name: string
    email?: string
    phone_number: string
    license_number?: string
    license_expiry_date?: string
    date_of_birth?: string
    address?: string
    city?: string
    state?: string
    zip_code?: string
    country?: string
    hire_date?: string
    employment_status: string
    emergency_contact_name?: string
    emergency_contact_phone?: string
    notes?: string
    profile?: string
    created_at?: string
    updated_at?: string
    profile_picture?: string
    vehicle_details?: VehicleType
    access_code?: string
}

export interface VehicleType {
    id?: string
    registration_number?: string
    make?: string
    model?: string
    year: string
    vin?: string
    color?: string
    type: string
    status: string
    mileage: string
    fuel_type?: string
    capacity: string
    insurance_policy_number?: string
    notes?: string
    purchase_date?: string
    last_service_date?: string
    next_service_due?: string
    insurance_expiry_date?: string
    license_expiry_date?: string
}

export interface UserType {
    id?: string
    username: string
    first_name?: string
    last_name?: string
    email: string
}

export interface AuthResponseDataType {
    user: UserType
    phone?: string
    address?: string
    city?: string
    state?: string
    country?: string
    zip_code?: string
    drivers?: DriverType[]
    vehicles?: VehicleType[]
    access?: string
    refresh?: string
}

export interface PickerItemType {
    label: string
    value: string
}

export interface UserData {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
}

export interface UserProfileData {
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
}

export interface SignUpFormData extends UserProfileData {
    user: UserData;
    confirmPassword: string;
}
