import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaLockOpen } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const handleButton = (condition) => {
    if (condition === "encryption") {
      navigate("/encryption");
    } else {
      navigate("/decryption");
    }
  };
  return (
    <div className="container">
      <h2>
        Hi there, Are you looking for a password manager? If YES, you are at the
        right place.
      </h2>
      <div className="card-container">
        <div className="card shadow" onClick={() => handleButton("encryption")}>
          <>
            <FaLock size={"2rem"} />
          </>
          Encrypt Your Password
        </div>
        <div className="card shadow" onClick={() => handleButton("decryption")}>
          <FaLockOpen size={"2rem"} /> Decrypt Your Password
        </div>
      </div>
    </div>
  );
}

export default Home;
