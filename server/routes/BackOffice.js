const express = require('express'); //import express

const router  = express.Router(); 

const Controller = require('../controller/BackOffice'); 

router.post('/api/login', Controller.Loginpage); 
router.post('/backOfficeLogin', Controller.backOfficeLogin)
router.get("/getData", Controller.getData);
router.post("/store-customer", Controller.createCustomer);
router.post("/check-customer", Controller.checkCustomer)
router.post('/newUser', Controller.newCustomer);
router.put('/update-data/:customerId', Controller.updateCustomer);
router.post('/otp-generate', Controller.otpGenerate);
router.post('/otp-verification', Controller.otpVerification);
router.post('/password-validation', Controller.passwordGenerate);
router.post('/checkRegistrationCustomer', Controller.checkRegistrationCustomer);
router.post('/upload-file', Controller.uploadFiles)
router.post('/storeKycDetails', Controller.storeKycDetails);
router.post('/forgotPasswordOtpSend', Controller.forgotPasswordOtpSent);
router.post('/resetPassword', Controller.resetPassword)
router.get('/getKycData', Controller.getKycData)
router.post('/getMobileNo', Controller.getMobileNo);
router.post("/updateStatus", Controller.updateVerifyStatus);


module.exports = router;