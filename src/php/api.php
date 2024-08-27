<?php
include 'database.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

function getPassword($conn)
{
  $sql = "SELECT id, username, email FROM users";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    $users = [];
    while ($row = $result->fetch_assoc()) {
      $users[] = $row;
    }
    http_response_code(200);
    echo json_encode($users);
  } else {
    http_response_code(404);
    echo json_encode(["message" => "No users found."]);
  }
}

function setPassword($conn)
{
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data->username) && isset($data->password)) {
    $username = htmlspecialchars($data->username);
    $email = htmlspecialchars($data->email);
    $password = password_hash($data->password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password);

    if ($stmt->execute()) {
      http_response_code(201);
      echo json_encode(["message" => "User created successfully."]);
    } else {
      http_response_code(500);
      echo json_encode(["message" => "Failed to create user."]);
    }

    $stmt->close();
  } else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
  }
}

$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
  case 'GET':
    getPassword($conn);
    break;
  case 'POST':
    setPassword($conn);
    break;
  default:
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
    break;
}

$conn->close();
