import {Button, Container} from "@mui/material";
import ListItemDetail from "../common/ListItemDetail.tsx";
import {ServiceProviderType} from "../../types/maintenance.ts";
import {Delete, Edit} from "@mui/icons-material";

interface ServiceProviderCardProps {
    serviceProvider: ServiceProviderType
    handleServiceProviderEdition: () => void
    handleServiceProviderDeletion: () => void
}

const ServiceProviderCard = ({serviceProvider, handleServiceProviderEdition, handleServiceProviderDeletion}: ServiceProviderCardProps) => {
    return (
        <Container maxWidth="md">
            <div className={"bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 p-4"}>
                <div className={"flex flex-col md:flex-row gap-6"}>
                    <div className={"flex-1 space-y-2"}>
                        <ListItemDetail label={"Provider name"}
                                        value={serviceProvider.name}
                                        textStyle={"text-txt font-medium"}
                        />
                        <ListItemDetail label={"Phone number"}
                                        value={serviceProvider.phone_number}
                                        textStyle={"text-txt"}
                        />
                        <ListItemDetail label={"Address"}
                                        value={serviceProvider.address}
                                        textStyle={"text-txt"}
                        />
                        <ListItemDetail label={"Service type"}
                                        value={serviceProvider.service_type.toLowerCase()}
                                        textStyle={"text-txt"}
                        />
                    </div>
                    <div className={"flex flex-col space-y-3 md:self-start gap-2"}>
                        <Button variant="outlined" startIcon={<Edit/>} size={"medium"} onClick={handleServiceProviderEdition}>Edit</Button>
                        <Button variant={"outlined"} startIcon={<Delete/>} size={"medium"} color={"error"}
                                onClick={handleServiceProviderDeletion}>Delete</Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ServiceProviderCard;