
<?php
$servername = $_GET['host'] ?? "localhost";
$username = $_GET['user'] ?? "root";
$password = $_GET['pass'] ?? "";
$database = $_GET['db'] ?? null;
$table = $_GET['table'] ?? null;
$action = $_GET['action'] ?? 'read';

$auth_username = "apiuser";
$auth_password = "apipass";

if (!isset($_SERVER['PHP_AUTH_USER']) || 
    $_SERVER['PHP_AUTH_USER'] !== $auth_username || 
    $_SERVER['PHP_AUTH_PW'] !== $auth_password) {
    header('WWW-Authenticate: Basic realm="Database API"');
    header('HTTP/1.0 401 Unauthorized');
    echo json_encode(["error" => "Unauthorized access"]);
    exit;
}

if (!$database || !$table) {
    echo json_encode(["error" => "Database and table are required parameters"]);
    exit;
}

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Action processing here...

// Close the connection
$conn->close();
?>
