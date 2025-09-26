<?php
require "db_connect.php"; 

try {
    $stmt = $pdo->prepare("
        SELECT 
            s.id, 
            o.original_url AS original, 
            s.short_code, 
            s.clicks, 
            s.expires_at
        FROM short_links s
        INNER JOIN original_urls o ON s.original_id = o.id
        WHERE s.expires_at IS NULL OR s.expires_at > NOW()
        ORDER BY s.id DESC
    ");
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ndërto array për frontend
    $links = array_map(function($row) {
        return [
            'id' => $row['id'],
            'short_code' => $row['short_code'],
            'shortUrl' => "https://short.link/" . $row['short_code'],
            'original' => $row['original'],
            'clicks' => $row['clicks'],
            'expires_at' => $row['expires_at']
        ];
    }, $rows);

    header('Content-Type: application/json');
    echo json_encode($links);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
