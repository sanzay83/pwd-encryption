<?php
$servername = "localhost";
$username = "u778068254_pwdMgr";
$password = "";
$dbname = "u778068254_pwdMgr";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
