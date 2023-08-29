import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import '../assets/dashboard.css';

function Dashboard() {

    const [gotoCCPage, setGotoCCPage] = useState(false);
    const [gotoMenuPage, setGotoMenuPage] = useState(false);
    const [gotoKYCVerificationPage, setKYCVerificationPage] = useState(false);

    useEffect(() => {
        // Toggle Button Functionality
        const toggle = document.querySelector(".toggle");
        const navigation = document.querySelector(".navigation");
        const main = document.querySelector(".main");

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
            if (toggle) {
                toggle.removeEventListener("click", handleClick);
            }

            if (logout) {
                logout.addEventListener("click", logoutHandleClick)
            }

            if (logoutClose) {
                logoutClose.addEventListener("click", logoutCloseHandleClick)
            }

            if (logoutCancel) {
                logoutCancel.addEventListener("click", logoutCancelHandleClick)
            }
        };

    }, []);

    if (gotoCCPage) {
        return <Navigate to="/createCustomer" />
    } else if (gotoMenuPage) {
        return <Navigate to="/backOffice" />
    } else if(gotoKYCVerificationPage) {
        return <Navigate to="/kycVerification" />
    }

    return (
        <div className="dashboard-page">
            <div className="container ">
                <div className="navigation">
                    <ul>
                        <li>
                            <a>
                                <span className="icon"><ion-icon name="home"></ion-icon></span>
                                <span className="title">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => setGotoCCPage(true)}>
                                <span className="icon"><ion-icon name="create"></ion-icon></span>
                                <span className="title" id="create">Create Customer</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => setKYCVerificationPage(true)}>
                                <span className="icon"><ion-icon name="create"></ion-icon></span>
                                <span className="title" id="create">KYC Verification</span>
                            </a>
                        </li>
                        <li>
                            <a id="logout">
                                <span className="icon"><ion-icon name="log-out"></ion-icon></span>
                                <span className="title">Log out</span>
                            </a>
                        </li>
                    </ul>
                </div>
                {/* Navigation ends  */}
                {/* Main Starts */}
                <div className="main">
                    <div className="topbar">
                        <div className="toggle">
                            <ion-icon name="menu"></ion-icon>
                        </div>

                        {/* <div className="user">
                            <img src={Profile} alt="" />
                        </div> */}
                    </div>
                    {/* Main Ends */}
                    {/* =============================Dahsboard Page Start============================  */}
                    <div className="card_header">
                        <div className="title">
                            <span>
                                <h2>Dashboard</h2>
                            </span>
                        </div>
                        {/* <div className="search">
                            <label>
                                <input type="text" placeholder="Search" />
                                <ion-icon name="search"></ion-icon>
                            </label>
                        </div> */}
                    </div>
                    <div className="dahsborard-card-box">
                            <div className="card" onClick={() => setGotoCCPage(true)}>
                                <p>Create Customer</p>  
                            </div>
                            <div className="card" onClick={() => setKYCVerificationPage(true)}>
                                <p>KYC Verification</p>  
                            </div>
                    </div>
                    {/*  */}
                        
                    
                    {/* =============================Dahsboard Page Ends============================  */}
                    
                    {/* ========================Log out page=====================  */}
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
                </div>
            </div>
            {/*  ========================Log out page Ends=====================  */}
            {/*  Scripts  */}
            {/* <script src="./dashboard.js"></script>
            <script src="./createCustomer.js"></script>
            <script src="./logout.js"></script>
            {/* IonIcons */}
            {/* <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
            <script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script> */}

        </div>
    )
}

export default Dashboard;