import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import CryptoJS from "crypto-js";
import { masterKey } from "../config";

function Dashboard() {
  const [loggedin, setLoggedin] = useState(false);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [modify, setModify] = useState(false);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const encryptText = (text, key) => {
    return CryptoJS.AES.encrypt(text, key).toString();
  };

  const decryptText = (text, key) => {
    const bytes = CryptoJS.AES.decrypt(text, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    if (token !== "") {
      setLoggedin(true);

      const fetchData = async () => {
        try {
          const response = await axios.post(
            `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=retrieverecord`,
            {
              username,
              token,
            }
          );

          if (response.data) {
            setData(response.data);
          } else {
            setMessage("No data to load");
          }
          setLoading(false);
        } catch (e) {
          setMessage("Please Log In!");
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [username, token, loading]);

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=signout`,
        {
          username,
        }
      );
    } catch (e) {
      console.log(e);
    }
    setLoggedin(false);
    localStorage.setItem("username", "");
    localStorage.setItem("token", "");
    navigate("/");
  };

  const handleDelete = async (company) => {
    try {
      await axios.post(
        `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=deleterecord`,
        {
          username,
          company,
          token,
        }
      );
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  const [company, setCompany] = useState("");
  const [compUsername, setcompUsername] = useState("");
  const [compPassword, setcompPassword] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleAdd = () => {
    setShowAdd(true);
    setCompany("");
    setcompUsername("");
    setcompPassword("");
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const cUsername = encryptText(compUsername, masterKey);
    const cPassword = encryptText(compPassword, masterKey);

    try {
      await axios.post(
        `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=addrecord`,
        {
          username,
          company,
          cUsername,
          cPassword,
          token,
        }
      );
      setLoading(true);
    } catch (e) {
      console.log(e);
    }

    setCompany("");
    setcompUsername("");
    setcompPassword("");
    setShowAdd(false);
  };

  const handleUpdate = (company, user, password) => {
    setCompany(company);
    setcompUsername(decryptText(user, masterKey));
    setcompPassword(decryptText(password, masterKey));
    setShowAdd(true);
    setShowUpdate(true);
  };

  const handleUpdateRecord = async () => {
    try {
      const cUsername = encryptText(compUsername, masterKey);
      const cPassword = encryptText(compPassword, masterKey);
      await axios.post(
        `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=updaterecord`,
        {
          username,
          company,
          cUsername,
          cPassword,
          token,
        }
      );
      setLoading(true);
    } catch (e) {
      console.log(e);
    }

    setCompany("");
    setcompUsername("");
    setcompPassword("");
    setShowAdd(false);
    setShowUpdate(false);
  };

  const handleBack = () => {
    setShowAdd(false);
  };

  const handleModify = () => {
    setModify(true);
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
                    <>
                      <strong>UPDATE ITEM</strong>
                      <span>Company: {company}</span>
                    </>
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
                      value={compUsername}
                      onChange={(e) => setcompUsername(e.target.value)}
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
                      value={compPassword}
                      onChange={(e) => setcompPassword(e.target.value)}
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
                          <strong>{each.company}</strong>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "10px",
                            }}
                          >
                            <b>Username:</b>{" "}
                            <div className="hideCase">
                              {decryptText(each.user, masterKey)}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "10px",
                            }}
                          >
                            <b> Password:</b>{" "}
                            <div className="hideCase">
                              {decryptText(each.password, masterKey)}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {modify ? (
                            <>
                              <button
                                className="green-btn updatedeletebutton"
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
                              <button
                                className="red-btn updatedeletebutton"
                                onClick={() => handleDelete(each.company)}
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              className="green-btn updatedeletebutton"
                              onClick={() => handleModify()}
                            >
                              MODIFY
                            </button>
                          )}
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
                  {message}
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
