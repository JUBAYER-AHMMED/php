<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); exit('Method Not Allowed');
}

function back($q=[]) {
    header('Location: ../index.html' . ($q ? '?' . http_build_query($q) : ''), true, 303);
    exit;
}

$full_name = trim($_POST['full_name'] ?? '');
$email     = trim($_POST['email'] ?? '');
$phone     = trim($_POST['phone'] ?? '');
$subject   = trim($_POST['subject'] ?? '');
$message   = trim($_POST['message'] ?? '');

try {
    $pdo->prepare("INSERT INTO contact_messages
        (full_name,email,phone,subject,message,created_at)
        VALUES(:n,:e,:p,:s,:m,NOW())")
        ->execute([
            ':n'=>$full_name, ':e'=>$email, ':p'=>$phone?:null,
            ':s'=>$subject, ':m'=>$message
        ]);
} catch(Exception $e){ back(['error'=>'db']); }

back(['success'=>1]);