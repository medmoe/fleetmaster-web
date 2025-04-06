import {useEffect} from "react";
import useGeneralDataStore from "../../store/useGeneralDataStore.ts";
import {CircularProgress} from "@mui/material";
import ErrorAlert from "../../components/common/ErrorAlert.tsx";


const Dashboard = () => {
    const {fetchGeneralData, isLoading, error} = useGeneralDataStore();
    useEffect(() => {
        fetchGeneralData();
    }, [])

    if (isLoading) {
        return (
            <div className={"w-full h-screen flex items-center justify-center"}>
                <CircularProgress color="primary" size={200} thickness={5}/>
            </div>
        )
    }

    return (
        <div>
            <p className={"font-open-sans"}>Dashboard</p>
            {error && <ErrorAlert severity="error" message={error}/>}
        </div>
    )
};

// const Dashboard: React.FC = () => {
//     // const { responseData, setGeneralData } = useGlobalContext();
//     const responseData: ResponseDataType = {
//         user: {
//             username: "",
//             email: "",
//         }
//     }
//
//
//     // useEffect(() => {
//     //   const fetchGeneralData = async () => {
//     //     try {
//     //       const response = await axios.get(`${API}maintenance/general-data/`, { withCredentials: true });
//     //       setGeneralData(response.data);
//     //     } catch (error) {
//     //       console.error('Error fetching general data:', error);
//     //     }
//     //   };
//     //
//     //   fetchGeneralData();
//     // }, [setGeneralData]);
//
//     const DataPanel = ({title, children, isLoading = false}: { title: string, children: any, isLoading: boolean }) => (
//         <Card className="w-full mb-6 shadow-md">
//             <CardContent>
//                 <Typography variant="h6" className="font-merriweather-bold text-txt mb-4">
//                     {title}
//                 </Typography>
//
//                 {isLoading ? (
//                     <div className="space-y-2">
//                         <Skeleton variant="rectangular" height={40}/>
//                         <Skeleton variant="rectangular" height={40}/>
//                         <Skeleton variant="rectangular" height={40}/>
//                     </div>
//                 ) : (
//                     children
//                 )}
//             </CardContent>
//         </Card>
//     );
//
//     const isLoading = !responseData || Object.keys(responseData).length === 0;
//
//     return (
//         <div>
//             <h1 className="text-3xl font-merriweather-bold mb-6">Dashboard</h1>
//
//             <div className="grid grid-cols-1 gap-6">
//                 <DataPanel title="Drivers Overview" isLoading={isLoading}>
//                     <TableEntry
//                         name="Name"
//                         numeric="Grade"
//                         status="Status"
//                         note="Note"
//                         containerStyles="mb-3 pb-3 border-b-2"
//                         textStyles="text-gray-700 font-merriweather-bold"
//                     />
//                     {responseData.drivers?.map((driver, idx) => (
//                         <TableEntry
//                             key={idx}
//                             name={`${driver.first_name} ${driver.last_name}`}
//                             numeric="To be implemented"
//                             status={driver.employment_status === driverStatus.active}
//                             note={driver.notes || "No notes"}
//                             textStyles="font-merriweather-regular text-txt"
//                         />
//                     ))}
//                 </DataPanel>
//
//                 <DataPanel title="Trucks Overview" isLoading={isLoading}>
//                     <TableEntry
//                         name="Name"
//                         numeric="Mileage"
//                         status="Status"
//                         note="Note"
//                         containerStyles="mb-3 pb-3 border-b-2"
//                         textStyles="text-gray-700 font-merriweather-bold"
//                     />
//                     {responseData.vehicles?.map((vehicle, idx) => (
//                         <TableEntry
//                             key={idx}
//                             name={`${vehicle.make} ${vehicle.model} ${vehicle.registration_number}`}
//                             numeric={vehicle.mileage}
//                             status={vehicle.status === vehicleStatus.active}
//                             note={vehicle.notes || "No notes"}
//                             textStyles="font-merriweather-regular text-txt"
//                         />
//                     ))}
//                 </DataPanel>
//
//                 <DataPanel title="Maintenance Overview" isLoading={false}>
//                     <TableEntry
//                         name="Name"
//                         numeric="Date"
//                         status="Type"
//                         note="Provider"
//                         containerStyles="mb-3 pb-3 border-b-2"
//                         textStyles="text-gray-700 font-merriweather-bold"
//                     />
//                     {maintenanceData.map((entry, idx) => (
//                         <TableEntry
//                             key={idx}
//                             name={entry.truckName}
//                             numeric={entry.dueDate}
//                             status={entry.maintenanceType}
//                             note={entry.provider}
//                             textStyles="font-merriweather-regular text-txt"
//                         />
//                     ))}
//                 </DataPanel>
//             </div>
//         </div>
//     );
// };

export default Dashboard;