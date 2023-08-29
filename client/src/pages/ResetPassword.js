import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import { Navigate, useLocation } from "react-router-dom";


import '../assets/resetPassword.css';
import { useLocale } from "antd/es/locale";

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [moveToLogin, setMoveToLogin] = useState(false);
    const [error, setError] = useState('');

    const location = useLocation();
    const email = location.state?.email;
    console.log("Inside the Reset Password", email);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(validatePassword(password)){
            if(password != confirmPassword){
                alert('Password do not match. Please re-enter your password')
            } else {
                const response = await fetch(`http://localhost:5002/resetPassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                    })
                const data = await response.json();
                console.log(response)
                if (response.status === 200) {
                  setError('');
                  console.log("Valid password:", password);
                  alert(data.message);
                  setMoveToLogin(true);
                } else {
                  alert(data.error);
                }
            }
        } else {
            // Password is invalid
            alert('Password must be between 8 and 16 characters long and contain at least one special character and one number.');
        }
    }

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[0-9]).{8,16}$/;
        const passwordRegexTest = passwordRegex.test(password);
        return passwordRegexTest
    }
    
    if(moveToLogin){
        return <Navigate to="/login" />
    }

return(
    <div className="resetpwd-page">
        <div className="resetpwd-container" id="forgot">
            <form onSubmit={handleSubmit}>
                <h2 className="reset-page-text">Re-Set Password</h2>
                <div className="resetpwd-input-box">
                <span className="icon" onClick={()=>setShowPassword(!showPassword)}>

                    <IonIcon icon={showPassword ? eyeOff : eye} />
                    </span>
                    <input type={showPassword ? "text" : "password"} required id="password" maxLength="16" value={password} onChange={handlePasswordChange} >
                    </input>
                    <label htmlFor="password">New Password</label>
                </div>
                <div className="resetpwd-input-box">
                    <span className="icon" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                    <IonIcon icon={showConfirmPassword ? eyeOff : eye} />
                    </span>
                    <input type={showConfirmPassword ? "text" : "password"} required id="password" maxLength="16" value={confirmPassword} onChange={handleConfirmPasswordChange} >
                    </input>
                    <label htmlFor="password">Confirm Password</label>                    
                </div>
                <button type="submit" className="button">Submit</button> 
                <div className="back_to_login">
                    <a onClick={()=>setMoveToLogin(true)}>Back to Login</a>
                </div>   
            </form>
        </div> 
    </div> 
)}

export default ResetPassword;