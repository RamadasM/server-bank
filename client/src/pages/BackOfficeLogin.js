import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import '../assets/login.css';
import { IonIcon } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";

function BackOfficeLogin () {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [MovetoDashboard, setMoveToDashboard] = useState(false);
    const [data, setData] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
  
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    }
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    }
  
    const handleShowPasswordChange = (event) => {
      setShowPassword(!showPassword);
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      axios.post('http://localhost:5002/backOfficeLogin', { email, password })
        .then(response => {
          console.log(response.data);
          setData(response)
          console.log(data)
          setErrorMessage('');
          if (response.status === 200) {
            setSuccessMessage('Login successful');
            setMoveToDashboard(true)
          } else {
            setSuccessMessage('');
          }
        }).catch(error => {
          console.error(error.response.data);
          setErrorMessage(error.response.data.message);
          setSuccessMessage('');
        });
    }
  
    if (MovetoDashboard && successMessage) {
      return <Navigate to="/dashBoard" />
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
              <input type={showPassword ? "text" : "password"} required id="password" maxLength="16" value={password} onChange={handlePasswordChange} >
              </input>
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit">Log In</button><br /><br />
            <div className="forgot">
              {/* <a onClick={() => setRegistration(true)}>New User ? Sign up</a> */}
              <a>Forgot Password?</a>
            </div> <br />
            {errorMessage && <div className="error">{errorMessage}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
          </form>
        </div>
        {/* For Icons  */}
        {/* <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
          <script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script> */}
      </div>
    );
}

export default BackOfficeLogin;