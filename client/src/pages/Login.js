import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import '../assets/login.css';
import { IonIcon } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";


function LoginForm() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [gotoMenu, setGotoMenu] = useState(false);
  const [moveToKyc, setMoveToKyc] = useState(false);
  const [forgotPasswordPage, setForgotPasswordPage] = useState(false);
  const [data, setData] = useState();
  const [registration, setRegistration] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorMessage('')
  }

  const handleShowPasswordChange = (event) => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:5002/api/login', { email, password })
      .then(response => {
        // console.log(response.data);
        setData(response)
        console.log(data)
        setErrorMessage('');
        if (response.status === 200) {
          setSuccessMessage('Login successful');
          setMoveToKyc(true)
        } else {
          setSuccessMessage('');
        }
      }).catch(error => {
        console.error(error.response.data);
        setErrorMessage(error.response.data.message);
        setSuccessMessage('');
      });
  }

  // if (gotoMenu && successMessage) {
  //   return <Navigate to="/dashBoard" />
  // } 
  if (moveToKyc) {
    return <Navigate to="/kyc" state={{email}}/>
  } if (registration) {
    return <Navigate to="/registerPage" />
  } if (forgotPasswordPage) {
    return <Navigate to="/forgotPassword" />
  }

  return (
    <div className="login-page">
      <div className="logincontainer" id="login">
        <form onSubmit={handleSubmit}>
          <h2 className="login-page-text">Login</h2>
          <div className="input-box">
            <span className="icon"><ion-icon name="mail"></ion-icon></span>
            <input className="input-text" type="email" required id="email" onChange={handleEmailChange} />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-box">

            <span className="icon" onClick={handleShowPasswordChange}>

              <IonIcon icon={showPassword ? eyeOff : eye} />
            </span>
            <input type={showPassword ? "text" : "password"} required id="password" value={password} onChange={handlePasswordChange} >
            </input>
            <label htmlFor="password">Password</label>
          </div>
          {errorMessage && <div className="error">{errorMessage}</div>}
          {successMessage && <div className="success">{successMessage}</div>}        
          <button type="submit">Log In</button><br /><br />
          <div className="forgot">
            {/* <a onClick={() => setRegistration(true)}>New User ? Sign up</a> */}
            <a onClick={() => setForgotPasswordPage(true)}>Forgot Password?</a>
          </div><br />
          <div className="newuser">
            <span>Don't have an account <a onClick={() => setRegistration(true)}> Sign up</a></span>
            {/* <a onClick={() => setForgotPasswordPage(true)}>Forgot Password?</a> */}
          </div>
        </form>
      </div>
      {/* For Icons  */}
      {/* <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
        <script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script> */}
    </div>
  );
}

export default LoginForm;
