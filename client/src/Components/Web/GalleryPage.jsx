import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {FaSearch, FaTimes} from "react-icons/fa"
import axiosFrontend from "../../axiosFront";
import { useFrontendStateContext } from "../../Context/FrontendContextProvider";



const GalleryPage = () => {

    const {authUser, authToken, baseImgUrl, setAuthUser, manageAuthToken} = useFrontendStateContext();

    const [dashboardImg, setDashboardImg] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [errorLog, setErrorLog] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchCateId, setSearchCateId] = useState("");
    const [showLoginBtn, setShowLoginBtn] = useState(false)
    
    useEffect(() => {
        getDashboardImg();
        getCategoryList();
        
        axiosFrontend.get('/auth').then((response) => {
            setAuthUser(response.data);
            setShowLoginBtn(true);
        }).catch((error) => {
            const errors = error.response;
            if((errors) && (errors.status === 401)) { manageAuthToken(null); }
        });
    },[]);

    const getDashboardImg = () => {
        axiosFrontend.get('/image/list').then((response) => {
            setDashboardImg(response.data);
        }).catch((err) => {
            const error = err.response;
            setErrorLog(error.data.msg); setTimeout(() => { setErrorLog(""); }, 3000);
        });
    }

    const getCategoryList = () => {
        axiosFrontend.get('/category').then((response) => {
            setCategoryList(response.data);
        }).catch((err) => {
            const error = err.response;
            setErrorLog(error.data.msg); setTimeout(() => { setErrorLog(""); }, 3000);
        });
    }

    const getImageByCategory = async(cateId) => { 
        setSearchCateId(cateId); 
        await axiosFrontend.post('/image/search/', {search:searchKeyword, cateId:cateId}).then((response) => {
            setDashboardImg([])
            setDashboardImg(response.data);
        }).catch((err) => {
            const error = err.response;
            setErrorLog(error.data.msg); setTimeout(() => { setErrorLog(""); }, 3000);
        });
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
                            {(showLoginBtn) ? (
                                <Link to="/" className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                                    <span className="d-md-block dropdown-toggle ps-2">{authUser.name}</span>
                                </Link>
                            )
                            : (
                                <Link to="/login" className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                                    <span className="d-md-block dropdown-toggle ps-2">Login</span>
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </header>

            <main id="main" className="main main-home">
                <section className="section container-fluid">
                    {errorLog && (<>
                        <div className="alert alert-danger justify-content-between d-flex">
                            <div className="text-left"> {errorLog} </div>
                            <span className="component-cross-icon" onClick={() => setErrorLog("")}><FaTimes/></span>
                        </div>
                    </>)}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="justify-content-center search-form d-flex align-items-center p-4">
                                    <input type="text" name="query" className="form-control" placeholder="Search" title="Enter search keyword" autoComplete="off" value={searchKeyword} maxLength="100" onChange={(e) => setSearchKeyword(e.target.value)} />
                                    <button type="submit" title="Search" onClick={() => getImageByCategory("")}><FaSearch/></button>
                                </div>
                                <div className="card-body">
                                    <div className="justify-content-center d-flex align-items-center gap-3">
                                        <button type="button" className="btn btn-outline-dark btn-sm px-4" onClick={() => {getDashboardImg(); setSearchCateId(""); setSearchKeyword("")} }>{'All'}</button>
                                        {(categoryList.length > 0 && 
                                            categoryList.map((cl) => {
                                                return <>
                                                {(searchCateId == cl.id) ? 
                                                    <button type="button" className="active btn btn-outline-dark btn-sm px-4" onClick={() => getImageByCategory(cl.id)}>{cl.category_name}</button>
                                                    :
                                                    <button type="button" className="btn btn-outline-dark btn-sm px-4" onClick={() => getImageByCategory(cl.id)}>{cl.category_name}</button>
                                                }
                                                </>
                                            })
                                        )}
                                    </div>

                                    {/* <div className="justify-content-center d-flex align-items-center gap-3 p-4"> */}
                                    <div className="row">
                                    {(dashboardImg.length > 0 && 
                                        dashboardImg.map((dimg) => {
                                            return (
                                                <>
                                                    <div className="col-2 pt-4">
                                                        <a href={baseImgUrl+'/'+dimg.image} target="_blank"><img src={baseImgUrl+'/'+dimg.image} alt={dimg.image} className="uploaded-img" /></a>
                                                        {/* <video width="265" height="200" controls>
                                                            <source src={baseImgUrl+'/'+dimg.image} type="video/mp4" />
                                                        </video> */}
                                                    </div>
                                                </>
                                            )
                                        })
                                    )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default GalleryPage;