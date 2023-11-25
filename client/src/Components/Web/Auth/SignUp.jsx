import React, {useState} from "react";
import {Link} from "react-router-dom";
import axiosFrontend from "../../../axiosFront";


const SignUp = () => {

    const [formInputs, setFormInputs] = useState({name:"", email:"", password:"", confirmPassword:"", contact:""});
    const [validationErr, setValidationErr] = useState("");
    const [functionalErr, setFunctionalErr] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleFormInputs = (e) => {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value
        });
    }

    const handleFormSubmit = () => {
        setValidationErr(""); setFunctionalErr(""); setSuccessMsg("");
        
        axiosFrontend.post('/signup', {
            name:formInputs.name, 
            email:formInputs.email, 
            password:formInputs.password, 
            confirmPassword:formInputs.confirmPassword,
            contact:formInputs.contact
        })
        .then((response) => { 
            const data = response.data;
            setSuccessMsg(data.msg);
            setFormInputs({name:"", email:"", password:"", confirmPassword:"", contact:""})
            setTimeout(() => { setSuccessMsg(""); }, 3000);
        })
        .catch((er) => { 
            const error = er.response;
            if((error) && (error.status === 422)) { setValidationErr(error.data.errors);   }
            else { setFunctionalErr(error.data.msg); setTimeout(() => { setFunctionalErr(""); }, 3000);  }
        });
    }

    
    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Register Yourself</h5>
                        <p className="text-center small">Enter your Information to register</p>
                    </div>

                    {functionalErr.length > 0 && (
                        <>
                            <div className="alert alert-danger">
                                <div className="text-start"> {functionalErr} </div>
                            </div>
                        </>
                    )}
                    {successMsg.length > 0 && (
                        <>
                            <div className="alert alert-success">
                                <div className="text-start"> {successMsg} </div>
                            </div>
                        </>
                    )}

                    <form className="row g-3 needs-validation" >
                        <div className="col-12">
                            <label htmlFor="name" className="form-label">Name <span className="text-danger">*</span></label>
                            <div className="input-group has-validation">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    id="name"
                                    autoComplete="off"
                                    value={formInputs.name}
                                    onChange={handleFormInputs}
                                    maxLength="50"
                                />
                            </div>
                            {(validationErr.name) ? <div className="invalid-feedback">{validationErr.name}</div> : ''}
                        </div>

                        <div className="col-12">
                            <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                            <div className="input-group has-validation">
                                <span className="input-group-text">@</span>
                                <input
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    id="email"
                                    autoComplete="off"
                                    value={formInputs.email}
                                    onChange={handleFormInputs}
                                    maxLength="50"
                                />
                            </div>
                            {(validationErr.email) ? <div className="invalid-feedback">{validationErr.email}</div> : ''}
                        </div>

                        <div className="col-12">
                            <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                id="password"
                                autoComplete="off"
                                value={formInputs.password}
                                onChange={handleFormInputs}
                                maxLength="12"
                            />
                            {(validationErr.password) ? <div className="invalid-feedback">{validationErr.password}</div> : ''}
                        </div>

                        <div className="col-12">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                id="confirmPassword"
                                autoComplete="off"
                                value={formInputs.confirmPassword}
                                onChange={handleFormInputs}
                                maxLength="12"
                            />
                            {(validationErr.confirmPassword) ? <div className="invalid-feedback">{validationErr.confirmPassword}</div> : ''}
                        </div>

                        <div className="col-12">
                            <label htmlFor="contact" className="form-label">Contact <span className="text-danger">*</span></label>
                            <div className="input-group has-validation">
                                <input
                                    type="text"
                                    name="contact"
                                    className="form-control"
                                    id="contact"
                                    autoComplete="off"
                                    value={formInputs.contact}
                                    onChange={handleFormInputs}
                                    maxLength="10"
                                />
                            </div>
                            {(validationErr.contact) ? <div className="invalid-feedback">{validationErr.contact}</div> : ''}
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary w-100" type="button" onClick={handleFormSubmit}>Sign Up</button>
                        </div>
                    </form>
                </div>
                <div className="pt-1 pb-2">
                    <p className="text-center small">Already have account! <Link to={'/login'}><u><b> Login </b></u></Link> </p>
                </div>
            </div>
        </>
    );
}

export default SignUp;