import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import {FaSearch, FaTimes} from "react-icons/fa"
// import axiosFrontend from "../../axiosFront";
// import { useFrontendStateContext } from "../../Context/FrontendContextProvider";



const Dashboard = () => {

    // const {authUser, baseImgUrl} = useFrontendStateContext();

    // const [dashboardImg, setDashboardImg] = useState([]);
    // const [categoryList, setCategoryList] = useState([]);
    // const [errorLog, setErrorLog] = useState("");
    // const [searchKeyword, setSearchKeyword] = useState("");
    // const [searchCateId, setSearchCateId] = useState("");
    
    // useEffect(() => {
    //     getDashboardImg();
    //     getCategoryList();
    // },[]);

    // const getDashboardImg = () => {
    //     axiosFrontend.get('/image/list').then((response) => {
    //         setDashboardImg(response.data);
    //     }).catch((err) => {
    //         const error = err.response;
    //         setErrorLog(error.data.msg); setTimeout(() => { setErrorLog(""); }, 3000);
    //     });
    // }

    // const getCategoryList = () => {
    //     axiosFrontend.get('/category').then((response) => {
    //         setCategoryList(response.data);
    //     }).catch((err) => {
    //         const error = err.response;
    //         setErrorLog(error.data.msg); setTimeout(() => { setErrorLog(""); }, 3000);
    //     });
    // }

    // const getImageByCategory = (cateId) => { 
    //     setSearchCateId(cateId); 
    //     axiosFrontend.post('/image/search/', {search:searchKeyword, cateId:searchCateId}).then((response) => {
    //         setDashboardImg([])
    //         setDashboardImg(response.data);
    //     }).catch((err) => {
    //         const error = err.response;
    //         setErrorLog(error.data.msg); setTimeout(() => { setErrorLog(""); }, 3000);
    //     });
    // }


    return (
        <>
            <div className="pagetitle">
                <h1>Dashboard</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                </nav>
            </div>

            {/* <section className="section">
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
                                <button type="submit" title="Search" onClick={getImageByCategory}><FaSearch/></button>
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

                                <div className="row">
                                {(dashboardImg.length > 0 && 
                                    dashboardImg.map((dimg) => {
                                        return (
                                            <>
                                                <div className="col-2 pt-4">
                                                    <a href={baseImgUrl+'/'+dimg.image} target="_blank"><img src={baseImgUrl+'/'+dimg.image} alt={dimg.image} className="uploaded-img" /></a>
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
            </section> */}
        </>
    );
}

export default Dashboard;