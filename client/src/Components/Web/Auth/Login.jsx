import React, {useState} from "react";
import {Link} from "react-router-dom";
import axiosFrontend from "../../../axiosFront";
import {useFrontendStateContext} from "../../../Context/FrontendContextProvider"


const Login = () => {

    const [formInputs, setFormInputs] = useState({email:"", password:""});
    const [validationErr, setValidationErr] = useState("");
    const [functionalErr, setFunctionalErr] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const {setAuthUser, manageAuthToken} = useFrontendStateContext();

    const handleFormInputs = (e) => {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value
        });
    }

    const handleFormSubmit = () => {
        setValidationErr(""); setFunctionalErr(""); setSuccessMsg("");
        
        axiosFrontend.post('/login', { email:formInputs.email, password:formInputs.password })
        .then((response) => { 
            const data = response.data;
            setAuthUser(data.user);
            manageAuthToken(data.token);
            setFormInputs({email:"", password:""})
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
                        <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                        <p className="text-center small">Enter your Email & Password to login</p>
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
                            <label htmlFor="email" className="form-label">Email</label>
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
                            <label htmlFor="password" className="form-label">Password</label>
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
                            <button className="btn btn-primary w-100" type="button" onClick={handleFormSubmit}>Login</button>
                        </div>
                    </form>
                </div>
                <div className="pt-1 pb-2">
                    <p className="text-center small">Don't have account ? <Link to={'/signup'}><u><b> Register </b></u></Link> </p>
                </div>
            </div>
        </>
    );
}

export default Login;