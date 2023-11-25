import React, { useState, useEffect } from 'react';
import axiosBackend from '../../axiosBack';
import { FaTimes } from "react-icons/fa";
import {Link} from "react-router-dom";


const UsersList = () => {

    const [usersList, setUsersList] = useState([]);
    const [errorLog, setErrorLog] = useState("");

    useEffect (() => {
        getUsersList();
    }, []);

    const getUsersList = () =>{
        axiosBackend.get('/users').then((response) => {
            setTimeout(() => {
                setUsersList(response.data);
                // setTimeout(() => { $('#users-list-tbl').DataTable(); }, 500);
            },500);
        }).catch((error) => {
            setErrorLog(error.response);
            setTimeout(() => { setErrorLog("");  }, 2000); 
        });
    }


    return (
        <>
            <div className="pagetitle">
                <h1>Users List</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Users List</li>
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
                <div className="row">
                    <div className="col-lg-10">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title justify-content-between d-flex">
                                    <h5>Users List</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table mt-4" id="users-list-tbl">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Contact</th>
                                            <th scope="col">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {usersList.length > 0 && (
                                        usersList.map((list, index) => {
                                            return (
                                                <>
                                                    <tr key={list.id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{list.name}</td>
                                                        <td>{list.email}</td>
                                                        <td>{list.contact}</td>
                                                        <td>{"User"}</td>
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
                </div>
            </section>
        </>
    )
}

export default UsersList;