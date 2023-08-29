const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const validator = require("email-validator");
const path = require("path");
const multer = require("multer");
const { ObjectId } = require('mongodb');
const { isEmpty } = require('lodash');


const EmaraldBankCustomers = require("../schema/emaraldBankCustomers");
const EmaraldBankRegisterCustomers = require("../schema/emaraldBankRegisterCustomers");
const EmaraldBankUsers = require("../schema/emaraldBankUser");


const app = express();
app.use(cors());
app.use(express.json());
const getRegistrationData = []


const url = "mongodb://127.0.0.1:27017/ServerBank"; //'mongodb://keerthiAdmin:keerthana8104@127.0.0.1:27017/ServerBank?directConnection=true&serverSelectionTimeoutMS=2000&authSource=ServerBank&appName=mongosh+1.10.0'
dotenv.config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// MonogoDB connection
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("MongoDB connection is open!");
});

// Enctypt password
function encryptPassword(password, secretKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

// Decrypt password
function decryptPassword(encryptedPassword, secretKey) {
  const algorithm = "aes-256-cbc";
  const [ivString, encrypted] = encryptedPassword.split(":");
  const iv = Buffer.from(ivString, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// LoginPage for customer
const Loginpage = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email + password);

  try {
    db.collection("emaraldbankregistercustomers").findOne(
      { customer_email: email },
      (err, userData) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Error retrieving user data" });
          return;
        }

        console.log(userData);
        if (!userData) {
          res.status(404).json({ message: "Email Not Found" });
          return;
        } else if (userData) {
          console.log(userData);
          const getMobileno = userData.customer_mno;
          const getPasskey = userData.password;

          const secretKey = crypto
            .createHash("sha256")
            .update(getMobileno.toString())
            .digest("hex")
            .slice(0, 32);
          console.log("Line No 98:" + secretKey);
          const algorithm = "aes-256-cbc";
          const iv = crypto.randomBytes(16); // generate a random IV

          // Encrypt the password based on the password and mobileNo :
          // const encryptedPassword = encryptPassword(password, secretKey);
          // console.log(encryptedPassword); // example output: 'ac9d1f2b1a22bb4fde6d50c54b4dc852:35f6e632ea6e9c6d18f8c53a6b2f766c'

         
          // if (!getPasskey) {
          //   db.collection("emaraldbankregistercustomers").updateOne(
          //     { customer_email: email, customer_mno: getMobileno },
          //     { $set: { password: encryptedPassword } }
          //   );
          // }

          // console.log("After Update DB", getPasskey);

          // Decrypt the password based on the EncryptPassword and MobileNO :
          const receivedPassword = getPasskey;
          console.log(getPasskey)
          const plaintextPassword = decryptPassword(
            getPasskey,
            secretKey
          );
          console.log("Getting correct password", getPasskey)
          console.log(plaintextPassword); // example output: 'mypassword'

          const isMatch = plaintextPassword === password ? true : false;
          console.log(isMatch);

          if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
          } else if (!userData && !isMatch) {
            return res
              .status(401)
              .json({ message: "Invaild EmailId and Password" });
          }
          // If email and password are correct, send success response
          res.json({ message: "Login successful" });
        }
      }
    );
  } catch {
    (error) => console.log("Error connecting to MongoDB:", error.message);
  }
};
const backOfficeLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email)
  console.log(password)
  try {
    const isUserAlreadyExist = await EmaraldBankUsers.findOne({ User_email: email })
    console.log(isUserAlreadyExist)
    if (!isUserAlreadyExist) {
      res.status(404).json({ error: 'Email not Exists' })
    } else if (isUserAlreadyExist) {
      const getMobileno = isUserAlreadyExist.User_mobileNo;
      const getPasskey = isUserAlreadyExist.User_password;
      
      const secretKey = crypto
        .createHash("sha256")
        .update(getMobileno.toString())
        .digest("hex")
        .slice(0, 32);
      console.log("Line No 98:" + secretKey);

      // Encrypt the password based on the password and mobileNo :
      const encryptedPassword = encryptPassword(password, secretKey);
      
      if (!getPasskey || getPasskey === undefined) {
       const isUpdate = await EmaraldBankUsers.updateOne(
          { User_email: email, User_mobileNo: getMobileno },
          { $set: { User_password: encryptedPassword } }
        );
        return isUpdate
      }
      // const isPasskeyUpdated = await EmaraldBankUsers.findOne({ User_email: email })
      
      const receivedPassword = isUserAlreadyExist.User_password;
      console.log("After Update DB", receivedPassword);

      // Decrypt the password based on the EncryptPassword and MobileNO :

      console.log(receivedPassword)
      const plaintextPassword = decryptPassword(
        receivedPassword,
        secretKey
      );
      console.log("Getting correct password", getPasskey)
      console.log(plaintextPassword); // example output: 'mypassword'

      const isMatch = plaintextPassword === password ? true : false;
      console.log(isMatch);

      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      } else if (!isUserAlreadyExist && !isMatch) {
        return res
          .status(401)
          .json({ message: "Invaild EmailId and Password" });
      }
      // If email and password are correct, send success response
      res.json({ message: "Login successful" });
    }
  } catch (error) {
  res.status(500).send({ error: 'Internal Server Error' })
}
}

// In Registration Form, All received data is stored in collections Here
// OTP Generate in User Email
const otpGenerate = async (req, res) => {
  const { customerEmail, customerMno } = req.body;

  const generateCustomerId = () => {
    const min = 10000000000; // Minimum 11-digit number
    const max = 99999999999; // Maximum 11-digit number
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const customerID = generateCustomerId();

  const query = {
    customer_email: customerEmail,
    customer_mno: customerMno,
  };

  try {
    const user_otp = generateOTP();
    sendOTPEmail(customerEmail, user_otp);

    const isCustomerDataAlreadyExist =
      await EmaraldBankRegisterCustomers.findOne(query);
    console.log(isCustomerDataAlreadyExist);

    // Data is Storing In EmaraldBankRegisterCustomers Collection
    const newData = new EmaraldBankRegisterCustomers({
      customer_id: customerID,
      customer_email: customerEmail,
      customer_mno: customerMno,
      otp: user_otp,
    });

    if (!isCustomerDataAlreadyExist) {
      newData
        .save()
        .then(() => {
          res.status(200).json({ message: "Data stored Sucessfully" });
        })
        .catch((error) => {
          console.error("Error:", error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    }

    if (isCustomerDataAlreadyExist.registered_user === false) {
      await EmaraldBankRegisterCustomers.updateOne(query, {
        $set: { otp: user_otp, updatedAt: new Date() },
      });
      res.status(200).json({ message: "Not Registered Yet" });
    } else if (isCustomerDataAlreadyExist.registered_user === true) {
      res.status(400).json({ message: "Data is already exists" });
    }
  } catch {
    (error) => {
      console.log("Error:", error);
    };
  }
};

// Create a Transporter for sending email
const transporter = nodemailer.createTransport({
  host: "mail.kappmedia.com", // Replace with your SMTP server hostname
  port: 587,
  secure: false,
  auth: {
    user: "keerthana@kappsoft.com",
    pass: "KeerthiLalitha@123",
  },
});

// Generate a Random OTP
function generateOTP() {
  const digits = "1234567890";
  let OTP = "";
  for (let i = 0; i < 5; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  console.log(OTP);
  return OTP;
}

// Send OTP Email
function sendOTPEmail(email, otp, reasonText, data) {
  let subject = '', body = ''
  if (!validator.validate(email)) {
    console.log("Inside the validater");
    console.log("Invalid email address");
    return;
  }

  if(otp) {
    subject = "OTP Verification";
    body = `Your OTP: ${otp}`;
  }
  
  const firstName = data.customer_firstName
  let checkReasonText = reasonText === undefined
  console.log(checkReasonText)
  if(checkReasonText === true) {
    subject = "Account Verified Successfully"
    body = `Dear ${data.customer_firstName} ${data.customer_secondName},\n\nYour account has been successfully verified. Thank you for completing the verification process.\n\nBest regards,\nKeerthana\n`
  } else if(checkReasonText === false){
    subject = "Account Verification Rejected"
    body = `Dear ${data.customer_firstName} ${data.customer_secondName},\n\nYour account has been Rejected. Reason for Rejection: ${reasonText}.\n\nBest regards,\nKeerthana\n`
  }
  console.log(subject)
  console.log(body)
  const mailOptions = {
    from: "keerthana@kappsoft.com",
    to: email,
    subject: subject,//otp ? "OTP Verification" : checkReasonText ? "Account Verified Successfully":"Account Verification Rejected",
    text: body//otp ? `Your OTP: ${otp}` : checkReasonText ? 'Your Account ' : `Reason for Rejection: ${reasonText}`,
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.log("OTP email sent:" + info.response);
    }
  });
}

const verifiedotpupload = [];
// OTP Verification Page
const otpVerification = async (req, res) => {
  const { otp } = req.body;

  verifiedotpupload.push(otp);

  console.log(otp);
  try {
    let otpDoc = otp
      ? await EmaraldBankRegisterCustomers.findOne({ otp: otp })
      : "";
    let forgotOtpDoc = otp ? await EmaraldBankRegisterCustomers.findOne({ forgotPassword_otp: otp }) : ''
    console.log("otpDoc", otpDoc);
    const isOtp = !isEmpty(otpDoc) ? true : false;
    const isForgotOtpDocAvl = !isEmpty(forgotOtpDoc) ? true : false;
    console.log("isOtp", isOtp);
    if (!otpDoc && !isForgotOtpDocAvl) {
      res.status(400).json({ message: "Invalid OTP" });
    } else if ((isOtp && otpDoc.otp === otp) || (isForgotOtpDocAvl && forgotOtpDoc.forgotPassword_otp === otp)) {
      res.status(200).json({ message: "Valid OTP" });
    }
    console.log(isForgotOtpDocAvl)
    if (isOtp || isForgotOtpDocAvl) {
      const currentTimestamp = new Date();
      const updatedAtTimestamp = otpDoc ? otpDoc.updatedAt : forgotOtpDoc.updatedAt;
      const expirationThreshold = new Date(
        updatedAtTimestamp.getTime() + 3 * 60 * 1000
      );
      console.log(expirationThreshold);
      if (currentTimestamp > expirationThreshold) {
        res.status(400).json({ message: "OTP expired" });
      } else {
        res.status(200).json({ message: "OTP verified" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  Password generate For Registration Customer
const passwordGenerate = async (req, res) => {

  const { otp, password } = req.body;
  try {
    const findOtp = await EmaraldBankRegisterCustomers.findOne({$or:[{otp: otp}, {forgotPassword_otp: otp}] })
    const mobileNo = findOtp.customer_mno
    // const isRegisteredUser = findOtp.registered_user
    // console.log(isRegisteredUser)
    // getRegistrationData.push(findOtp)


    const secretKey = crypto.createHash('sha256').update(mobileNo.toString()).digest('hex').slice(0, 32);
    console.log("Line No 252:" + secretKey);
    const encryptedPassword = encryptPassword(password, secretKey);
    console.log(encryptedPassword);
    if (encryptedPassword)
      await EmaraldBankRegisterCustomers.updateOne(
        { customer_mno: mobileNo },
        { $set: { password: encryptedPassword, registered_user: true } }
      );
    res.status(200).json({ message: "Password Generated Successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// check already exist registered customer
const checkRegistrationCustomer = async (req, res) => {
  const { customerEmail, customerMno } = req.body;
  let isEmailExistInUser = null; // Initial value of the variable
  try {
    const isExistEmail = await EmaraldBankRegisterCustomers.findOne({
      customer_email: customerEmail,
    });
    const isExistMno = await EmaraldBankRegisterCustomers.findOne({
      customer_mno: customerMno,
    });
    await db
      .collection("emaraldbankregistercustomers")
      .findOne(
        { customer_email: customerEmail, customer_mno: customerMno },
        (err, userData) => {
          if (err) {
            console.log(err);
          } else if (userData) {
            console.log(userData);
            isEmailExistInUser = userData;
          }
        }
      );

    if (!isExistEmail && !isExistMno) {
      res.status(200).json({ message: "Not Exist" });
      res.end();
    } else if (isExistEmail && isExistMno) {
      if (isEmailExistInUser) {
        res.status(400).json({ error: "EmailId Already Exist" });
        res.end();
      } else if (
        isExistEmail.registered_user === false &&
        isExistMno.registered_user === false
      ) {
        res
          .status(200)
          .json({ message: "This Customer is not registered yet" });
      } else {
        res.status(400).json({ error: "EmailId and MobileNo Already Exist" });
      }
      res.end();
    } else if (isExistEmail) {
      res.status(400).json({ error: "EmailId Already Exist" });
      res.end();
    } else if (isExistMno) {
      res.status(400).json({ error: "MobileNo Already Exist" });
      res.end();
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
    res.end();
  }
 
};

// Create the customer in DB
const updateCustomer = async (req, res) => {
  
  const { customerId } = req.params;
  const { isUpdatecustomerName, isUpdatecustomerEmail, isUpdatecustomerMno } =
    req.body;
  const updatedData = req.body.editData;
  const { _id, customer_name, customer_email, customer_mno } = updatedData;

  try {
    await EmaraldBankCustomers.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          customer_name: isUpdatecustomerName
            ? isUpdatecustomerName
            : customer_name,
          customer_email: isUpdatecustomerEmail
            ? isUpdatecustomerEmail
            : customer_email,
          customer_mno: isUpdatecustomerMno
            ? isUpdatecustomerMno
            : customer_mno,
        },
      }
    );
    res.status(200).json({ message: "Record Successfully Updated" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkCustomer = async (req, res) => {

  const errors = {};
  const customer_id = parseInt(req.body.customerId);
  const customer_name = req.body.customerName;
  const customer_email = req.body.customerEmail;
  const customer_mno = parseInt(req.body.customerMno);
  const editCustomerEmail = req.body.isUpdatecustomerEmail;
  const editCustomerMno = parseInt(req.body.isUpdatecustomerMno);
  const updatedData = req.body.editData;

  try {
    if (customer_id) {
      const existingCustomer = await EmaraldBankCustomers.findOne({
        customer_id,
      });
      if (existingCustomer) {
        errors.customer_id = "Id already exists";
      }
    }

    if (customer_email) {
      const existingCustomer = await EmaraldBankCustomers.findOne({
        customer_email,
      });
      if (existingCustomer) {
        errors.customer_email = "Email already exists";
      }
    }

    if (customer_mno) {
      const existingCustomer = await EmaraldBankCustomers.findOne({
        customer_mno,
      });
      if (existingCustomer) {
        errors.customer_mno = "Mobile number already exists";
      }
    }

    if (editCustomerEmail) {
      const existingCustomer = await EmaraldBankCustomers.findOne({
        customer_email: editCustomerEmail,
      });
      console.log("Line 179", existingCustomer);
      const isSameEmail = await EmaraldBankCustomers.findOne({
        customer_email: updatedData.customer_email,
      });
      console.log("Line 181", isSameEmail);
      if (
        existingCustomer &&
        editCustomerEmail !== isSameEmail.customer_email
      ) {
        errors.customer_email = "Email already exists";
      }
    }

    if (editCustomerMno) {
      const existingCustomer = await EmaraldBankCustomers.findOne({
        customer_mno: editCustomerMno,
      });
      console.log(existingCustomer);
      const isSameMno = await EmaraldBankCustomers.findOne({
        customer_mno: updatedData.customer_mno,
      });
      if (existingCustomer && editCustomerMno !== isSameMno.customer_mno) {
        errors.customer_mno = "Mobile number already exists";
      }
    }

    if (Object.keys(errors).length > 0) {
      // At least one field already exists, send error response
      return res.status(400).json({ errors });
    }

    // No field exists, send success response
    res.status(200).json({ message: "No existing customer found" });
  } catch (error) {
    // Error occurred while querying the database
    res.status(500).json({ error: "Internal server error" });
  }
};

const createCustomer = async (req, res) => {

  const { customerId, customerEmail, customerName, customerMno } = req.body;

  const newData = new EmaraldBankCustomers({
    customer_id: customerId,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_mno: customerMno,
  });

  // Save the data to the database
  newData
    .save()
    .then(() => {
      res.status(200).json({ message: "Data stored successfully" });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Get the data from Db and display in UI
const getData = async (req, res) => {

  try {
    const cursor = await db.collection("emaraldbankcustomers").find();
    const data = await cursor.toArray();
    res.json(data);
    // console.log(data)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Get the data from Db and display in UI
const getKycData = async (req, res) => {

  try {
    const cursor = await db.collection("emaraldbankregistercustomers").find();
    const data = await cursor.toArray();
    res.json(data);
    // console.log(data)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const newCustomer = async (req, res) => {

  const cursor = await db.collection("emaraldbankcustomers").find();
  const data = await cursor.toArray();
  res.json(data);
  console.log(data);

  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const storeKycDetails = async (req, res) => {

  const { firstName, secondName, dob, gender, address1, address2, country, email, phone, documentType } = req.body;

  try {
    const customer = await EmaraldBankRegisterCustomers.find({ customer_email: email, customer_mno: phone });
    console.log(customer)
    if (!customer) {
      console.log('Customer not found');
      return;
    }

    if (customer) await EmaraldBankRegisterCustomers.updateOne(
      {
        customer_email: email,
        customer_mno: phone
      },
      {
        $set:
        {
          customer_firstName: firstName,
          customer_secondName: secondName,
          customer_dob: dob,
          customer_gender: gender,
          customer_addressLine1: address1,
          customer_addressLine2: address2,
          customer_country: country,
          customer_documentType: documentType
        }
      }
    )

    res.status(200).json({ message: "Records & Files Stored Successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  // limits: { fileSize: 5 * 1024 * 1024 }, // Set the limit to 5 MB
});

const uploadMultiple = upload.fields([
  { name: "file1", maxCount: 1 },
  { name: "file2", maxCount: 10 },
  { name: "file3", maxCount: 10 },
  { name: "file4", maxCount: 10},
  { name: "file5", maxCount: 10},

]);

const uploadFiles = async (req, res) => {
  // upload.single('file')(req, res, async (err) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.error("Error uploading fdsfcdile:", err);
      return res.status(500).json({ error: "Error uploadingsdsdsds file" });
    }

    try {
      console.log(req.files);
      const file = req.files;
      const files = Object.values(file).flatMap((arr) => arr);
      const filenames = files.map((file) => file.filename);

      console.log(filenames);
      const { email } = req.body
      console.log(verifiedotpupload)

      // Add your logic to handle the uploaded file here
      // For example, you can save the file to a database, process it, etc.

      // const { filename } = files;  // single file
      // console.log(filename);  //single file

      // Assuming you have a collection called 'yourCollection' and want to update 'fieldName' with the uploaded filename
      const filter = { customer_email: email };
      const update = { $set: { fieldName: filenames.join(", ") } };


      await EmaraldBankRegisterCustomers.updateOne(filter, update);

      res.json({ message: "File uploaded successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Error handling file upload" });
    }
  });
};

const forgotPasswordOtpSent = async (req, res) => {
  const { email } = req.body;

  try {
    console.log(email)
    const customer = await EmaraldBankRegisterCustomers.find({ customer_email: email })
    if (isEmpty(customer)) {
      res.status(404).json({ error: 'Email Not Registered Yet. Please Sign Up' })
    } else if (!isEmpty(customer)) {
      const user_otp = generateOTP();
      sendOTPEmail(email, user_otp);
      await EmaraldBankRegisterCustomers.updateOne({ customer_email: email }, {
        $set: { forgotPassword_otp: user_otp, updatedAt: new Date() },
      });
      res.status(200).json({ message: "OTP Sent Successfully!" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

const resetPassword = async (req, res) => {
  const { password, email } = req.body;
  try {
    const gotData = await EmaraldBankRegisterCustomers.findOne({ customer_email: email })
    console.log(gotData)
    const mobileNo = gotData.customer_mno

    const secretKey = crypto.createHash('sha256').update(mobileNo.toString()).digest('hex').slice(0, 32);
    console.log("Line No 676:" + secretKey);
    const encryptedPassword = encryptPassword(password, secretKey);
    console.log(encryptedPassword);
    if (encryptedPassword)
      await EmaraldBankRegisterCustomers.updateOne(
        { customer_mno: mobileNo, customer_email: email },
        { $set: { password: encryptedPassword } }
      );
    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' })
  }
}

// getting the mobile numer for KYC Page
const getMobileNo = async (req, res) => {
  const { email } = req.body
  console.log(email);
  try {
    const data = await db.collection("emaraldbankregistercustomers").findOne({customer_email: email});

    const mobileNo = data.customer_mno 
    res.json(mobileNo);
    // console.log(data)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const updateVerifyStatus = async(req, res) => {
  console.log(req.body)
  const { customerId, status, reasonText, email} = req.body
  
  try{
    const data = await EmaraldBankRegisterCustomers.findOne({customer_id: customerId})

    sendOTPEmail(email, "", reasonText, data);
    
    await EmaraldBankRegisterCustomers.updateOne(
      {
        customer_id: customerId
      }, {
        $set: {
          status: status,
          reason: reasonText ? reasonText : null
        }
      }
    ) 
    
    const getStatus = data.status 
    res.status(200).json({ message: 'Status Verified', getStatus});
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong'});
  }
}
module.exports = {
  Loginpage,
  getData,
  getKycData,
  newCustomer,
  createCustomer,
  checkCustomer,
  updateCustomer,
  otpGenerate,
  otpVerification,
  passwordGenerate,
  checkRegistrationCustomer,
  storeKycDetails,
  uploadFiles,
  forgotPasswordOtpSent,
  resetPassword,
  backOfficeLogin,
  getMobileNo,
  updateVerifyStatus
};
