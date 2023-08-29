import React, { useEffect, useState, useRef, useMemo } from "react";
import Webcam from "webcamjs";
import { useLocation } from "react-router-dom";
import countryList from "react-select-country-list";
import Select from "react-select";

import "../assets/kyc.css";
import addImage from "../assets/images/add-image.png";
import addImages from "../assets/images/add-images.png";
import addImaging from "../assets/images/add-images.png";
import personalImage from "../assets/images/icons8-personal-64.png";
import contactImage from "../assets/images/contact-list.png";
import DocumentImage from "../assets/images/document.png";
import PersonImage from "../assets/images/Person.png";
import Star from "../assets/images/star.png";

const KYC = () => {
  const [webcamOn, setWebcamOn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [dob, setDob] = useState(0);
  const [gender, setGender] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [dbData, setDbData] = useState([]);
  const [country, setCountry] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [pancardDocument, setPancardDocument] = useState("");

  const [error, setError] = useState();
  const [phone, setPhone] = useState('');
  const options = useMemo(() => countryList().getData(), [])

  const location = useLocation();
  const email = location.state?.email;
  
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [allFieldsFilled1, setAllFieldsFilled1] = useState(false);
  const [allFieldsFilled2, setAllFieldsFilled2] = useState(false);

  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [file4, setFile4] = useState(null);
  const [file5, setFile5] = useState(null);

  const [file2Preview, setFile2Preview] = useState(PersonImage);
  const [file3Preview, setFile3Preview] = useState(addImaging);
  const [file4Preview, setFile4Preview] = useState(addImages);
  const [file5Preview, setFile5Preview] = useState(addImage);

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleSecondName = (event) => {
    setSecondName(event.target.value);
  };

  const handleDob = (event) => {
    setDob(event.target.value);
  };

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const handleDocumentType = (event) => {
    setDocumentType(event.target.value);
  };

  const handlePancardDocument = (event) =>{
    setPancardDocument(event.target.value);
  }

  const handleAddress1 = (event) => {
    setAddress1(event.target.value);
  };
  const handleAddress2 = (event) => {
    setAddress2(event.target.value);
  };

  const handleCountry = (event) => {
    const selectedValue = event.value
    setCountry(selectedValue);
  }

  const getMobileNo = async () => {
    try{
      const response = await fetch(`http://localhost:5002/getMobileNo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json(); 
    console.log("data", data)
    if (response.status === 200) {
      setPhone(data)
    } 
    }catch(error){
      console.log(error)
    }
    
  }

  const checkAllFieldsFilled = () => {
    if (firstName && secondName && dob && gender) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  };

  useEffect(() => {
    checkAllFieldsFilled();
  }, [firstName, secondName, dob, gender]);

  const handleClickNextButton = () => {
    if (allFieldsFilled) {
      // Proceed with the next step or action here
      checkAllFieldsFilled();
    } else {
      // Display an error message or prevent further action if fields are not filled
      window.alert("Please fill all fields before proceeding.");
    }
  };

  const checkAllFieldsFilled2 = () => {
    if (phone && email && address1) {
      setAllFieldsFilled1(true);
    } else {
      setAllFieldsFilled1(false);
    }
  };

  const checkAllFieldsFilled3 = () => {
    if (country && documentType) {
      setAllFieldsFilled2(true);
    } else {
      setAllFieldsFilled2(false);
    }
  };

  useEffect(() => {
    checkAllFieldsFilled2();
    checkAllFieldsFilled3();
  }, [phone, email, address1, country, documentType]);

  const handleClickNextButton2 = () => {
    if (allFieldsFilled1) {
      // Proceed with the next step or action here
      console.log("All fields are filled. Proceeding...");
    } else {
      // Display an error message or prevent further action if fields are not filled
      console.log("Please fill all fields before proceeding.");
    }
  };

  const handleFile1Change = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile1(selectedFile);
    }
  };

  const handleFile2Change = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile2(selectedFile);
      setFile2Preview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFile3Change = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile3(selectedFile);
      setFile3Preview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFile4Change = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile4(selectedFile);
      setFile4Preview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFile5Change = (e) =>{
    const selectedFile = e.target.files[0];
    if(selectedFile) {
      setFile5(selectedFile);
      setFile5Preview(URL.createObjectURL(selectedFile));
    }
  };
  // WebCam Attached
  useEffect(() => {
    Webcam.set({
      width: 150,
      height: 100,
      image_format: "jpeg",
      jpeg_quality: 90,
    });

    if (webcamOn) {
      Webcam.attach("#camera");
    } else {
      Webcam.reset();
    }

    return () => {
      Webcam.reset();
    };
  }, [webcamOn]);

  const handleWebcamOff = () => {
    // Detach the webcam from the 'camera' element
    setWebcamOn(false);
  };

  const takeSnap = () => {
    Webcam.snap(function (data_uri) {
      // Store the captured image data in state
      setFile1(data_uri);
      document.getElementById("results").innerHTML =
        '<img src="' + data_uri + '"/>';
    });
  };

  // Coverting Base64Url to Blog
  const dataURItoBlob = (dataURI) => {
    console.log(dataURI);
    if (!dataURI) return null; // Add a check for null or undefined dataURI
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const uploadFile = async (event) => {
    if ((file1 || file2) && file3 && file4 && file5) {
      const formData = new FormData();

      //selected fiels
      if (file1) {
        const imageDataBlob = dataURItoBlob(file1);
        formData.append("file1", imageDataBlob, "file1.jpeg");
        console.log(imageDataBlob, "manoj kumar ");
      }

      if (file2) {
        formData.append("file2", file2);
      }

      formData.append("file2", file2);
      formData.append("file3", file3);
      formData.append("file4", file4);
      formData.append("file5", file5);
      formData.append("email", email)

      fetch("http://localhost:5002/upload-file", {
        method: "POST",
        body: formData, ...email
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          console.log("File uploaded successfully:", data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  //Storing the Customer Details in database
  const storeKycDetails = async () => {

    try {
      const response = await fetch("http://localhost:5002/storeKycDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          secondName,
          dob,
          gender,
          address1,
          address2,
          country,
          email,
          phone,
          documentType,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        //alert(data.message);
        // window.location.reload(true)
      } else {
        alert(data.error);
      }
    } catch {
      console.log("Error:", error);

    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await storeKycDetails();
    await uploadFile();
  };

  useEffect(() => {
    var field1 = document.getElementById("field1");
    var field2 = document.getElementById("field2");
    var field3 = document.getElementById("field3");

    var next1 = document.getElementById("next1");
    var next2 = document.getElementById("next2");

    var back1 = document.getElementById("back1");
    var back2 = document.getElementById("back2");

    var bar = document.getElementById("li2");
    var bar3 = document.getElementById("li3");
    var fileupload = document.getElementById("file-upload");
    var btn = document.getElementById("btns");
    var imag = document.getElementById("img");
    var close = document.getElementById("close");
    var takephoto = document.getElementById("take-photo");
    var camera = document.getElementById("takephoto");
    var cameraClose = document.getElementById("camera-close");
    var photoUpload = document.getElementById("photo-upload-btn");
    var photoClose = document.getElementById("photo-upload-close");
    var img2 = document.getElementById("img-2");
    var uploadtick = document.getElementById("upload-tick");
    var takephotoTick = document.getElementById("takephoto-upload-tick");
    var imageuploadTick = document.getElementById("image-upload-tick");

    const next1HandleClick = () => {
      field1.style.display = "none";
      field2.style.display = "block";
      bar.classList.add("active");
    };

    const back1HandleClick = () => {
      field2.style.display = "none";
      field1.style.display = "block";
      bar.classList.remove("active");
    };

    const next2HandleClick = () => {
      field2.style.display = "none";
      field3.style.display = "block";
      bar.classList.add("active");
      bar3.classList.add("active");
    };

    const back2HandleClick = () => {
      field3.style.display = "none";
      field2.style.display = "block";
      bar3.classList.remove("active");
    };

    fileupload.onclick = function () {
      btn.style.display = "none";
      imag.style.display = "block";
    };

    close.onclick = function () {
      imag.style.display = "none";
      btn.style.display = "block";
      fileupload.style.borderBottom = "none";
    };

    takephoto.onclick = function () {
      btn.style.display = "none";
      camera.style.display = "block";
    };

    cameraClose.onclick = function () {
      camera.style.display = "none";
      btn.style.display = "block";
      takephoto.style.borderBottom = "none";
    };
    photoClose.onclick = function () {
      img2.style.display = "none";
      btn.style.display = "block";
      photoUpload.style.borderBottom = "none";
    };

    photoUpload.onclick = function () {
      img2.style.display = "block";
      btn.style.display = "none";
    };

    uploadtick.onclick = function () {
      img2.style.display = "none";
      btn.style.display = "block";
      photoUpload.style.borderBottom = "3px solid #007130";
    };

    takephotoTick.onclick = function () {
      camera.style.display = "none";
      btn.style.display = "block";
      takephoto.style.borderBottom = "3px solid #007130";
    };

    imageuploadTick.onclick = function () {
      imag.style.display = "none";
      btn.style.display = "block";
      fileupload.style.borderBottom = "3px solid #007130";
    };

    return () => {

      getMobileNo();

      if (next1) {
        next1.addEventListener("click", next1HandleClick);
      }

      if (back1) {
        back1.addEventListener("click", back1HandleClick);
      }

      if (next2) {
        next2.addEventListener("click", next2HandleClick);
      }

      if (back2) {
        back2.addEventListener("click", back2HandleClick);
      }
    };
  }, []);

  return (
    <div className="container">
      <form onSubmit={handleSubmit} id="msform">
        {/* Multistep buttons */}
        <ul id="progressbar">
          <li className="active">Personal Details</li>
          <li id="li2">Contact Details</li>
          <li id="li3">File Upload</li>
        </ul>
        {/* fieldsets */}
        <fieldset className="personal-details" id="field1">
          <h2 className="fs-title">Personal Details</h2>
          <h3 className="fs-subtitle">
            <img src={personalImage} width="30px" alt="" />
          </h3>
          <label htmlFor="firstname" className="required">
            First Name
          </label>

          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            onChange={handleFirstName}
            value={firstName}
          />
          <label htmlFor="lasttname" className="required">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            onChange={handleSecondName}
            value={secondName}
          />
          <label htmlFor="dob" className="required">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            placeholder="DateofBirth"
            onChange={handleDob}
            value={dob}
          />
          <label htmlFor="gender" className="required">
            Gender
          </label>
          <select
            name="Gender"
            id="gender"
            value={gender}
            onChange={handleGender}
          >
            <option value="">Select your Gender...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
          <br />
          <input
            type="button"
            name="next"
            id="next1"
            className="next-button"
            value="Next"
            onClick={handleClickNextButton}
            // Disable the button if all fields are not filled
            disabled={!allFieldsFilled}
          />
        </fieldset>
        <fieldset className="contact-details" id="field2">
          <h2 className="fs-title">Contact Details</h2>
          <h3 className="fs-subtitle">
            <img src={contactImage} width="30px" alt="" />
          </h3>

          <label htmlFor="email" className="required">
            Email
          </label>
          <input type="email" name="email" placeholder="Email" value={email} />
          <label htmlFor="phone" className="required">
            Phone
          </label>
          <input type="text" name="phone" placeholder="Phone" value={phone} />
          <label htmlFor="dob" className="required">
            Address Line 1
          </label>
          <input
            type="text"
            name="address1"
            placeholder="Door.No / Street"
            onChange={handleAddress1}
            value={address1}
          />
          <label htmlFor="dob">Address Line 2</label>
          <input
            type="text"
            name="address1"
            placeholder="City / State"
            onChange={handleAddress2}
            value={address2}
          />
          <input
            type="button"
            name="previous"
            id="back1"
            className="previous-button"
            value="Previous"
          />
          <input
            type="button"
            name="next"
            id="next2"
            className="next-button"
            value="Next"
            onClick={handleClickNextButton2}
            disabled={!allFieldsFilled1}
          />
        </fieldset>
        <fieldset className="file-upload" id="field3">
          <h2 className="fs-title">File Upload</h2>
          <h3 className="fs-subtitle">
            <img src={DocumentImage} width="30px" alt="" />
          </h3>
          <label htmlFor="country" className="drop-down">
            Your Country
          </label>
          <Select className="country" id="country" placeholder="Select your country..." name="country" options={options} onChange={handleCountry} />
          <label htmlFor="doctype" className="drop-down">
            Document Type
          </label>
          <select
            name="doctype"
            id="doctype"
            value={documentType}
            onChange={handleDocumentType}
          >
            <option value="">Select your Document...</option>
            <option value="Aadharcard">Aadharcard</option>
            <option value="Driving License">Driving License</option>
            <option value="Passport">Passport</option>
            <option value="Voter ID">Voter ID</option>
          </select>

          <div class="file-upload-btns" id="btns">
            <div class="take">
              <input
                type="button"
                name="takephoto"
                id="take-photo"
                class="takephoto-button"
                value="Camera"
                onClick={() => setWebcamOn(true)}
              />
              <p>Or</p>
              <input
                type="button"
                name="takephoto"
                id="photo-upload-btn"
                class="photo-upload-btn"
                value="Photo Upload"
              />
            </div>
            <div>
              <input
                type="button"
                name="fileupload"
                id="file-upload"
                class="fileupload-button"
                value="Documents Upload"
              />
            </div>
          </div>

          {/* photo upload format */}
          <div class="img-2" id="img-2">
            <button
              type="button"
              class="photo-upload-close"
              id="photo-upload-close"
            >
              X
            </button>

            <div class="photo-upload">
              <div class="image">
                <img src={file2Preview} height="80" alt="Preview" />
                {file2Preview !== PersonImage}
              </div>
              <div>
                <p>You can also upload images</p>
                <input
                  type="file"
                  onChange={handleFile2Change}
                  id="input-front"
                />
              </div>
            </div>
            <button type="button" class="upload-tick" id="upload-tick">
              ✓
            </button>
          </div>

          {/* webcam  pics upload */}
          <div id="takephoto">
            <button type="button" className="camera-close" id="camera-close">
              X
            </button>
            <div className="camera" id="camera"></div>
            <p>Take a picture and Upload</p>
            <input
              type="button"
              value="Take Snapshot"
              id="snap"
              onClick={takeSnap}
              onChange={handleFile1Change}
            />

            <div id="results"></div>
            <button
              type="button"
              className="takephoto-upload-tick"
              id="takephoto-upload-tick"
            >
              ✓
            </button>
          </div>

          {/* front end image */}
          <div class="img" id="img">
            <button type="button" class="close" id="close">
              X
            </button>
            <div class="image-preview-front">
              <div class="image">
                <img src={file5Preview} height="80" alt="Preview" />
                {file5Preview !== addImage}
              </div>
              <div>
              <p>Pancard Front-side of the Document</p>
              <input type="file" onChange={handleFile5Change} id="input-front" />
          

              </div>
            </div>

            <div class="image-preview-front">
              <div class="image">
                <img src={file3Preview} height="80" alt="Preview" />
                {file3Preview !== addImages}
              </div>
              <div>
                <p>Front-side of the Document</p>
                <input
                  type="file"
                  onChange={handleFile3Change}
                  id="input-front"
                />
              </div>
            </div>

            {/* backend image */}
            <div class="image-preview-back">
              <div class="image">
                <img src={file4Preview} height="80" alt="Preview" />
                {file4Preview !== addImaging}
              </div>
              <div>
                <p>Back-side of the Document</p>
                <input
                  type="file"
                  onChange={handleFile4Change}
                  id="input-back"
                />
              </div>
            </div>

            <button
              type="button"
              class="image-upload-tick"
              id="image-upload-tick"
            >
              ✓
            </button>
          </div>

          {/* Submit and Previous Button  */}
          <div>
            <input
              type="button"
              name="previous"
              id="back2"
              class="previous-button"
              value="Previous"
            />
            <input
              type="submit"
              name="submit"
              class="submit-button"
              value="Submit"
              onClick={handleWebcamOff}
              disabled={!allFieldsFilled2}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default KYC;
