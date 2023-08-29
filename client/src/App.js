import './App.css';
import Login from './pages/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import ListOfEmail from './pages/ListOfEmail';
import CreateCustomer from './pages/CreateCustomer'
import RegistrationForm from './pages/Registration';
import OtpPage from './pages/OtpPage';
import PasswordPage from './pages/PasswordPage';
import ForgotPasswordForm from './pages/ForgotPassword';
import KYC from './pages/KYC';
import ForgotPasswordOtpForm from './pages/ForgotPasswordOtpPage';
import ResetPassword from './pages/ResetPassword'
import BackOfficeLogin from './pages/BackOfficeLogin';
import KycVerification from './pages/KycVerification';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path='/backOffice' element={<BackOfficeLogin />} />
        <Route path="/dashBoard" element={<Dashboard />} />
        <Route path="/all-data" element={<ListOfEmail />} />
        <Route path="/createCustomer" element={<CreateCustomer />} />
        <Route path='/registerPage' element={<RegistrationForm />} />
        <Route path='/otpVerification' element={<OtpPage />} />
        <Route path='/password' element={<PasswordPage />} />
        <Route path='/forgotPassword' element={<ForgotPasswordForm />} />
        <Route path='/kyc' element={<KYC />} />
        <Route path='/forgotPasswordOtpForm' element={<ForgotPasswordOtpForm />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
        <Route path='/kycVerification' element={<KycVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
