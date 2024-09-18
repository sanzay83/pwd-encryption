<?php
include 'database.php';

// CORS Headers
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($endpoint) {
  case 'user':
    $username = $input['username'];
    $password = $input['password'];

    $stmt = $conn->prepare("SELECT * FROM Users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
      $users = [];
      while ($row = $result->fetch_assoc()) {
        $users[] = $row;
      }

      if ($users[0]["username"] == $username && $users[0]["password"] == $password) {
        $token = bin2hex(random_bytes(16));
        $sql = "UPDATE `token` SET `token`='$token' WHERE `username`='$username'";
        $conn->query($sql);

        http_response_code(200);
        echo json_encode(["token" => $token]);
      } else {
        http_response_code(404);
        echo json_encode(["message" => "Wrong Password."]);
      }
    } else {
      http_response_code(404);
      echo json_encode(["message" => "No users found."]);
    }
    break;

  case 'create':
    $username = $input['username'];
    $password = $input['password'];

    $stmt = $conn->prepare("SELECT * FROM Users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
      try {
        $sql = "INSERT INTO `Users`(`username`, `password`) VALUES ('$username','$password')";
        $conn->query($sql);
        $sql = "INSERT INTO `token`(`username`, `token`) VALUES ('$username','none')";
        $conn->query($sql);
        http_response_code(200);
        echo json_encode(["message" => "New user created."]);
      } catch (error) {
        http_response_code(404);
        echo json_encode(["message" => "No users found."]);
      }
    } else {
      http_response_code(400);
      echo json_encode(["message" => "User already exists."]);
    }
    break;

  case 'signout':
    $username = $input['username'];
    try {
      $sql = "UPDATE `token` SET `token`='none' WHERE `username`='$username'";
      $conn->query($sql);

      http_response_code(200);
      echo json_encode(["message" => "SignOut Successfully."]);
    } catch (error) {
      http_response_code(400);
      echo json_encode(["message" => "Error while signing out"]);
    }
    break;

  case 'addrecord':
    $username = $input['username'];
    $company = $input['company'];
    $cuser = $input['cUsername'];
    $cpassword = $input['cPassword'];
    $token = $input['token'];

    try {
      $sql = "INSERT INTO `manager`(`username`,`company`,`user`, `password`) VALUES ('$username','$company','$cuser','$cpassword')";
      $conn->query($sql);
      http_response_code(200);
      echo json_encode(["message" => "Record added successfully."]);
    } catch (error) {
      http_response_code(404);
      echo json_encode(["message" => "Record adding failed."]);
    }
    break;

  case 'updaterecord':
    $username = $input['username'];
    $company = $input['company'];
    $cuser = $input['cUsername'];
    $cpassword = $input['cPassword'];
    $token = $input['token'];

    try {
      $sql = "UPDATE `manager` SET `user`='$cuser',`password`='$cpassword' WHERE `username`='$username' AND `company`='$company'";
      $conn->query($sql);
      http_response_code(200);
      echo json_encode(["message" => "Record updated successfully."]);
    } catch (error) {
      http_response_code(404);
      echo json_encode(["message" => "Record updating failed."]);
    }
    break;

  case 'retrieverecord':
    $username = $input['username'];
    $stmt = $conn->prepare("SELECT * FROM manager WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
      $record = [];
      while ($row = $result->fetch_assoc()) {
        $record[] = $row;
      }
    }

    try {
      http_response_code(200);
      echo json_encode($record);
    } catch (error) {
      http_response_code(404);
      echo json_encode(["message" => "Error retriving records."]);
    }
    break;


  case 'deleterecord':
    $username = $input['username'];
    $company = $input['company'];
    $sql = "DELETE FROM `manager` WHERE username='$username' AND company='$company'";

    try {
      $conn->query($sql);
      http_response_code(200);
      echo json_encode(["message" => "Record successfully deleted."]);
    } catch (error) {
      http_response_code(404);
      echo json_encode(["message" => "Error retriving records."]);
    }
    break;



  default:
    http_response_code(400); // Bad request for invalid endpoint
    echo json_encode(["message" => "Invalid API endpoint"]);
    break;
}
