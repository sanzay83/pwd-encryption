import "./App.css";
import Home from "./Home";
import PasswordDecryption from "./PasswordDecryption";
import PasswordEncryption from "./PasswordEncryption";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/encryption" element={<PasswordEncryption />} />
        <Route path="/decryption" element={<PasswordDecryption />} />
      </Routes>
    </Router>
  );
}

export default App;
