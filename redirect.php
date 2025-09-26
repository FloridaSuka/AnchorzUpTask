<?php
require "db_connect.php";

$short_code = $_GET['c'] ?? '';
if (empty($short_code)) {
    die("No short code provided.");
}

try {
    $stmt = $pdo->prepare("
        SELECT s.id AS short_id, s.clicks, o.original_url 
        FROM short_links s
        INNER JOIN original_urls o ON s.original_id = o.id
        WHERE s.short_code = ?
        LIMIT 1
    ");
    $stmt->execute([$short_code]);
    $link = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$link) {
        die("Short link not found or expired.");
    }

    // Rrit klikimet
    $stmtUpdate = $pdo->prepare("UPDATE short_links SET clicks = clicks + 1 WHERE id = ?");
    $stmtUpdate->execute([$link['short_id']]);

    // Redirect
    header("Location: " . $link['original_url']);
    exit;
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
