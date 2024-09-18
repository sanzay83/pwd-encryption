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

  const [company, setCompany] = useState("");
  const [cUsername, setcUsername] = useState("");
  const [cPassword, setcPassword] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleAdd = () => {
    setShowAdd(true);
    setCompany("");
    setcUsername("");
    setcPassword("");
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=addrecord`,
        {
          username,
          company,
          cUsername,
          cPassword,
        }
      );
    } catch (e) {
      console.log(e);
    }

    setCompany("");
    setcUsername("");
    setcPassword("");
    setShowAdd(false);
  };

  const handleUpdate = (company, user, password) => {
    setCompany(company);
    setcUsername(user);
    setcPassword(password);
    setShowAdd(true);
    setShowUpdate(true);
  };

  const handleUpdateRecord = async () => {
    try {
      const response = await axios.post(
        `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=updaterecord`,
        {
          username,
          company,
          cUsername,
          cPassword,
        }
      );
    } catch (e) {
      console.log(e);
    }

    setCompany("");
    setcUsername("");
    setcPassword("");
    setShowAdd(false);
    setShowUpdate(false);
  };

  const handleBack = () => {
    setShowAdd(false);
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

          {showAdd ? (
            <div className="warning-general">
              <div className="confirm-div">
                <div>
                  {showUpdate ? (
                    <strong>UPDATE ITEM</strong>
                  ) : (
                    <>
                      <strong>ADD ITEM</strong>

                      <span>
                        <div
                          style={{
                            textAlign: "left",
                            fontSize: "15px",
                            fontWeight: "bold",
                            padding: "5px 0",
                          }}
                        >
                          Company:
                        </div>

                        <input
                          required=""
                          className="input"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Company"
                        />
                      </span>
                    </>
                  )}

                  <span>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: "bold",
                        padding: "5px 0",
                      }}
                    >
                      Username:
                    </div>
                    <input
                      required=""
                      className="input"
                      type="text"
                      value={cUsername}
                      onChange={(e) => setcUsername(e.target.value)}
                      placeholder="Username"
                    />
                  </span>
                  <span>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: "bold",
                        padding: "5px 0",
                      }}
                    >
                      Password:
                    </div>
                    <input
                      required=""
                      className="input"
                      type="text"
                      value={cPassword}
                      onChange={(e) => setcPassword(e.target.value)}
                      placeholder="Password"
                    />
                  </span>
                </div>
                <div className="modals-container">
                  {showUpdate ? (
                    <button className="green-btn" onClick={handleUpdateRecord}>
                      UPDATE
                    </button>
                  ) : (
                    <button className="green-btn" onClick={handleAddItem}>
                      ADD
                    </button>
                  )}
                  <button className="red-btn" onClick={handleBack}>
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button className="add-btn" onClick={handleAdd}>
                ADD ITEM
              </button>

              {data.length !== 0 ? (
                <>
                  {data.map((each, index) => (
                    <div key={index} className="warning-general">
                      <div className="confirm-div">
                        <div>
                          <strong>
                            {index}. {each.company}
                          </strong>
                          <span>
                            <strong>Username:</strong> {each.user}
                          </span>
                          <span>
                            <strong>Password:</strong> {each.password}
                          </span>
                        </div>
                        <div className="modals-container">
                          <button
                            className="red-btn"
                            onClick={() => handleDelete(each.company)}
                          >
                            Delete
                          </button>
                          <button
                            className="green-btn"
                            onClick={() =>
                              handleUpdate(
                                each.company,
                                each.user,
                                each.password
                              )
                            }
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "20px",
                  }}
                >
                  "No Data to Load."
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        "You are not Signed In! Please Sign In First."
      )}
    </>
  );
}

export default Dashboard;
