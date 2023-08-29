import React, { useState } from "react";
import { Navigate } from 'react-router-dom'

import '../assets/forgotPassword.css';


function ForgotPasswordForm() {
    const [loginPage, setLoginPage] = useState(false);
    const [email, setEmail] = useState('');
    const [moveToForgotOtp, setMoveToForgotOtp] = useState(false);
    const [error, setError] = useState('');
    const [moveToRegistration, setMoveToRegistration] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    // sessionStorage.setItem('email', email);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const response = await fetch('http://localhost:5002/forgotPasswordOtpSend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json();
            console.log(data)
            if(response.ok){
                window.alert(data.message);
                setMoveToForgotOtp(true)
            } else {
                alert(data.error)
                setError(data.error || []);
                setMoveToRegistration(true)
            }
        } catch (error){
            console.error('Error:', error)
        }
    }

    if(loginPage){
        return <Navigate to="/login" />
    } if(moveToForgotOtp){
        return <Navigate to="/forgotPasswordOtpForm" state={{ email }} />
    } if(moveToRegistration){
        return <Navigate to="/registerPage" />
    }

  return (
    <div className="forgot-page">
        <div className="forgot-container" id="forgot">
                <form onSubmit={handleSubmit}>
                    <h2 className="forgot-page-text">Forgot Password</h2>
                    <p className="forgot-page-text">( Enter your E-Mail Address )</p>
                    <br />
                    <div className="forgot-input-box">
                        <span className="icon"><ion-icon name="mail"></ion-icon></span>
                        <input type="email" required id="email" value={email} onChange={handleEmailChange}/>
                        <label htmlFor="email">Email</label>
                    </div>
                    <br />
                    <button type="submit"> Get OTP</button>
                    <br /><br />
                    <div className="back_to_login"> 
                        <a onClick={()=>setLoginPage(true)}>Back to Login</a>
                    </div>
                </form>
            </div>
    </div>
    
  );
}

export default ForgotPasswordForm;
