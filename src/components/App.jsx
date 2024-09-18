import AccountLogins from "./AccountLogins";
import "./App.css";
import "./AccountLogins.css";
import "./Dashboard.css";
import PasswordDecryption from "./PasswordDecryption";
import PasswordEncryption from "./PasswordEncryption";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountLogins />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/encryption" element={<PasswordEncryption />} />
        <Route path="/decryption" element={<PasswordDecryption />} />
      </Routes>
    </Router>
  );
}

export default App;
