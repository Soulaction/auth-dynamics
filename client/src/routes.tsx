import {createBrowserRouter, Navigate} from "react-router-dom";
import Auth from "./pages/Auth/Auth";

export const router = createBrowserRouter([
    {
        path: '/registration',
        element: <Auth/>
    },
    {
        path: '/login',
        element: <Auth/>
    },
    {
        path: '*',
        element: <Navigate to='/login'></Navigate>
    }
])
