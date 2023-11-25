import React, {useEffect, useState} from "react";
import {Outlet, Navigate, Link, useLocation} from "react-router-dom";
import {useBackendStateContext} from "../../../Context/BackendContextProvider";
import axiosBackend from "../../../axiosBack";



const HeaderLayout = () => {

    const location = useLocation();
    const pathName = location.pathname;
    const {authUser, authToken, setAuthUser, manageAuthToken} = useBackendStateContext();

    useEffect(() => {
        axiosBackend.get('/auth').then((response) => {
            setAuthUser(response.data);
        }).catch((error) => {
            const errors = error.response;
            if((errors) && (errors.status === 401)) { manageAuthToken(null); }
        });
    },[]);

    if(!authToken) { return <Navigate to="login" /> }

    const onLogout = () => {
        setAuthUser({});
        manageAuthToken(null);
    }

    return (
        <>
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-between">
                    <Link to="index.html" className="logo d-flex align-items-center">
                        <span className="d-none d-lg-block"> React App </span>
                    </Link>
                    <i className="bi bi-list toggle-sidebar-btn"></i>
                </div>

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">
                        <li className="nav-item d-block d-lg-none">
                            <a className="nav-link nav-icon search-bar-toggle " href="#!">
                                <i className="bi bi-search"></i>
                            </a>
                        </li>

                        <li className="nav-item dropdown pe-3">
                            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="" onClick={onLogout} data-bs-toggle="dropdown">
                                <span className="d-md-block dropdown-toggle ps-2">{authUser.name}</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    <li className="nav-item">
                        <Link className={(pathName === '/admin') ? 'nav-link' : 'nav-link collapsed'}  to="/admin">
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className={ 
                            ((pathName === '/admin/category') 
                            || 
                            (pathName === '/admin/category/create')
                            || 
                            (pathName === '/admin/category/edit')) 
                            ? 'nav-link' 
                            : 'nav-link collapsed'} 
                            to="/admin/category">
                            <span>Category</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className={ 
                            ((pathName === '/admin/users')) 
                            ? 'nav-link' 
                            : 'nav-link collapsed'} 
                            to="/admin/users">
                            <span>Users</span>
                        </Link>
                    </li>

                    {/* <li className="nav-item">
                        <Link className={ 
                            ((pathName === '/admin/branch') 
                            || 
                            (pathName === '/admin/branch/create')) 
                            ? 'nav-link' 
                            : 'nav-link collapsed'} 
                            to="/admin/branch">
                            <span>Users</span>
                        </Link>
                    </li> */}

                    {/* <li className="nav-heading">Pages</li>

                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="users-profile.html">
                            <i className="bi bi-person"></i>
                            <span>Profile</span>
                        </Link>
                    </li> */}
                </ul>
            </aside>

            <main id="main" className="main">

                < Outlet />

            </main>

            <footer id="footer" className="footer">
                <div className="copyright mx-2">
                    &copy; Copyright <strong><span>React App</span></strong>. All Rights Reserved
                </div>
            </footer>
        </>
    );
}

export default HeaderLayout;