import {PartProviderType} from "../../types/maintenance.ts";
import {Button, Container} from "@mui/material";
import ListItemDetail from "../common/ListItemDetail.tsx";
import {Delete, Edit} from "@mui/icons-material";


interface PartProviderProps {
    partProvider: PartProviderType
    handlePartProviderEdition: () => void
    handlePartProviderDeletion: () => void
}

const PartProviderCard = ({partProvider, handlePartProviderEdition, handlePartProviderDeletion}: PartProviderProps) => {
    return (
        <Container maxWidth="md">
            <div className={"bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 p-4"}>
                <div className={"flex flex-col md:flex-row gap-6"}>
                    <div className={"flex-1 space-y-2"}>
                        <ListItemDetail label={"Provider name"}
                                        value={partProvider.name}
                                        textStyle={"text-txt font-medium"}
                        />
                        <ListItemDetail label={"Phone number"}
                                        value={partProvider.phone_number}
                                        textStyle={"text-txt"}
                        />
                        <ListItemDetail label={"Address"}
                                        value={partProvider.address}
                                        textStyle={"text-txt"}
                        />
                    </div>
                    {/*Actions Section*/}
                    <div className={"flex flex-col space-y-3 md:self-start gap-2"}>
                        <Button variant="outlined" startIcon={<Edit/>} size={"medium"} onClick={handlePartProviderEdition}>Edit</Button>
                        <Button variant={"outlined"} startIcon={<Delete/>} size={"medium"} color={"error"}
                                onClick={handlePartProviderDeletion}>Delete</Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default PartProviderCard;