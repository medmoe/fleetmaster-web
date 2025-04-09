import {useState} from "react";
import {ServiceProviderCard, ServiceProviderForm} from "../../../../components";
import {Alert, Button, CircularProgress, Container} from "@mui/material";
import useGeneralDataStore from "../../../../store/useGeneralDataStore.ts";
import {Add} from "@mui/icons-material";
import {ServiceProviderType} from "../../../../types/maintenance.ts";
import axios from "axios";
import {API} from "../../../../constants/endpoints.ts";

const ServiceProviders = () => {
    const [showServiceProviderForm, setShowServiceProviderForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({
        isError: false,
        message: ""
    })
    const {generalData, setGeneralData} = useGeneralDataStore();
    const [isPostRequest, setIsPostRequest] = useState(true)
    const [serviceProviderFormData, setServiceProviderFormData] = useState<ServiceProviderType>({
        name: "",
        address: "",
        phone_number: "",
        service_type: "MECHANIC"
    })
    const options = {headers: {"Content-Type": "application/json"}, withCredentials: true};
    const url = `${API}maintenance/service-providers/`

    const handleEdit = (serviceProvider: ServiceProviderType) => {
        setShowServiceProviderForm(true)
        setIsPostRequest(false)
        setServiceProviderFormData(serviceProvider)
    }
    const handleDelete = async (id?: string) => {
        setIsLoading(true);
        try {
            await axios.delete(`${url}${id}/`, options);
            setGeneralData({...generalData, service_providers: generalData.service_providers.filter(serviceProvider => serviceProvider.id !== id)});
        } catch (error) {
            console.error(error);
            setError({isError: true, message: "Error while deleting service provider"})
        } finally {
            setIsLoading(false);
        }
    }
    const handleChange = (name: string, value: string) => {
        setServiceProviderFormData({
            ...serviceProviderFormData,
            [name]: value,
        })
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const resposne = isPostRequest ? await axios.post(url, serviceProviderFormData, options) : await axios.put(`${url}${serviceProviderFormData.id}/`, serviceProviderFormData, options);
            setGeneralData({
                ...generalData,
                service_providers: isPostRequest ? [...generalData.service_providers, resposne.data] : generalData.service_providers.map(serviceProvider => serviceProvider.id === serviceProviderFormData.id ? resposne.data : serviceProvider)
            });
            setShowServiceProviderForm(false);
            setServiceProviderFormData({name: "", address: "", phone_number: "", service_type: "MECHANIC"});
            setIsPostRequest(true);
        } catch (error) {
            console.error(error);
            setError({isError: true, message: isPostRequest ? "Error while creating service provider" : "Error while updating service provider"})
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className={"min-h-screen bg-gray-100 py-8"}>
            {showServiceProviderForm ? <ServiceProviderForm isLoading={isLoading}
                                                            handleChange={handleChange}
                                                            handleCancel={() => setShowServiceProviderForm(false)}
                                                            handleSubmit={handleSubmit}
                                                            formData={serviceProviderFormData}
                /> :
                <div className={"w-full flex justify-center"}>
                    <div className={"w-full max-w-3xl bg-white rounded-lg shadow p-5"}>
                        <div>
                            <h1 className={"font-semibold text-lg text-txt"}>Service Provider's list</h1>
                        </div>
                        <div className={"mt-5 flex items-center gap-2"}>
                            <p className={"font-open-sans text-txt"}>Here is the list of service providers.</p>
                            {isLoading && <CircularProgress color="primary" size={20} thickness={4}/>}
                        </div>
                        {error.isError && <Alert severity="error" onClick={() => setError({
                            isError: false,
                            message: ""
                        })}>{error.message}</Alert>}
                        <div className={"mt-4 space-y-4 "}>
                            {generalData.service_providers.map((serviceProvider) => {
                                    return (
                                        <ServiceProviderCard serviceProvider={serviceProvider}
                                                             key={serviceProvider.id}
                                                             handleServiceProviderEdition={() => handleEdit(serviceProvider)}
                                                             handleServiceProviderDeletion={() => handleDelete(serviceProvider.id)}
                                        />
                                    )
                                }
                            )}
                            <Container maxWidth={"md"}>
                                <Button variant="contained"
                                        sx={{backgroundColor: "#3f51b5", '&:hover': {backgroundColor: "#3847a3"}}}
                                        startIcon={<Add/>}
                                        size={"large"}
                                        onClick={() => setShowServiceProviderForm(true)}
                                >
                                    Add service provider
                                </Button>
                            </Container>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ServiceProviders;