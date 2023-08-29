import React, { useState } from "react";
import { Navigate, useAsyncError } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";

import '../assets/login.css'

function PasswordPage(props) {
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('')
  const [error, setError] = useState('');
  const [moveToLogin, setMoveToLogin] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false)

  const otp = localStorage.getItem("OTP")

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleReEnterPasswordChange = (event) => {
    setReEnterPassword(event.target.value);
  }

  const handleShowPasswordChange = (event) => {
    setShowPassword((showPassword) => !showPassword)
  }

  const handleShowReEnterPasswordChange = (event) => {
    setShowReEnterPassword((showReEnterPassword) => !showReEnterPassword);
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validatePassword(password)) {
      if (password !== reEnterPassword) {
        alert("Password do not match. Please re-enter your password")
      } else {
        // Password is valid
        const response = await fetch(`http://localhost:5002/password-validation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp, password })
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

  if (moveToLogin) {
    return <Navigate to="/login" />
  }
  return (
    <div className="login-page">
      <div className="logincontainer" id="login">
        <form onSubmit={handleSubmit}>
          <h2 className="login-page-text">Set Password</h2>
          <div className="input-box">
            <span className="icon" onClick={handleShowPasswordChange}>
              <IonIcon icon={showPassword ? eyeOff : eye} />
            </span>
            <input type={showPassword ? "text" : "password"} required minLength={8} value={password} maxLength={16}
              onChange={handlePasswordChange}
            />
            <label htmlFor="password">Enter Password</label>
          </div>
          <div className="input-box">
            <span className="icon" onClick={handleShowReEnterPasswordChange}>
              <IonIcon icon={showReEnterPassword ? eyeOff : eye} />
            </span>
            <input type={showReEnterPassword ? "text" : "password"} required minLength={8} value={reEnterPassword} maxLength={16}
              onChange={handleReEnterPasswordChange}
            />
            <label htmlFor="password">Re-Enter Password</label>
          </div>
          <button type="submit">Generate Password</button><br /><br />
        </form>
      </div>
    </div>
  )

}

export default PasswordPage;