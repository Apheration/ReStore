import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

export default function RequireAuth() {
    // user interface element not real security
    const { user } = useAppSelector(state => state.account);
    // record where they are trying to get back to once they are logged in
    const location = useLocation();

    if (!user) {
        return <Navigate to='/login' state={{from: location} } />
    }

    return <Outlet />
}