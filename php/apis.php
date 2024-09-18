<?php
include 'database.php';

// CORS Headers
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allows all origins
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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

    // Using prepared statements to avoid SQL Injection
    $stmt = $conn->prepare("SELECT * FROM Users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

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
    break;

  case 'create':
    $username = $input['username'];
    $password = $input['password'];
    $sql = "INSERT INTO `Users`(`username`, `password`) VALUES ('$username','$password')";
    try {
      $conn->query($sql);
      http_response_code(200);
      echo json_encode(["message" => "New user created."]);
    } catch (error) {
      http_response_code(404);
      echo json_encode(["message" => "No users found."]);
    }
    break;

  default:
    http_response_code(400); // Bad request for invalid endpoint
    echo json_encode(["message" => "Invalid API endpoint"]);
    break;
}
