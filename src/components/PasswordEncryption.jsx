import React, { useState } from "react";
import CryptoJS from "crypto-js";

const PasswordEncryption = () => {
  const [masterKey, setMasterKey] = useState("");
  const [username, setUsername] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [encryptedPassword, setEncryptedPassword] = useState("");
  const [formData, setFormData] = useState("");

  const encryptText = (password, key) => {
    return CryptoJS.AES.encrypt(password, key).toString();
  };

  const handleEncrypt = (e) => {
    e.preventDefault();
    const data = {};
    fetch("http://localhost:3000/api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => console.error(error));
    const encrypted = encryptText(plainPassword, masterKey);
    setEncryptedPassword(encrypted);
  };

  return (
    <div className="container">
      <h2>Password Encryption</h2>
      <div>
        <label>
          Master Key:
          <input
            type="text"
            value={masterKey}
            onChange={(e) => setMasterKey(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Plain Password:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Plain Password:
          <input
            type="password"
            value={plainPassword}
            onChange={(e) => setPlainPassword(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleEncrypt}>Encrypt Password</button>
      {encryptedPassword && (
        <div>
          <p>Encrypted Password: {encryptedPassword}</p>
        </div>
      )}
    </div>
  );
};

export default PasswordEncryption;
