<?php
// backend/submit_contact.php
declare(strict_types=1);
session_start();

require_once __DIR__ . '/db.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Basic helper for redirecting back to the page that posted the form.
// Adjust the path depending on where your index.html/contact page lives.
function redirectBack(array $query = []) {
    $qs = http_build_query($query);
    // From backend/ to root index.html -> ../index.html
    $url = '../index.html' . ($qs ? '?' . $qs : '');
    header('Location: ' . $url, true, 303);
    exit;
}

// 1) Honeypot - hidden field 'company'. Bots usually fill it.
if (!empty($_POST['company'] ?? '')) {
    // pretend success for bots (do not process)
    redirectBack(['success' => 1]);
}

// 2) Collect and sanitize input
$full_name = trim((string)($_POST['full_name'] ?? ''));
$email     = trim((string)($_POST['email'] ?? ''));
$phone     = trim((string)($_POST['phone'] ?? ''));
$subject   = trim((string)($_POST['subject'] ?? ''));
$message   = trim((string)($_POST['message'] ?? ''));

// 3) Server-side validation (mirror your client rules)
$errors = [];

if (mb_strlen($full_name) < 2) {
    $errors['full_name'] = 'Full name must be at least 2 characters.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email address.';
}

if ($phone !== '' && !preg_match('/^\+?\d{10,15}$/', $phone)) {
    $errors['phone'] = 'Phone number is invalid (10–15 digits).';
}

if (mb_strlen($subject) < 3) {
    $errors['subject'] = 'Subject must be at least 3 characters.';
}

if (mb_strlen($message) < 10) {
    $errors['message'] = 'Message must be at least 10 characters.';
}

if (!empty($errors)) {
    // do not include all validation messages in the querystring (size), just notify error
    redirectBack(['error' => 'validation']);
}

// 4) Basic rate limiting by IP (allow e.g. up to 3 submissions per 60 seconds)
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
try {
    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM contact_messages WHERE ip_address = :ip AND created_at >= (NOW() - INTERVAL 60 SECOND)");
    $stmt->execute([':ip' => $ip]);
    $row = $stmt->fetch();
    $count_last_min = (int)($row['cnt'] ?? 0);
    if ($count_last_min >= 3) {
        redirectBack(['error' => 'rate']);
    }
} catch (Exception $e) {
    // DB error while checking - log and continue (or block; here we choose to continue)
    error_log('Rate check DB error: ' . $e->getMessage());
}

// 5) Insert message into DB with a prepared statement
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

try {
    $insert = $pdo->prepare("
        INSERT INTO contact_messages
        (full_name, email, phone, subject, message, ip_address, user_agent, created_at)
        VALUES (:full_name, :email, :phone, :subject, :message, :ip, :ua, NOW())
    ");
   

    $insert->execute([
        ':full_name' => $full_name,
        ':email'     => $email,
        ':phone'     => $phone !== '' ? $phone : null,
        ':subject'   => $subject,
        ':message'   => $message,
        ':ip'        => $ip,
        ':ua'        => $user_agent,
    ]);
} catch (Exception $e) {
    error_log('DB insert error: ' . $e->getMessage());
    redirectBack(['error' => 'db']);
}


redirectBack(['success' => 1]);
//erpor email send er kaaj korbo