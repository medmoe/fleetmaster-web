import {Button, Container} from "@mui/material";
import ListItemDetail from "../common/ListItemDetail";
import {ServiceProviderType} from "@/types/maintenance";
import {Delete, Edit} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

interface ServiceProviderCardProps {
    serviceProvider: ServiceProviderType
    handleServiceProviderEdition: () => void
    handleServiceProviderDeletion: () => void
}

const ServiceProviderCard = ({serviceProvider, handleServiceProviderEdition, handleServiceProviderDeletion}: ServiceProviderCardProps) => {
    const {t} = useTranslation();
    return (
        <Container maxWidth="md">
            <div className={"bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 p-4"}>
                <div className={"flex flex-col md:flex-row gap-6"}>
                    <div className={"flex-1 space-y-2"}>
                        <ListItemDetail label={t('pages.vehicle.maintenance.serviceProviders.dialog.name')}
                                        value={serviceProvider.name}
                                        textStyle={"text-txt font-medium"}
                        />
                        <ListItemDetail label={t('pages.vehicle.maintenance.serviceProviders.dialog.phoneNumber')}
                                        value={serviceProvider.phone_number}
                                        textStyle={"text-txt"}
                        />
                        <ListItemDetail label={t('pages.vehicle.maintenance.serviceProviders.dialog.address')}
                                        value={serviceProvider.address}
                                        textStyle={"text-txt"}
                        />
                        <ListItemDetail label={t('pages.vehicle.maintenance.serviceProviders.dialog.serviceType')}
                                        value={serviceProvider.service_type.toLowerCase()}
                                        textStyle={"text-txt"}
                        />
                    </div>
                    <div className={"flex flex-col space-y-3 md:self-start gap-2"}>
                        <Button variant="outlined" startIcon={<Edit/>} size={"medium"}
                                onClick={handleServiceProviderEdition}>{t('common.edit')}</Button>
                        <Button variant={"outlined"} startIcon={<Delete/>} size={"medium"} color={"error"}
                                onClick={handleServiceProviderDeletion}>{t('common.delete')}</Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ServiceProviderCard;