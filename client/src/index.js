import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from "react-router-dom";
import Routes from "./Routes";
import { FrontendContextProvider } from './Context/FrontendContextProvider';
import { BackendContextProvider } from "./Context/BackendContextProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <FrontendContextProvider>
            <BackendContextProvider>
                <RouterProvider router={Routes} />
            </BackendContextProvider>
        </FrontendContextProvider>
    </React.StrictMode>
);
