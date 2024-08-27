import React, { useState } from "react";
import CryptoJS from "crypto-js";

function PasswordDecryption() {
  const [masterKey, setMasterKey] = useState("");
  const [encryptedPassword, setEncryptedPassword] = useState("");
  const [decryptedPassword, setDecryptedPassword] = useState("");

  const decryptPassword = (encryptedPassword, key) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  const handleDecrypt = () => {
    const decrypted = decryptPassword(encryptedPassword, masterKey);
    setDecryptedPassword(decrypted);
  };
  return (
    <div className="container">
      <h2>Password Decryption</h2>
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
          Encrypted Password:
          <input
            type="password"
            value={encryptedPassword}
            onChange={(e) => setEncryptedPassword(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleDecrypt}>Decrypt Password</button>
      {decryptedPassword && (
        <div>
          <p>Decrypted Password: {decryptedPassword}</p>
        </div>
      )}
    </div>
  );
}

export default PasswordDecryption;
