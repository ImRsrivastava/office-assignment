import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import axiosBackend from "../../../axiosBack";
import 'datatables.net-dt/css/jquery.dataTables.css';
import { FaPlusSquare, FaTimes, FaTrash, FaPencilAlt } from "react-icons/fa";
import $ from 'jquery';
import 'datatables.net';
import Swal from "sweetalert2";


const Categories = () => {
    const [errorLog, setErrorLog] = useState("");
    const [successLog, setSuccessLog] = useState("");
    const [validateErr, setValidateErr] = useState("");

    const [categoryList, setCategoryList] = useState([]);
    
    const [categoryCreateHtml, setCategoryCreateHtml] = useState(false);
    const [createFormData, setCreateFormData] = useState({cateName:''});
    
    const [categoryEditHtml, setCategoryEditHtml] = useState(false);
    const [editFormData, setEditFormData] = useState({cateId:'', cateName:''});

    useEffect(() => {
        setCategoryList([])
        getCategoryList();
    },[]);

    const getCategoryList = () => {
        axiosBackend.get('/category').then((response) => {
            setTimeout(() => {
                setCategoryList(response.data);
                // setTimeout(() => { $('#users-list-tbl').DataTable(); }, 500);
            },500);
        }).catch((error) => {
            setErrorLog(error.response);
        });
    }

    const changeDateFormat = (date) => {
        const options = { day:'2-digit', 'month':'long', year:'numeric' };
        const formatedDate = new Date(date).toLocaleDateString('en-US', options);
        const [month, day, year] = formatedDate.split(' ')
        return `${day} ${month} ${year}`;
    }

    const handleFormData = (e) => {
        setValidateErr('');  setErrorLog('');  setSuccessLog('');
        setCreateFormData({
            ...createFormData,
            [e.target.name]: e.target.value
        });
    }

    const handleFormImage = (e) => {
        setValidateErr('');  setErrorLog('');  setSuccessLog('');
        // setCreateFileData(e.target.files[0]);
    }

    const handleHtmlForm = () => {
        setCategoryCreateHtml(true);
        setCategoryEditHtml(false);
        setValidateErr('');  setErrorLog('');  setSuccessLog('');
        setCreateFormData({cateName:''});
    }

    const handleFormSubmit = () => {
        setValidateErr('');  setErrorLog('');  setSuccessLog('');
        axiosBackend.post('/category/create',{cateName:createFormData.cateName})

        .then((response) => {
            getCategoryList();
            setSuccessLog(response.data.msg);
            setCategoryCreateHtml(false);
            setCreateFormData({cateName:''});
            setTimeout(() => { setSuccessLog("");  }, 2000);
        })
        .catch((error) => {
            const errors = error.response;
            if((errors) && (errors.status === 422)) {
                setValidateErr(errors.data.errors); }

            else if((errors) && (errors.status === 404) ) {
                setErrorLog('* Request API '+errors.statusText);
                setTimeout(() => { setErrorLog("");  }, 2000); }
            
            else {
                setErrorLog(errors.data.msg);
                setTimeout(() => { setErrorLog("");  }, 2000); }
        });
    }

    const deleteUserInfo = (deleteId) => {
        setErrorLog('');  setSuccessLog('');
        Swal.fire({
            position: 'top',
            title: 'Are you sure ?',
            text: "You want to delete this user ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#212529',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosBackend.delete('/category/'+deleteId).then((response) => {
                    console.log('check-del-reponse:: ', response);
                    setSuccessLog(response.data.msg);
                    getCategoryList();
                    setTimeout(() => { setSuccessLog("");  }, 2000);
                }).catch((error) => {
                    console.log('check-del-error:: ', error);
                    const errors = error.response;
                    if(errors && errors.status === 500) {
                        setErrorLog(errors.data.msg);   
                        setTimeout(() => { setErrorLog("");  }, 2000); }
                })
            }
        })
    }

    const editUserInfo = (editId) => {
        setValidateErr('');  setErrorLog('');  setSuccessLog('');
        setEditFormData({cateName:'', cateId:''});
        setCategoryCreateHtml(false);
        
        axiosBackend.get('/category/'+editId).then((response) => {
            setCategoryEditHtml(true);
            setEditFormData({ cateName: response.data[0].category_name, cateId:response.data[0].id  });
            handleEditFormData();
        })
        .catch((error) => {
            const errors = error.response;
            if(errors && errors.status === 500) {
                setErrorLog(errors.data.msg);
                setTimeout(() => { setErrorLog("");  }, 2000); }
        });
    }

    const handleEditFormData = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name] : e.target.value
        });
    }

    const handleFormUpdate = () => {
        setValidateErr('');  setErrorLog('');  setSuccessLog('');
        axiosBackend.put('/category/update',{ cateName:editFormData.cateName, cateId:editFormData.cateId })
        .then((response) => {
            getCategoryList();
            setSuccessLog(response.data.msg);
            setCategoryEditHtml(false);
            setEditFormData({cateName:'', cateId:''});
            setTimeout(() => { setSuccessLog("");  }, 2000);
        })
        .catch((error) => {
            const errors = error.response;
            if((errors) && (errors.status === 422)) {
                setValidateErr(errors.data.errors); }

            else if((errors) && (errors.status === 404) ) {
                setErrorLog('* Request API '+errors.statusText);
                setTimeout(() => { setErrorLog("");  }, 2000); }
            
            else {
                setErrorLog(errors.data.msg);
                setTimeout(() => { setErrorLog("");  }, 2000); }
        });
    }

    return (
        <>
            <div className="pagetitle">
                <h1>Categories</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Categories</li>
                    </ol>
                </nav>
            </div>

            <section className="section">
                {errorLog && (<>
                    <div className="alert alert-danger justify-content-between d-flex">
                        <div className="text-left"> {errorLog} </div>
                        <span className="component-cross-icon" onClick={() => setErrorLog("")}><FaTimes/></span>
                    </div>
                </>)}
                {successLog && (<>
                    <div className="alert alert-success justify-content-between d-flex">
                        <div className="text-left"> {successLog} </div>
                        <span className="component-cross-icon" onClick={() => setSuccessLog("")}><FaTimes/></span>
                    </div>
                </>)}
                <div className="row">
                    <div className="col-lg-7">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title justify-content-between d-flex">
                                    <h5>Categories List</h5>
                                    <button type="button" className="btn btn-dark btn-sm btn-click" onClick={handleHtmlForm} ><FaPlusSquare/>&nbsp; Add Category </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table mt-4" id="users-list-tbl">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Category</th>
                                            <th scope="col" className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {categoryList.length > 0 && (
                                        categoryList.map((list, index) => {
                                            return (
                                                <>
                                                    <tr key={list.id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{list.category_name}</td>
                                                        <td className="text-end">
                                                            <div onClick={() => deleteUserInfo( btoa(btoa(list.id)) )} className="btn btn-outline-danger btn-sm fa-btn-danger mr-1"><FaTrash /></div>
                                                            <div onClick={() => editUserInfo( btoa(btoa(list.id)) )} className="btn btn-outline-dark btn-sm fa-btn-primary"><FaPencilAlt /></div>
                                                        </td>
                                                    </tr>
                                                </>
                                            );
                                        })
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                    { (categoryCreateHtml) ?
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title justify-content-between d-flex">
                                    <h5>Create Category</h5>
                                    <span className="component-cross-icon" onClick={() => setCategoryCreateHtml(false)}><FaTimes/></span>
                                </div>
                            </div>
                            <div className="card-body">
                                <form method="post" className="mt-4">
                                    <div className="row mb-3">
                                        <label htmlFor="cateName" className="col-sm-4 col-form-label"> Cateogry Name :</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="cateName"
                                                name="cateName"
                                                placeholder="Category Name"
                                                autoComplete="off"
                                                value={createFormData.cateName}
                                                onChange={handleFormData}
                                                maxLength="50"
                                            />
                                            {(validateErr.cateName) ? <div className="invalid-feedback">{validateErr.cateName}</div> : ''}
                                        </div>
                                    </div>

                                    <div className="col-sm-12 text-end">
                                        <button type="button" className="btn btn-dark btn-sm btn-click" onClick={handleFormSubmit}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    : "" }

                    { (categoryEditHtml) ?
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title justify-content-between d-flex">
                                    <h5>Edit Category</h5>
                                    <span className="component-cross-icon" onClick={() => setCategoryEditHtml(false)}><FaTimes/></span>
                                </div>
                            </div>
                            <div className="card-body">
                                <form method="post" className="mt-4">
                                    <div className="row mb-3">
                                        <input type="hidden" name="cateId" value={editFormData.cateId} />
                                        
                                        <label htmlFor="editName" className="col-sm-4 col-form-label">Category Name :</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="cateName"
                                                name="cateName"
                                                placeholder="Category Name"
                                                autoComplete="off"
                                                value={editFormData.cateName}
                                                onChange={handleEditFormData}
                                            />
                                            {(validateErr.cateName) ? <div className="invalid-feedback">{validateErr.cateName}</div> : ''}
                                        </div>
                                    </div>

                                    <div className="col-sm-12 text-end">
                                        <button type="button" className="btn btn-dark btn-sm btn-click" onClick={handleFormUpdate}>Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    : "" }
                    </div>
                </div>
            </section>
        </>
    )
}

export default Categories;