<?php
require "db_connect.php"; 

header('Content-Type: application/json');

$url = trim($_POST['url'] ?? '');
$expiration = intval($_POST['expiration'] ?? 0);

if (empty($url)) {
    echo json_encode(['error' => 'URL is required']);
    exit;
}

try {
    $stmtCheck = $pdo->prepare("SELECT id FROM original_urls WHERE original_url = ?");
    $stmtCheck->execute([$url]);
    $original = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if ($original) {
        $original_id = $original['id'];
    } else {
        $stmtInsertOriginal = $pdo->prepare("INSERT INTO original_urls (original_url) VALUES (?)");
        $stmtInsertOriginal->execute([$url]);
        $original_id = $pdo->lastInsertId();
    }
    $short_code = substr(md5(uniqid(mt_rand(), true)), 0, 6);

    $expiresAt = null;
    if ($expiration > 0) {
        $expiresAt = date("Y-m-d H:i:s", time() + $expiration * 60); 
    }

    $stmtInsertShort = $pdo->prepare("
        INSERT INTO short_links (original_id, short_code, expires_at, clicks) 
        VALUES (?, ?, ?, 0)
    ");
    $stmtInsertShort->execute([$original_id, $short_code, $expiresAt]);
    $short_id = $pdo->lastInsertId();

    echo json_encode([
        "id" => $short_id,
        "original" => $url,
        "shortUrl" => "https://short.link/" . $short_code,
        "clicks" => 0,
        "expires_at" => $expiresAt
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>