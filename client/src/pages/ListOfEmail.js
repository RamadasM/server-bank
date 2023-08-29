import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function MyComponent() {
  const [data, setData] = useState([]);
  const [selectedMobileNo, setSelectedMobileNo] = useState("");
  const [gotoMenu, setGotoMenu] = useState(false);

  useEffect(() => {
    // fetch data from backend
    fetch("http://localhost:5002/getData", { method: "GET" })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error));
    window.onpopstate = () => {
      alert('You clicked the back button!');
    };
  }, []);

  const handleMobileNoChange = (event) => {
    setSelectedMobileNo(event.target.value);
  };

  if (gotoMenu) {
    return <Navigate to="/" />
  }

  const filteredData = data.filter((data) => data.User_mobileNo.toString() === (selectedMobileNo))
  console.log(selectedMobileNo)
  console.log(filteredData)


  return (
    <div>
      <div>
        <select value={selectedMobileNo} onChange={handleMobileNoChange}>
          <option value="">Select a mobile number</option>
          {data.map((item) => (
            <option key={item.User_mobileNo} value={item.User_mobileNo}>
              {item.User_mobileNo.toString()}
            </option>
          ))}
        </select> <br /><br />
      </div><br />
      {
        filteredData.length > 0 ? (
          <div>
            <table style={{ width: 500 }}>
              <tr>
                <th>User Email</th>
                <th>user MobileNo</th>
              </tr>
              <tr>
                <td>{filteredData[0].User_email}</td>
                <td>{filteredData[0].User_mobileNo}</td>
              </tr>
            </table>
          </div>
        ) : <p>Please select the mobile number</p>
      }
      <br /><br />
      <button onClick={() => setGotoMenu(true)}>Logout</button>
    </div>
  );
}

export default MyComponent;