import {Button, CircularProgress, Container} from "@mui/material";
import {Add} from "@mui/icons-material";
import React, {useState} from "react";
import useGeneralDataStore from "../../../../store/useGeneralDataStore.ts";
import {PartProviderCard, PartProviderForm} from "../../../../components";
import {PartProviderType} from "../../../../types/maintenance.ts";
import axios from "axios";
import {API} from "../../../../constants/endpoints.ts";

const PartProviders = () => {
    const {generalData, setGeneralData} = useGeneralDataStore();
    const [showPartProviderForm, setShowPartProviderForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [partProviderFormData, setPartProviderFormData] = useState<PartProviderType>({name: "", address: "", phone_number: ""})
    const [isPostRequest, setIsPostRequest] = useState(true)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setPartProviderFormData({
            ...partProviderFormData,
            [name]: value,
        })
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const options = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
            const url = isPostRequest ? `${API}maintenance/parts-providers/` : `${API}maintenance/parts-providers/${partProviderFormData.id}/`;
            const response = isPostRequest ? await axios.post(url, partProviderFormData, options) : await axios.put(url, partProviderFormData, options);
            if (isPostRequest) {
                setGeneralData({...generalData, part_providers: [...generalData.part_providers, response.data]});
            } else {
                setGeneralData({
                    ...generalData,
                    part_providers: generalData.part_providers.map(partProvider => partProvider.id === partProviderFormData.id ? response.data : partProvider)
                });
            }
            setShowPartProviderForm(false);
            setPartProviderFormData({name: "", address: "", phone_number: ""});
            setIsPostRequest(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    const handleEdit = (partProvider: PartProviderType) => {
        setPartProviderFormData(partProvider);
        setShowPartProviderForm(true);
        setIsPostRequest(false);

    }
    const handleDelete = async (id?: string) => {
        setIsLoading(true);
        try {
            const options = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
            const url = `${API}maintenance/parts-providers/${id}/`;
            await axios.delete(url, options);
            setGeneralData({...generalData, part_providers: generalData.part_providers.filter(partProvider => partProvider.id !== id)});
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className={"min-h-screen bg-gray-100 py-8"}>
            {showPartProviderForm ? <PartProviderForm isLoading={isLoading}
                                                      handleChange={handleChange}
                                                      handleSubmit={handleSubmit}
                                                      formData={partProviderFormData}
                                                      handleCancel={() => setShowPartProviderForm(false)}
                /> :
                <div className={"w-full flex justify-center"}>
                    <div className={"w-full max-w-3xl bg-white rounded-lg shadow p-5"}>
                        <div>
                            <h1 className={"font-semibold text-lg text-txt"}>Part Provider's list</h1>
                        </div>
                        <div className={"mt-5 flex items-center gap-2"}>
                            <p className={"font-open-sans text-txt"}>Here is the list of part providers.</p>
                            {isLoading && <CircularProgress color="primary" size={20} thickness={4}/>}
                        </div>
                        <div className={"mt-4 space-y-4 "}>
                            {generalData.part_providers.map((partProvider) => {
                                return <PartProviderCard partProvider={partProvider}
                                                         handlePartProviderEdition={() => handleEdit(partProvider)}
                                                         handlePartProviderDeletion={() => handleDelete(partProvider.id)}
                                                         key={partProvider.id}
                                />
                            })}
                            <Container maxWidth={"md"}>
                                <Button variant="contained"
                                        sx={{backgroundColor: "#3f51b5", '&:hover': {backgroundColor: "#3847a3"}}}
                                        startIcon={<Add/>}
                                        size={"large"}
                                        onClick={() => setShowPartProviderForm(true)}
                                >
                                    Add part provider
                                </Button>
                            </Container>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default PartProviders;