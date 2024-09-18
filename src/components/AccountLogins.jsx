import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "./config";
import { useNavigate } from "react-router-dom";

function AccountLogins() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [create, setCreate] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

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
        localStorage.setItem("loggedIn", true);
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

  const handleCreateButton = async (e) => {
    e.preventDefault();

    try {
      if (username && password) {
        const response = await axios.post(
          `https://sanjayduwal.com/encrypt/php/apis.php?endpoint=create`,
          {
            username,
            password,
          }
        );
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <span className="forgot-password">
            <a href="#">Forgot Password ?</a>
          </span>
          <input
            className="login-button"
            type="submit"
            value="Sign In"
            onClick={handleSignIn}
          />
          <span className="create-user">
            No Account? <a onClick={handleCreate}>Create One Here.</a>
          </span>
        </div>
      ) : (
        <div className="container">
          <div className="heading">Create Account</div>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
