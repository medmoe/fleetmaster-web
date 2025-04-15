import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const ProtectedRoute = () => {
    const {isAuthenticated} = useAuthStore()
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={"/"} state={{from: location.pathname}} replace/>;
    }
    return <Outlet/>;
}

export default ProtectedRoute;