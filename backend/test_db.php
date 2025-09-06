<?php
$DB_HOST = '127.0.0.1';
$DB_NAME = 'burger_db';
$DB_USER = 'burger_user';
$DB_PASS = 'StrongPasswordHere!';

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS);
    echo "Database connection successful!";
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
}
