<?php
$servername = "srv871.hstgr.io";
$username = "u778068254_pwdMgr";
$password = "Z+0Lk9h3a";
$dbname = "u778068254_pwdMgr";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
