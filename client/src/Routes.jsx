import React from "react";
import {createBrowserRouter} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/style.css";

import AppLayout from "./Components/Web/Layouts/AppLayout";
import HeaderLayout from "./Components/Web/Layouts/HeaderLayout";
import Login from "./Components/Web/Auth/Login";
import SignUp from "./Components/Web/Auth/SignUp";
import Dashboard from "./Components/Web/Dashboard";
import UploadImage from "./Components/Web/UploadImage";
import NotFound from "./Components/Admin/NotFound";
import GalleryPage from "./Components/Web/GalleryPage";

import AdminAppLayout from "./Components/Admin/Layouts/AppLayout";
import AdminHeaderLayout from "./Components/Admin/Layouts/HeaderLayout";
import AdminLogin from "./Components/Admin/Auth/Login";
import AdminDashboard from "./Components/Admin/Dashboard";
import AdminCategories from "./Components/Admin/Category/Categories";
import AdminUsers from "./Components/Admin/UsersList";

const Routes = createBrowserRouter([
    {
        path: '/gallery',
        element: <GalleryPage />,
    },
    {
        path: '/',
        children: [
            {
                path: '/',
                element: <HeaderLayout />,
                children: [
                    {
                        path: '/',
                        element: <Dashboard />
                    },
                    {
                        path: '/upload',
                        element: <UploadImage />
                    }
                ]
            },
            {
                path: '/',
                element: <AppLayout />,
                children: [
                    {
                        path: '/login',
                        element: <Login />
                    },
                    {
                        path: '/signup',
                        element: <SignUp />
                    }
                ]
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    },

    {
        path: 'admin',
        element: <AdminHeaderLayout />,
        children: [
            {
                path: '',
                element: <AdminDashboard />
            },
            {
                path: 'category',
                element: <AdminCategories />
            },
            {
                path: 'users',
                element: <AdminUsers />
            },
        ]
    },
    {
        path: 'admin',
        element: <AdminAppLayout />,
        children: [
            {
                path: 'login',
                element: <AdminLogin />
            },
        ]
    },
]);


export default Routes