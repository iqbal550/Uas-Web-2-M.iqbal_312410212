<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'inventory_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}

echo "✅ Connected successfully!<br>";

$result = $conn->query("SELECT * FROM users");
while ($row = $result->fetch_assoc()) {
    echo "User: " . $row['username'] . " - " . $row['email'] . "<br>";
}

$conn->close();
?>