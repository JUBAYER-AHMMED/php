<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit('Send a POST request with full_name, email, phone, subject, message');
}

//input
$full_name = $_POST['full_name'] ?? '';
$email     = $_POST['email'] ?? '';
$phone     = $_POST['phone'] ?? '';
$subject   = $_POST['subject'] ?? '';
$message   = $_POST['message'] ?? '';
$ip        = $_SERVER['REMOTE_ADDR'] ?? '';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

try {
    $stmt = $pdo->prepare("
        INSERT INTO contact_messages
        (full_name, email, phone, subject, message, ip_address, user_agent, created_at)
        VALUES (:full_name, :email, :phone, :subject, :message, :ip, :ua, NOW())
    ");

    $stmt->execute([
        ':full_name' => $full_name,
        ':email'     => $email,
        ':phone'     => $phone !== '' ? $phone : null,
        ':subject'   => $subject,
        ':message'   => $message,
        ':ip'        => $ip,
        ':ua'        => $user_agent,
    ]);

    echo "Message inserted successfully!";
} catch (Exception $e) {
    echo "Insert failed: " . $e->getMessage();
}
