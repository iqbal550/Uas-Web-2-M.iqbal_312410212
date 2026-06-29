<?php
// ============================================
// CORS HEADER
// ============================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// AMBIL DATA DARI REQUEST
// ============================================
$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? null;
$password = $input['password'] ?? null;

if (!$username || !$password) {
    echo json_encode(['status' => false, 'message' => 'Username dan password harus diisi']);
    exit;
}

// ============================================
// KONEKSI KE DATABASE
// ============================================
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'inventory_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['status' => false, 'message' => 'Database connection failed']);
    exit;
}

// ============================================
// CEK USER
// ============================================
$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(['status' => false, 'message' => 'User tidak ditemukan']);
    exit;
}

// ============================================
// VERIFY PASSWORD
// ============================================
if (!password_verify($password, $user['password'])) {
    echo json_encode(['status' => false, 'message' => 'Password salah']);
    exit;
}

// ============================================
// SUKSES
// ============================================
echo json_encode([
    'status' => true,
    'message' => 'Login berhasil',
    'data' => [
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]
]);

$conn->close();
?>