import React, {useState, useEffect} from "react";
import {Outlet, Navigate, Link, useLocation} from "react-router-dom";
import { useFrontendStateContext } from "../../../Context/FrontendContextProvider";
import axiosFrontend from "../../../axiosFront";


const HeaderLayout = () => {

    const location = useLocation();
    const pathName = location.pathname;
    const {authUser, authToken, setAuthUser, manageAuthToken} = useFrontendStateContext();

    useEffect(() => {
        axiosFrontend.get('/auth').then((response) => {
            setAuthUser(response.data);
        }).catch((error) => {
            const errors = error.response;
            if((errors) && (errors.status === 401)) { manageAuthToken(null); }
        });
    },[]);

    // if(!authToken) { return <Navigate to="/login" /> }
    if(!authToken) { return <Navigate to="/gallery" /> }

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

                <div className="search-bar">
                    <form className="search-form d-flex align-items-center" method="POST" action="#">
                        <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
                        <button type="submit" title="Search"><i className="bi bi-search"></i></button>
                    </form>
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

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    <h6>Kevin Anderson</h6>
                                    <span>Web Designer</span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="users-profile.html">
                                        <i className="bi bi-person"></i>
                                        <span>My Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="users-profile.html">
                                        <i className="bi bi-gear"></i>
                                        <span>Account Settings</span>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="pages-faq.html">
                                        <i className="bi bi-question-circle"></i>
                                        <span>Need Help?</span>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="#">
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Sign Out</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>

            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    <li className="nav-item">
                        <Link className={(pathName === '/') ? 'nav-link' : 'nav-link collapsed'}  to="/">
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className={ 
                            ((pathName === '/gallery')) 
                            ? 'nav-link' 
                            : 'nav-link collapsed'} 
                            to="/gallery">
                            <span>Gallery</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className={ 
                            ((pathName === '/upload')) 
                            ? 'nav-link' 
                            : 'nav-link collapsed'} 
                            to="/upload">
                            <span>Upload Image</span>
                        </Link>
                    </li>

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