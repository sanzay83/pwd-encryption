import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

function Dashboard() {
  const loggedin = localStorage.getItem("loggedIn");
  const [data, setData] = useState([]);
  const username = localStorage.getItem("username");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=retrieverecord`,
          {
            username,
          }
        );

        if (response.data) {
          setData(response.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

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

  const handleDelete = async (company) => {
    try {
      const response = await axios.post(
        `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=deleterecord`,
        {
          username,
          company,
        }
      );
    } catch (e) {
      console.log(e);
    }
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

          {data.length !== 0 ? (
            <>
              {data.map((each, index) => (
                <div key={index} className="warning-general">
                  <div className="confirm-div">
                    <p>
                      <strong>
                        {index}. {each.company}
                      </strong>
                      <span>
                        <strong>Username:</strong> {each.user}
                      </span>
                      <span>
                        <strong>Password:</strong> {each.password}
                      </span>
                    </p>
                    <div className="modals-container">
                      <button
                        className="red-btn"
                        onClick={() => handleDelete(each.company)}
                      >
                        Delete
                      </button>
                      <button className="green-btn">Update</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div
              style={{ textAlign: "center", padding: "20px", fontSize: "20px" }}
            >
              "No Data to Load."
            </div>
          )}
        </div>
      ) : (
        "You are not Signed In! Please Sign In First."
      )}
    </>
  );
}

export default Dashboard;
