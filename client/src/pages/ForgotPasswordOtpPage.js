import React, { useState, useRef } from "react";
// import OTPInput from "react-otp-input";
import { Navigate, useLocation } from "react-router-dom";

import '../assets/forgotPasswordOtpPage.css'

function ForgotPasswordOtpForm() {
    const [otp, setOtp] = useState("");
    const [moveToForgotPage, setMoveToForgotPage] = useState(false);
    const [error, setError] = useState('');
    const [moveToReSetPwdPage, setMoveToResetPwdPage] = useState(false);

    const handleOtpInput = (event) =>{
        setOtp(event.target.value);
    }

    // getting email from forgot password page
    // const email = sessionStorage.getItem('email');
    const location = useLocation();
    const email = location.state?.email;
    console.log("Inside the forgot password resend", email);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const data = await fetch(`http://localhost:5002/otp-verification`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp })
            })
            const response = await data.json();
            console.log(response)
            if (data.status === 200) {
                setError('');
                //   setData(response);
                console.log("OTP Verified Successfully");
                setMoveToResetPwdPage(true)
        } else {
            setError(response.message);
            //   response.message === "Invalid OTP" ? window.alert(response.message) : setError(response.message)
            response.message === "OTP expired" || response.message === "Invalid OTP" ? window.alert(response.message) : setError(response.message);
            // response.message === "OTP expired" ? handleAlertClose() : setError(response.message);
        }
        }catch(error){
            console.log('Error:', error);
        }
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
    const handleAlertClose = () =>{
        window.location.href = "/forgotPassword"
    }
    if(moveToForgotPage){
        return <Navigate to='/forgotPassword' />
    } if(moveToReSetPwdPage){
        return <Navigate to="/resetPassword" state={{ email }} />
    }

    return(
        <div className="forgot-page">
            <div className="forgot-container">
                <form onSubmit={handleSubmit}>
                    <a className="close" onClick={()=>setMoveToForgotPage(true)}> X </a>
                    <div className="otp">
                        <span className="title">OTP Verification</span>
                        <p className="description">Please enter the code we have sent you. </p>
                    </div>
                    <div className="otp-inputs">
                        <span className="icon"><ion-icon name="otp"></ion-icon></span>
                        <input className="input-text" type="text" required maxLength="5" value={otp} onChange={handleOtpInput}/>
                        <label htmlFor="text">Enter OTP Code</label>
                    </div>
                    {/* <div className="otp-inputs">
                        <input type="text" placeholder="" maxlength="1" />
                        <input type="text" placeholder="" maxlength="1" />
                        <input type="text" placeholder="" maxlength="1" />
                        <input type="text" placeholder="" maxlength="1" />
                        <input type="text" placeholder="" maxlength="1" />
                    </div> */}
                    <button type="submit" className="verify">Verify</button>
                    <h6 className="resend">You don't receive the code ? <a className="resend" href="" onClick={reSendOtp}> Re-Send</a></h6>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordOtpForm;
 {/* <script>
        let notification = document.getElementById('notification');
        let successmsg = ' <ion-icon name="checkbox"></ion-icon> OTP Sent Successfully ! ';
        function showToast(msg){
            let toast = document.createElement('div');
            toast.classList.add('toast');
            toast.innerHTML = msg;   
            notification.appendChild(toast); 

            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    </script> */}