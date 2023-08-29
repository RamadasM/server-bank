import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import '../assets/otpPage.css';

function OtpPage() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    //   const [data, setData] = useState(null);
    const [gotoPasswordPage, setPasswordPage] = useState(false)

    const location = useLocation();
    const email = location.state?.customerEmail;
    console.log("Inside the forgot password resend", email);

    const handleOtp = (event) => {
        setOtp(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('')
        const otpVerify = await fetch(`http://localhost:5002/otp-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp })
        });

        const response = await otpVerify.json();
        console.log(response)
        if (otpVerify.status === 200) {
            setError('');
            //   setData(response);
            console.log("OTP Verified Successfully");
            setPasswordPage(true)
        } else {
            setError(response.message);
            //   response.message === "Invalid OTP" ? window.alert(response.message) : setError(response.message)
            response.message === "OTP expired" || response.message === "Invalid OTP" ? window.alert(response.message) : setError(response.message)
            // response.message === "OTP expired" ? handleAlertClose() : setError(response.message)
        }
    }
    const handleAlertClose = () => {
        window.location.href = "/registerPage";
    };

    if (gotoPasswordPage && !error) {
        console.log("Inside Getting OTP:", otp)
        // return <Navigate to= '/password' state= {{otp: otp}} />;
        return <Navigate to='/password' />;
    }

    const handle = () => {
        localStorage.setItem("OTP", otp)
    }

    const reSendOtp = async(event) => {
        event.preventDefault();
        try{
            const otpSend = await fetch(`http://localhost:5002/forgotPasswordOtpSend`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })
            const response = await otpSend.json()
            if(otpSend.status === 200){
                setError('');
                alert(response.message);
            } else {
                setError(response.error)
            }
        } catch(error) {
            console.log('Error:', error)
        }
    }

    return (
        <div className="otp-page">
            <div className="otpcontainer" id="login">
                <form onSubmit={handleSubmit}>
                    <h2 className="otp-text">OTP Verification</h2><br />
                    <div className="input-box">
                        <span className="icon"><ion-icon name="otp"></ion-icon></span>
                        <input className="input-text" type="text" required maxLength={5} value={otp} onChange={handleOtp} />
                        <label htmlFor="text">Enter OTP Code</label>
                    </div>
                    <button type="submit" onClick={handle}>Verify</button>
                    <h6 className="resend">You don't receive the code ? <a className="resend" href="" onClick={reSendOtp}> Re-Send</a></h6>
                </form>
            </div>
        </div>
    )
}

export default OtpPage;