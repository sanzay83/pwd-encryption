import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

function Dashboard() {
  const loggedin = localStorage.getItem("loggedIn");
  const [data, setData] = useState(["", "", "", "", "", "", "", ""]);
  const username = localStorage.getItem("username");

  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=signout`,
        {
          username,
        }
      );
    } catch (e) {
      console.log(e);
    }
    localStorage.setItem("loggedIn", false);
    localStorage.setItem("username", "");
    localStorage.setItem("token", "");
    navigate("/");
  };
  return (
    <>
      {loggedin ? (
        <div className="main-container">
          <div className="welcome-header">
            <div>Welcome, {username}</div>
            <div style={{ cursor: "pointer" }} onClick={handleSignOut}>
              <FaSignOutAlt />
            </div>
          </div>
          {data.map((each, index) => (
            <div className="warning-general">
              <div className="confirm-div">
                <p>
                  <strong>{index}. Facebook</strong>
                  <span>
                    <strong>Username:</strong> SanjayDuwal
                  </span>
                  <span>
                    <strong>Password:</strong> Password
                  </span>
                </p>
                <div className="modals-container">
                  <button className="red-btn">Delete</button>
                  <button className="green-btn">Update</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        "You are not Signed In! Please Sign In First."
      )}
    </>
  );
}

export default Dashboard;
