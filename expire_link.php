<?php
require "db_connect.php";

$id = intval($_POST['id'] ?? 0);
$expires_at = $_POST['expires_at'] ?? null;

if (!$id || !$expires_at) {
    echo "error";
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE short_links SET expires_at = ? WHERE id = ?");
    $stmt->execute([$expires_at, $id]);
    echo "updated";
} catch (Exception $e) {
    echo "error";
}
