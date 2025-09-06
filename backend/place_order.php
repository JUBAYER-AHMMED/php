<?php
declare(strict_types=1);
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$name = trim($data['customerName'] ?? '');
$email = trim($data['customerEmail'] ?? '');
$address = trim($data['customerAddress'] ?? '');
$payment = trim($data['paymentMethod'] ?? '');
$cartItems = $data['cartItems'] ?? [];

if (!$name || !$email || !$address || empty($cartItems)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$total = 0;
foreach ($cartItems as $item) {
    $total += $item['price'] * $item['quantity'];
}

try {
    $stmt = $pdo->prepare("INSERT INTO orders (customer_name, email, address, payment_method, total_amount, cart_items, created_at)
                           VALUES (:name, :email, :address, :payment, :total, :cart, NOW())");
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':address' => $address,
        ':payment' => $payment,
        ':total' => $total,
        ':cart' => json_encode($cartItems)
    ]);

    echo json_encode(['success' => true, 'total' => $total]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
