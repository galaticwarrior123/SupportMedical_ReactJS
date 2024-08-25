import { useLocation, Navigate, Outlet } from "react-router-dom";
import UserHome from "../../Pages/User/HomePage/UserHome";

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation();
    const roles = JSON.parse(localStorage.getItem("roles"));
    const user = JSON.parse(localStorage.getItem("user"));

    
    return (
        roles?.find(role => allowedRoles.includes(role)) ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} />
    )
}

export default RequireAuth;