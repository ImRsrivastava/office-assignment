import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosFrontend from '../../axiosFront';
import { FaPlusSquare, FaTimes, FaTrash, FaPencilAlt } from "react-icons/fa";
import { useFrontendStateContext } from '../../Context/FrontendContextProvider';
import Cropper from "react-easy-crop";
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
import { cropImageInPixcel } from "./Utils/CropImage"



const UploadImage = () => {
    const {authUser, baseImgUrl} = useFrontendStateContext();

    const [errorLog, setErrorLog] = useState("");
    const [successLog, setSuccessLog] = useState("");
    const [validateErr, setValidateErr] = useState("");

    const [uploadImageList, setUploadImageList] = useState ([]);

    const [uploadImageHtml, setUploadImageHtml] = useState(false);
    // const [editUploadImageHtml, setEditUploadImageHtml] = useState(false);
    const [createFormData, setCreateFormData] = useState({keywords:'', category:''});
    // const [editFormData, setEditFormData] = useState({keywords:'', category:''});
    const [chosenImage, setChosenImage] = useState("");
    const [categoryList, setCategoryList] = useState([]);    
    const [showCropBtn, setShowCropBtn] = useState(false);

    const [image, setImage] = React.useState(null);
	const [croppedArea, setCroppedArea] = React.useState(null);
	const [crop, setCrop] = React.useState({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState(1);
    const cropper = React.createRef();

    useEffect(() => {
        getUploadedImageList();
    },[]);
    

    const getUploadedImageList = () => {
        axiosFrontend.get('/upload-image/list').then((response) => {
            setTimeout(() => {
                const {data} = response;
                setUploadImageList(data);
            },500);
        }).catch((error) => {
            const errors = error.response;
            if((errors) && (errors.status === 500)) {
                setErrorLog(errors.data.msg);
                setTimeout(() => { setErrorLog("");  }, 2000);
            }
        })
    }

    const handleHtmlForm = (e) => {
        e.preventDefault();
        axiosFrontend.get('/category').then((response) => {
            if((response) && (response.status === 200)) { setCategoryList(response.data); }
            setUploadImageHtml(true);
            // setEditUploadImageHtml(false);
            setValidateErr('');  setErrorLog('');  setSuccessLog('');
            setCreateFormData({keywords:'', category:''});
        })
        .catch((er) => {
            const error = er.response;
            setErrorLog(error.data.msg); setTimeout(() => { setErrorLog(""); }, 3000);
            setUploadImageHtml(false);
            // setEditUploadImageHtml(false);
        })
    }

    const handleFormData = (e) => {
        setCreateFormData({
            ...createFormData,
            [e.target.name]: e.target.value
        });
    }
    
    const handleImageUpload = (e) => {
        setChosenImage(e.target.files[0]);
    }

    const handleFormSubmit = async () => {
        setValidateErr('');  setErrorLog('');  setSuccessLog('');
        console.log('check-chosenImage:: ', croppedArea);

        if((!createFormData.category) || (!croppedArea) || (!createFormData.keywords)) {
            if(!croppedArea) { setValidateErr({image: '* Image should not be blank.'}); }
            if(!createFormData.keywords) { setValidateErr({keywords: '* Keyword should be required.'}); }
            if(!createFormData.category) { setValidateErr({category: '* Category should not be blank.'}); }
            return false;
        }
        else {
            const formData = new FormData();
            formData.append('image', croppedArea);
            formData.append('keywords', createFormData.keywords);
            formData.append('category', createFormData.category);
            formData.append('userId', authUser.id);

            await axiosFrontend.post('/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((response) => {
                getUploadedImageList();
                setSuccessLog(response.data.msg);
                setUploadImageHtml(false);
                setCreateFormData({keywords:'', category:''});
                setChosenImage('');
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
    }


/******************************************************/
    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        // console.log(croppedAreaPercentage, croppedAreaPixels);
		setCroppedArea(croppedAreaPixels);
	};

	const onSelectFile = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.addEventListener("load", () => {
				setImage(reader.result);
                setShowCropBtn(true);
			});
		}
	};

    const handleCrop = async () => {
        if (!croppedArea || !image) {
            return;
        }    
        const canvas = await cropImageInPixcel(image, croppedArea);    
        canvas.toBlob(
            (blob) => {
                const blobUrl = window.URL.createObjectURL(blob);
                // setChosenImage(blobUrl);
            },
            "image/jpeg",
            0.66
        );
    };

    
    return (
        <>
            <div className="pagetitle">
                <h1>Upload Image</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Upload Image</li>
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
                                    <h5>Uploaded Image List</h5>
                                    <button type="button" className="btn btn-dark btn-sm btn-click" onClick={handleHtmlForm} ><FaPlusSquare/>&nbsp; Upload Image </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table mt-4" id="users-list-tbl">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Keywords</th>
                                            {/* <th scope="col" className="text-end">Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {uploadImageList.length > 0 && (
                                        uploadImageList.map((list, index) => {
                                            return (
                                                <>
                                                    <tr key={list.id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{list.category_name}</td>
                                                        <td><a href={baseImgUrl+'/'+list.image} target="_blank">{list.image}</a></td>
                                                        <td>{list.keywords}</td>
                                                        {/* <td className="text-end">
                                                            <div onClick={() => deleteUserInfo( btoa(btoa(list.id)) )} className="btn btn-outline-danger btn-sm fa-btn-danger mr-1"><FaTrash /></div>
                                                        </td> */}
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
                    { (uploadImageHtml) ?
                    <>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title justify-content-between d-flex">
                                    <h5>Upload Image</h5>
                                    <span className="component-cross-icon" onClick={() => setUploadImageHtml(false)}><FaTimes/></span>
                                </div>
                            </div>
                            <div className="card-body">
                                <form method="post" className="mt-4">
                                    <input type="hidden" name="userId" id="userId" value={authUser.id} />

                                    <div className="row mb-3">
                                        <label htmlFor="category" className="col-sm-3 col-form-label"> Category :<span className='text-danger'>*</span></label>
                                        <div className="col-sm-9">
                                            <select className="form-control" name="category" id="category" onChange={handleFormData}>
                                                <option value="" > Select Category </option>
                                                {(categoryList.length > 0 && (
                                                    categoryList.map((list) => {
                                                        return (<><option key={list.id} value={list.id}>{ list.category_name }</option></>)
                                                    })
                                                ))}
                                            </select>
                                            {(validateErr.category) ? <div className="invalid-feedback">{validateErr.category}</div> : ''}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label htmlFor="image" className="col-sm-3 col-form-label"> Choose Image :<span className='text-danger'>*</span></label>
                                        <div className="col-sm-9">
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="image"
                                                name="image"
                                                autoComplete="off"
                                                onChange={onSelectFile}
                                                // accept="image/png, image/jpeg, image/jpg"
                                            />
                                            {(validateErr.image) ? <div className="invalid-feedback">{validateErr.image}</div> : ''}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label htmlFor="keywords" className="col-sm-3 col-form-label"> Keywords :<span className='text-danger'>*</span></label>
                                        <div className="col-sm-9">
                                            <textarea
                                                className="form-control"
                                                id="keywords"
                                                name="keywords"
                                                autoComplete="off"
                                                value={createFormData.keywords}
                                                onChange={handleFormData}
                                                rows="4"
                                            ></textarea>
                                            {(validateErr.keywords) ? <div className="invalid-feedback">{validateErr.keywords}</div> : ''}
                                        </div>
                                    </div>

                                    <div className="col-sm-12 text-end">
                                        <button type="button" className="btn btn-dark btn-sm btn-click" onClick={handleFormSubmit}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {showCropBtn && (
                            <>
                            <Cropper
                                ref={cropper}
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspectRatio={16 / 9}
                                guides={true}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                style={{ height: 300, width: '100%' }}
                            />
                            <button type="button" className="btn btn-outline-dark btn-sm float-end mt-2 mx-3 px-4" onClick={handleCrop}>Crop</button>
                            </>
                        )}
                        </>
                    : "" }
                    </div>
                </div>
            </section>
        </>
    )
}

export default UploadImage;