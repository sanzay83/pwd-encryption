import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { IoArrowBackSharp } from "react-icons/io5";

function AccountLogins() {
  const [username, setUsername] = useState("");
  const [userPassword, setuserPassword] = useState("");
  const [create, setCreate] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const encryptText = (text) => {
    return CryptoJS.SHA256(text).toString();
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const password = encryptText(userPassword);

    try {
      const response = await axios.post(
        `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=user`,
        {
          username,
          password,
        }
      );
      if (response) {
        localStorage.setItem("username", username);
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
    }
  };

  const handleCreate = () => {
    setCreate(true);
  };

  const handleCancel = () => {
    setCreate(false);
  };

  const handleCreateButton = async (e) => {
    e.preventDefault();

    const password = encryptText(userPassword);

    try {
      if (username && password) {
        const response = await axios.post(
          `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=create`,
          {
            username,
            password,
          }
        );
        setMessage(response.data.message);
        setCreate(false);
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
    }
  };

  return (
    <>
      {!create ? (
        <div className="container">
          <div className="heading">Sign In</div>
          <div className="form">
            <input
              required=""
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              required=""
              className="input"
              type="password"
              value={userPassword}
              onChange={(e) => setuserPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <input
            className="login-button"
            type="submit"
            value="Sign In"
            onClick={handleSignIn}
          />
          <span className="create-user">
            No Account?{" "}
            <div
              style={{ fontSize: "15px", color: "#0099ff", cursor: "pointer" }}
              onClick={handleCreate}
            >
              Create One Here.
            </div>
          </span>
          <div
            style={{ fontSize: "25px", padding: "10px", textAlign: "center" }}
          >
            {message ? message : ""}
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="create-header">
            <div
              style={{
                fontSize: "30px",
                color: "rgb(16, 137, 211)",
                cursor: "pointer",
              }}
              className="cancel-button"
              onClick={handleCancel}
            >
              <IoArrowBackSharp />
            </div>
            <div className="heading">Create Account</div>
          </div>

          <div className="form">
            <input
              required=""
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              required=""
              className="input"
              type="password"
              value={userPassword}
              onChange={(e) => setuserPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <input
            className="login-button"
            type="submit"
            value="Create"
            onClick={handleCreateButton}
          />
        </div>
      )}
    </>
  );
}

export default AccountLogins;
