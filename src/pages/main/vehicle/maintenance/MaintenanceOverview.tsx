import {useEffect} from "react";
import useGeneralDataStore from "../../../../store/useGeneralDataStore.ts";

const MaintenanceOverview = () => {

    const {fetchMaintenanceReports} = useGeneralDataStore();
    useEffect(() => {
        fetchMaintenanceReports();
    }, []);

    return (
        <div>Maintenance Overview</div>
    )
}

export default MaintenanceOverview;