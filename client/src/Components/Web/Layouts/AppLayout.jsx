import React from "react";
import {Outlet, Navigate} from "react-router-dom";
import { useFrontendStateContext } from "../../../Context/FrontendContextProvider";



const AppLayout = () => {

    const {authToken} = useFrontendStateContext();
    if(authToken) { return <Navigate to="/" /> }

    return (
        <>
            <main>
                <div className="container">
                    <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                    < Outlet />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default AppLayout;