import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import '../assets/registration.css'
import axios from "axios";

function RegistrationForm() {
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerMno, setCustomerMno] = useState('');
    const [gotoMenu, setGotoMenu] = useState(false);
    const [error, setError] = useState([]);
    const [gotoOtpPage, setOtpPage] = useState(false);
    const [isRegDone, setRegDone] = useState(false)

    sessionStorage.setItem('email', customerEmail);
    sessionStorage.setItem('phone', customerMno);

    const handleEmailChange = (event) => {
        setCustomerEmail(event.target.value);
    }

    const handleMobileChange = (event) => {
        setCustomerMno(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:5002/checkRegistrationCustomer', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerEmail, customerMno }),
        })

        const data = await response.json();
        console.log(response)
        console.log(data)
        if (response.status === 200) {
            const otpResponse = await fetch('http://localhost:5002/otp-generate', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerEmail, customerMno })
            })

            const otpData = await otpResponse.json();

            console.log(otpResponse);
            if (otpResponse.status === 200) {
                setError("");
                setRegDone(true);
                console.log("No existing customer found");
            }
            else {
                setError(otpData.error || []);
                window.alert(otpData.error);
            }
        } else {
            setError(data.error || []);
            window.alert(data.error);
        }
    }

    if (gotoMenu) {
        return <Navigate to='/login' />
    } if (gotoOtpPage && isRegDone) {
        return <Navigate to='/otpVerification' state={{customerEmail}}/>
    }

    return (
        <div className="register-page">
            <div className="registercontainer" id="register">
                <form onSubmit={handleSubmit}>
                    <h2 className="register-page-text">Registration Form</h2>
                    <div className="input-box">
                        <span className="icon"><ion-icon name="mail"></ion-icon></span>
                        <input className="input-text" type="email" required id="email" value={customerEmail} onChange={handleEmailChange} />
                        {/* autoComplete="off" */}
                        <label htmlFor="email">Email</label>
                    </div>
                    {error.hasOwnProperty('customer_email') && <span className="error-message">Email already exists</span>}
                    <div className="input-box">
                        <span className="icon"><ion-icon name="phone-portrait-outline"></ion-icon></span>
                        <input className="input-text" type="text" id="number" required maxLength="10" onChange={handleMobileChange} />
                        <label htmlFor="number">Mobile No</label>
                    </div>
                    {error.hasOwnProperty('customer_mno') && <span className="error-message">Mobile Number already exists</span>}
                    <button type="submit" onClick={() => setOtpPage(true)}>Register</button><br /><br />
                    <br />
                    <div className="menupage" onClick={()=>setGotoMenu(true)}>
                        <a>Back to Login</a>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default RegistrationForm;