import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import '../assets/createCustomer.css'

function CreateCustomer() {

    const [gotoCCPage, setGotoCCPage] = useState(false);
    const [gotoMenuPage, setGotoMenuPage] = useState(false);
    const [gotoDashboardPage, setGotoDashboardPage] = useState(false);
    const [gotoKYCVerificationPage, setKYCVerificationPage] = useState(false);
    const [isEditDataExist, setEditDataExist] = useState([]);
    const [dbData, setDbData] = useState([]);
    const [isUpdatecustomerName, setUpdateCustomerName] = useState('');
    const [isUpdatecustomerEmail, setUpdateCustomerEmail] = useState('');
    const [isUpdatecustomerMno, setUpdateCustomerMno] = useState('');
    const [isEditPopupOpen, setEditPopupOpen] = useState(false);
    const [status, setStatus] = useState('')
    const [editData, setEditData] = useState(
        {
            customerId: '',
            customerFirstName: '',
            customerSecondName: '',
            customerEmail: '',
            customerMno: '',
            customerDob: '',
            customerGender: '',
            customerAddress1: '',
            customerAddress2: '',
            customerCountry: '',
            customerDocumentType: ''
        }
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(true);
    const [getStatus, setGetStatus] = useState('');
    const getAllImages = []

    const handleEdit = (rowdata) => {
        setEditData(rowdata);
        setEditPopupOpen(true);
    }

    const handlePopupInputChange = (event) => {
        const { name, value } = event.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const customerId = editData.customer_id

    const handleEditPopupSubmit = async (event) => {
        event.preventDefault();

        console.log(editData);

        setEditPopupOpen(true)
        try {

            const response = await fetch('http://localhost:5002/check-customer', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ editData, isUpdatecustomerEmail, isUpdatecustomerMno }),
            })

            const data = await response.json();
            // console.log(data)
            if (response.ok) {
                const response = await fetch(`http://localhost:5002/update-data/${customerId}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ editData, isUpdatecustomerName, isUpdatecustomerEmail, isUpdatecustomerMno }),
                });

                // console.log(response);
                const updatedData = await response.json();
                // console.log(updatedData);

                if (response.ok) {
                    // Update the data in the frontend
                    setUpdateCustomerName('');
                    setUpdateCustomerEmail('');
                    setUpdateCustomerMno('');
                    setEditPopupOpen(false);
                    window.location.reload(false);
                } else {
                    console.log('Data update failed:', updatedData.errors);
                    // Handle the error case, display error message, etc.
                }
            } else {
                setEditDataExist(data.errors || []);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    getAllImages.push(editData.fieldName)
    
    const isEmptygetAllImages = typeof getAllImages[0] === 'undefined'
    const imageNamesArray = isEditPopupOpen && isEmptygetAllImages === false ? getAllImages[0].split(', ') : console.error("Photos Not Available");
  

    const handleImageAction = async (imageFilename, shouldDownload, download) => {
        const downloadFirstName = editData.customer_firstName
        const downloadSecondName = editData.customer_secondName
        const downloadImageName = downloadFirstName.concat(downloadSecondName, " ", download)
        try {
            const response = await fetch(`http://localhost:5002/get-image/${imageFilename}`);
            if (response.ok) {
                const blob = await response.blob();
                setImageSrc(URL.createObjectURL(blob));
                if (shouldDownload) {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.download = downloadImageName;
                    downloadLink.click();
                }
            } else {
                console.error('Image request failed');
            }
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const fetchDataFromMongoDB = () => {
        fetch("http://localhost:5002/getKycData", { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                setDbData(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const UpdateVerifyStatus = async (status, reasonText) => {
        console.log(status)
        setStatus(status)
        console.log(reasonText)
        setEditPopupOpen(false);
        try {
            const response = await fetch(`http://localhost:5002/updateStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerId, status, reasonText, email: editData.customer_email }),
            })
            const data = await response.json()
            console.log(data)
            if (response.ok) {
                
                window.location.reload();
            }

        } catch (error) {
            console.error(error)
        }
    }

    const rejectKycVerify = (status) => {

        let reasonText = prompt("Please Specify Rejection Reason" + "")
        console.log(reasonText)
        if (reasonText === "" || reasonText === null || reasonText === undefined) {
            reasonText = null
        } else {
            UpdateVerifyStatus(status, reasonText)
        }

    }

    useEffect(() => {
        // Toggle Button Functionality
        const toggle = document.querySelector(".create-toggle");
        const navigation = document.querySelector(".create-navigation");
        const main = document.querySelector(".create-main");

        const handleClick = () => {
            navigation.classList.toggle("active");
            main.classList.toggle("active");
        };

        if (toggle) {
            toggle.addEventListener("click", handleClick);
        }

        // Logout Button Functionality
        const logout = document.querySelector("#logout");
        const logoutBg = document.querySelector(".logout-popup");
        const logoutClose = document.querySelector(".logout-close");
        const logoutCancel = document.querySelector(".cancel");

        const logoutHandleClick = () => {
            logoutBg.classList.add('logout-bg-active');
        }

        const logoutCloseHandleClick = () => {
            logoutBg.classList.remove('logout-bg-active');
        }

        const logoutCancelHandleClick = () => {
            logoutBg.classList.remove('logout-bg-active');
        }

        return () => {

            fetchDataFromMongoDB();

            if (toggle) {
                toggle.removeEventListener("click", handleClick);
            }

            if (logout) {
                logout.addEventListener("click", logoutHandleClick);
            }

            if (logoutClose) {
                logoutClose.addEventListener("click", logoutCloseHandleClick);
            }

            if (logoutCancel) {
                logoutCancel.addEventListener("click", logoutCancelHandleClick);
            }
        };

    }, []);

    const onPageChange = (page) => {
        setCurrentPage(page);
    }

    const renderTableData = () => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const filteredData = dbData.filter((record) =>
            String(record.customer_id).includes(searchTerm)
          );

        return filteredData.slice(startIndex, endIndex).map((record) => (
            <tr key={record.id}>
                <td></td>
                <td>{record.customer_id}</td>
                <td>{record.customer_firstName}</td>
                <td>{record.customer_secondName}</td>
                <td style={{ color: record.status === 'Rejected' ? 'red' : 'green' }}>{!(record.status) ? 'Not Verified' : record.status}</td>
                {/* <td>{record.balance}</td> */}
                <td>
                    <button className="edit" style={{ fontSize: '25px' }} onClick={() => handleEdit(record)}><ion-icon name="shield-checkmark-outline"></ion-icon></button>
                </td>
            </tr>
        ))
    }

    const renderPagination = () => {
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        const hasNextPage = currentPage < totalPages;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <div key={i} onClick={() => onPageChange(i)}>
                    {i}
                </div>
            )
        }
        return (
            <div className="table-icons">
                <div onClick={() => onPageChange(1)}><i className="fa-solid fa-angles-left"></i></div>
                <div onClick={() => onPageChange(currentPage - 1)}><i className="fa-solid fa-angle-left"></i></div>
                {pageNumbers}
                <div onClick={() => onPageChange(currentPage + 1)}><i className="fa-solid fa-angle-right"></i></div>
                <div onClick={() => onPageChange(totalPages)}><i className="fa-solid fa-angles-right"></i></div>
            </div>
        )
    }

    const handleVerifyClose = () => {
        setEditPopupOpen(false);
    }

    if (gotoCCPage) {
        return <Navigate to="/createCustomer" />
    } else if (gotoMenuPage) {
        return <Navigate to="/backOffice" />
    } else if (gotoDashboardPage) {
        return <Navigate to="/dashBoard" />
    } else if (gotoKYCVerificationPage) {
        return <Navigate to="/kycVerification" />
    }

    return (
        <div>
            {/* Navigation Starts */}
            <div className="create-container">
                <div className="create-navigation">
                    <ul>
                        <li>
                            <a href="#" onClick={() => setGotoDashboardPage(true)}>
                                <span className="icon"><ion-icon name="home"></ion-icon></span>
                                <span className="title">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setGotoCCPage(true)}>
                                <span className="icon"><ion-icon name="create"></ion-icon></span>
                                <span className="title" id="create">Create Customer</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => <Navigate to ="/kycVerification" />}>
                                <span className="icon"><ion-icon name="shield-checkmark-sharp"></ion-icon></span>
                                <span className="title" id="create">KYC Verification</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="logout">
                                <span className="icon"><ion-icon name="log-out"></ion-icon></span>
                                <span className="title">Log out</span>
                            </a>
                        </li>
                    </ul>
                </div>
                {/* Navigation ends */}
                {/* Main Starts */}
                <div className="create-main">
                    <div className="create-topbar">
                        <div className="create-toggle">
                            <ion-icon name="menu"></ion-icon>
                        </div>
                    </div>
                    {/* Main Ends */}
                    {/* =============================Dahsboard Page Start============================  */}
                    <div className="create-cardheader">
                        <div className="create-title">
                            <span>
                                <h2>Create Customer</h2>
                            </span>
                        </div>
                        <div className="create-search">
                            <label>
                                <input type="text" placeholder="Ex: Customer ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <ion-icon name="search"></ion-icon>
                            </label>
                        </div>
                    </div>
                    {/* Table Start  */}
                    <div className="table">
                        <div className="table-section">
                            <table className="css-serial">
                                <thead>
                                    <tr>
                                        <th>S No.</th>
                                        <th>Customer ID</th>
                                        <th>Customer Name</th>
                                        <th>Customer Email</th>
                                        <th>Status</th>
                                        {/* <th>Balance</th> */}
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>{renderTableData()}</tbody>
                            </table>
                        </div>
                    </div>
                    {/* Table Ends  */}
                    {/* Table Icons Start */}
                    {renderPagination()}
                    {/* Table Icons Ends */}
                </div>
                {/* =================== Create Customer Page Ends================  */}

                {/* =========================Edit Popup Start============================  */}
                {isEditPopupOpen && (<div className="edit-popup" id="edit-modal">
                    <div className="edit-login-card">
                        <div className="edit-card-header">
                            <p>KYC Verification</p>
                            <span className="edit-close" onClick={handleVerifyClose}>&times;</span>
                        </div>
                        <div className="edit-form">
                            <form onSubmit={handleEditPopupSubmit}>
                                <div className="edit-form-group">
                                    <label for="id">Customer Id</label>
                                    <input className="edit-id-form" name="id" id="id" type="text" maxlength="16" value={editData.customer_id} readOnly />
                                </div>
                                <div className="edit-form-group">
                                    <label for="name">Customer First Name</label>
                                    <input required name="name" id="name" type="text" value={editData.customer_firstName} readOnly />
                                </div>
                                <div className="edit-form-group">
                                    <label for="name">Customer Second Name</label>
                                    <input required name="name" id="name" type="text" value={editData.customer_secondName} readOnly />
                                </div>
                                <div className="edit-form-group">
                                    <label for="name">Customer DOB</label>
                                    <input required name="name" id="name" type="text" value={editData.customer_dob} readOnly />
                                </div>
                                <div className="edit-form-group">
                                    <label for="name">Customer Gender</label>
                                    <input required name="name" id="name" type="text" value={editData.customer_gender} readOnly />
                                </div>
                                <div className="edit-form-group">
                                    <label for="email">Customer Email</label>
                                    <input required name="email" id="email" type="email" value={editData.customer_email} readOnly />
                                    {/* {isEditDataExist.hasOwnProperty('customer_email') && <span  className="error-message">Email already exists</span>} */}
                                </div>
                                <div className="edit-form-group">
                                    <label for="number">Customer M. No</label>
                                    <input required name="number" id="number" type="text" maxlength="10" value={editData.customer_mno} readOnly />
                                    {/* {isEditDataExist.hasOwnProperty('customer_mno') && <span  className="error-message">Mobile already exists</span>} */}
                                </div>
                                <div className="edit-form-group">
                                    <label for="name">Customer Address Line 1</label>
                                    <input required name="name" id="name" type="text" value={editData.customer_addressLine1} readOnly />
                                </div>
                                <div className="edit-form-group">
                                    <label for="name">Customer Address Line 2</label>
                                    <input required name="name" id="name" type="text" value={editData.customer_addressLine2} readOnly />
                                </div>
                                <div className="edit-form-group">
                                    <label for="name">Customer Country</label>
                                    <input required name="name" id="name" type="text" value={editData.customer_country} readOnly />
                                </div>
                                <div className="edit-form-group">
                                    <label for="name">Customer Document Type</label>
                                    <input required name="name" id="name" type="text" value={editData.customer_documentType} readOnly />
                                </div>
                                {/*In Kyc, Document is not uploaded..So This button will hidden, when kyc process is complete then only show */}
                                {isEmptygetAllImages === false &&<div className="edit-form-view">
                                    <div className="edit-view">
                                        <label htmlFor="name">Photo</label>
                                        <input type="button" value="View" onClick={() => handleImageAction(imageNamesArray[0], true, 'Profile')} />
                                    </div>
                                    <div className="edit-view">
                                        <label htmlFor="name">Pan Card</label>
                                        <input type="button" value="View" onClick={() => handleImageAction(imageNamesArray[2], true, 'PanCard')} />
                                    </div>
                                    <div className="edit-view">
                                        <label htmlFor="name">Document Front Page</label>
                                        <input type="button" value="View" onClick={() => handleImageAction(imageNamesArray[3], true, 'DocFrontPage')} />
                                    </div>
                                    <div className="edit-view">
                                        <label htmlFor="name">Document Back Page</label>
                                        <input type="button" value="View" onClick={() => handleImageAction(imageNamesArray[4], true, 'DocBackPage')} />
                                    </div>
                                </div> }
                            </form>
                        </div>
                        <div className="verify-btn">
                            <input value="Verify" type="button" onClick={() => UpdateVerifyStatus("Verified")} />
                            <input className="reject" value="Reject" type="button" onClick={() => rejectKycVerify("Rejected")} />
                        </div>

                    </div>
                </div>)}
                {/* =========================Edit Popup Ends============================  */}
                {/* ========================Log out page Start=====================  */}
                <div className="logout-popup">
                    <div className="logout-card">
                        <div className="logout-card-header">
                            <span className="logout-close">&times;</span>
                        </div>
                        <div className="logout-title">
                            <h1>Log out</h1>
                            <p>Are you sure you want to Log out?</p>
                        </div>
                        <form>
                            <div className="form-group">
                                <input className="cancel" value="Cancel" type="submit" />
                                <a onClick={() => setGotoMenuPage(true)} className="logout">Log out</a>
                            </div>
                        </form>
                    </div>
                </div>
                {/*  ========================Log out page Ends=====================  */}
            </div>
        </div>
    )
}

export default CreateCustomer;