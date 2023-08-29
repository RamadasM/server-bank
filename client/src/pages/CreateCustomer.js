import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import '../assets/createCustomer.css'

function CreateCustomer (){

    const [gotoCCPage, setGotoCCPage] = useState(false);
    const [gotoMenuPage, setGotoMenuPage] = useState(false);
    const [gotoDashboardPage, setGotoDashboardPage] = useState(false);
    const [gotoKYCVerificationPage, setKYCVerificationPage] = useState(false);
    const [isEditDataExist, setEditDataExist] = useState([]);
    const [dbData, setDbData] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerMno, setCustomerMno] = useState('');
    // const [balance, setBalance] = useState('')
    const [isUpdatecustomerName, setUpdateCustomerName] = useState('');
    const [isUpdatecustomerEmail, setUpdateCustomerEmail] = useState('');
    const [isUpdatecustomerMno, setUpdateCustomerMno] = useState('');
    const [error , setError] = useState([]);
    // const [balanceErrorMessage, setBalanceErrorMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isEditPopupOpen, setEditPopupOpen] = useState(false);
    const [editData, setEditData] = useState({customerId: '', customerName: '', customerEmail:'', customerMno: '', balance:''});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleEditPopupSubmit = async (event) => {
        event.preventDefault();
        // console.log(editData);
        const customerId = editData.customer_id   
        setEditPopupOpen(true)
        try {

            const response = await fetch ('http://localhost:5002/check-customer', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({ editData, isUpdatecustomerEmail, isUpdatecustomerMno }),    
            })

            const data = await response.json();
            // console.log(data)
            if(response.ok){
                const response = await fetch(`http://localhost:5002/update-data/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({editData, isUpdatecustomerName, isUpdatecustomerEmail, isUpdatecustomerMno}),
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
            }
            else {
                    setEditDataExist(data.errors || []);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const handleCustomerIdChange = (event) => {
        setCustomerId(event.target.value);
    }
    
    const handleCustomerNameChange = (event) => {
        setCustomerName(event.target.value);
    }

    const handleCustomerEmailChange = (event) => {
        setCustomerEmail(event.target.value);
    }

    const handleCustomeMnoChange = (event) => {
        setCustomerMno(event.target.value)
    }

    // const handleBalanceChange = (event) => {
    //     setBalance(event.target.value)
    // }
  
    const handleSubmit = async (event) => {
        event.preventDefault();
       
        if(customerId.trim() === "" || customerName.trim() === "" || customerEmail.trim() === "" || customerMno.trim() === "" ){
           return setErrorMessage('Please fill out all the required fields.');
        } else{
            setErrorMessage('')
        }
        
        //  if (parseInt(balance) < 1000) {
        //     setBalanceErrorMessage('The amount should be 1000 or above.');
        // } else {
        //     setBalanceErrorMessage('');
        // }

        try{
            const response = await fetch('http://localhost:5002/check-customer', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({ customerId, customerName, customerEmail, customerMno }),    

            });

            const data = await response.json();
            if(response.ok){
                console.log("Inside the response.ok")
                const storeResponse = await fetch('http://localhost:5002/store-customer', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ customerId, customerName, customerEmail, customerMno }),  
                })
                const storeData = await storeResponse.json();
                if (storeResponse.ok) {
                    setCustomerId('');
                    setCustomerName('');
                    setCustomerEmail('');
                    setCustomerMno('');
                    // setBalance('')
                    setEditDataExist('');
                    setPopupOpen(false);
                    window.location.reload(false)
                } else {
                    // Error storing the data
                    setError('Failed to store data');
                }
            } else {
                setError(data.errors || []);
            }
        } catch(error){
            console.error('Error:', error);
        }      
    } 
   
    const handlePopClose = () => {
        setPopupOpen(false);
        setCustomerId('');
        setCustomerName('');
        setCustomerEmail('');
        setCustomerMno('');
        // setBalance('');
        setErrorMessage('');
        // setBalanceErrorMessage('');
        setError('');
    }

    const fetchDataFromMongoDB = () => {
        fetch("http://localhost:5002/getData", { method: "GET" })
          .then((res) => res.json())
          .then((data) => {
            setDbData(data);
          })
          .catch((error) => {
            console.log(error);
        });
    };
    
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
    
          if(logout){
            logout.addEventListener("click", logoutHandleClick);
          }
    
          if(logoutClose){
            logoutClose.addEventListener("click", logoutCloseHandleClick);
          }
    
          if(logoutCancel){
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
        record.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
        return filteredData.slice(startIndex, endIndex).map((record) => (
            <tr key={record.id}>
                <td></td>
                <td>{record.customer_id}</td>
                <td>{record.customer_name}</td>
                <td>{record.customer_email}</td>
                <td>{record.customer_mno}</td>
                {/* <td>{record.balance}</td> */}
                <td><button className="edit" onClick={() => handleEdit(record)}><i className="fa-solid fa-pen-to-square"></i></button></td>
            </tr>
        ))
    }

    const renderPagination = () => {
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        const hasNextPage = currentPage < totalPages;

        const pageNumbers = [];
        for(let i = 1; i <= totalPages; i++){
            pageNumbers.push(
                <div key={i} onClick={() =>onPageChange(i)}>
                    {i}
                </div>
            )
        }
        console.log(pageNumbers)
        return(
            <div className="table-icons">
                        <div onClick={() => onPageChange(1)}><i className="fa-solid fa-angles-left"></i></div>
                        <div onClick={() => onPageChange(currentPage - 1)}><i className="fa-solid fa-angle-left"></i></div>
                        {pageNumbers}
                        <div onClick={() => onPageChange(currentPage + 1)}><i className="fa-solid fa-angle-right"></i></div>
                        <div onClick={() => onPageChange(totalPages)}><i className="fa-solid fa-angles-right"></i></div>
            </div>
        )
    }

      if(gotoCCPage){
        return <Navigate to="/createCustomer" />
      } else if (gotoMenuPage) {
        return <Navigate to="/backOffice" />
      } else if (gotoDashboardPage){
        return <Navigate to ="/dashBoard" />
      } else if(gotoKYCVerificationPage) {
        return <Navigate to="/kycVerification" />
    }

    return(
        <div>
        {/* Navigation Starts */}
            <div className="create-container">
                <div className="create-navigation">
                    <ul>
                        <li>
                            <a href="#" onClick={()=>setGotoDashboardPage(true)}>
                                <span className="icon"><ion-icon name="home"></ion-icon></span>
                                <span className="title">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => <Navigate to ="/createCustomer" />}>
                                <span className="icon"><ion-icon name="create"></ion-icon></span>
                                <span className="title" id="create">Create Customer</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setKYCVerificationPage(true)}>
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
                        {/* <div className="create-user">
                            <img src= {Person} alt="" />
                        </div> */}
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
                                <input type="text" placeholder="Search" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
                                <ion-icon name="search"></ion-icon>
                            </label>
                        </div>
                        <div className="create-title">
                            <button className="btn" id="myBtn"  onClick={()=> setPopupOpen(true)}><i className="fa-solid fa-plus"></i> Create</button>
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
                                        <th>Customer M. No</th>
                                        {/* <th>Balance</th> */}
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>{renderTableData()}</tbody>
                            </table>
                        </div>
                    </div>
                    {/* Table Ends  */}
                    {/* Table Icons Start */}
                    {renderPagination()}
                    {/* <div className="table-icons">
                            <div><i className="fa-solid fa-angles-left"></i></div>
                            <div><i className="fa-solid fa-angle-left"></i></div>
                            <div>1</div>
                            <div>2</div>
                            <div><i className="fa-solid fa-angle-right"></i></div>
                            <div><i className="fa-solid fa-angles-right"></i></div>
                    </div> */}
                    {/* Table Icons Ends */}
                </div>
                {/* =================== Create Customer Page Ends================  */}
                {/* ====================Create Customer Popup Start==================  */}
                {isPopupOpen && (<div className="popup">
                    <div className="login-card">
                        <div className="card-header">
                            <p>New Customer</p>
                            <span className="close" onClick={()=>{handlePopClose()}}>&times;</span>
                            
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="create-form-group">
                                <label for="id">Customer Id</label>
                                <input required = "" name="id" id="id" type="text" maxlength="16" onChange={handleCustomerIdChange} value={customerId}/>
                                {error.hasOwnProperty('customer_id') && <span  className="error-message">Id already exists</span>}
                            </div>
                            <div className="create-form-group">
                                <label for="name">Customer Name</label>
                                <input required = "" name="name" id="name" type="text" onChange={handleCustomerNameChange} value={customerName}/>
                                
                            </div>
                            <div className="create-form-group">
                                <label for="email">Customer Email</label>
                                <input required = "" name="email" id="email" type="email" onChange={handleCustomerEmailChange} value={customerEmail}/>
                                {error.hasOwnProperty('customer_email') && <span  className="error-message">Email already exists</span>}
                            </div>
                            <div className="create-form-group">
                                <label for="number">Customer M. No</label>
                                <input required = "" name="number" id="number" type="text" maxlength="10" onChange={handleCustomeMnoChange} value={customerMno}/>
                                {error.hasOwnProperty('customer_mno') && <span  className="error-message">Mobile number already exists</span>}
                            </div>
                            {/* <div className="create-form-group">
                                <label for="number">Balance</label>
                                <input required = "" name="number" id="number" type="text" onChange={handleBalanceChange} value={balance}/>
                                {balanceErrorMessage && <span className="error-message">{balanceErrorMessage}</span>}
                                {error.hasOwnProperty('customer_mno') && <span  className="error-message">Mobile number already exists</span>}
                            </div> */}
                            <div className="create-form-group">
                                <button type="submit">Create Now</button>
                            </div>
                            <div className="create-form-group">
                            {ErrorMessage && <span className="error-message">{ErrorMessage}</span>} 
                            </div>
                        </form>
                    </div>
            </div>)}
                {/* ====================Create Customer Popup Ends==================  */}
                {/* =========================Edit Popup Start============================  */}
                {isEditPopupOpen && (<div className="edit-popup" id="edit-modal">
                    <div className="edit-login-card">
                        <div className="edit-card-header">
                            <p>Edit Customer</p>
                            <span className="edit-close" onClick={()=>setEditPopupOpen(false)}>&times;</span>                        
                        </div>
                        <form onSubmit={handleEditPopupSubmit}>
                            <div className="edit-form-group">
                                <label for="id">Customer Id</label>
                                <input className = "edit-id-form" name="id" id="id" type="text" maxlength="16" value={editData.customer_id} readOnly/>
                            </div>
                            <div className="edit-form-group">
                                <label for="name">Customer Name</label>
                                <input required name="name" id="name" type="text" onChange={(event) => {setUpdateCustomerName(event.target.value)}}/>
                            </div>
                            <div className="edit-form-group">
                                <label for="email">Customer Email</label>
                                <input required name="email" id="email" type="email" onChange={(event) => {setUpdateCustomerEmail(event.target.value)}}/>
                                {isEditDataExist.hasOwnProperty('customer_email') && <span  className="error-message">Email already exists</span>}
                            </div>
                            <div className="edit-form-group">
                                <label for="number">Customer M. No</label>
                                <input required name="number" id="number" type="text" maxlength="10" onChange={(event) => {setUpdateCustomerMno(event.target.value)}}/>
                                {isEditDataExist.hasOwnProperty('customer_mno') && <span  className="error-message">Mobile already exists</span>}
                            </div>
                            {/* <div className="edit-form-group">
                                <label for="number">Balance</label>
                                <input className = "edit-id-form" name="balance" id="balance" type="text" value={editData.balance} readOnly/>
                            </div> */}
                            <div className="edit-form-group">
                                <input value="Update" type="submit" />
                            </div>
                        </form>
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