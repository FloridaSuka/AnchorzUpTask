CREATE DATABASE IF NOT EXISTS url_shortener;
USE url_shortener;

CREATE TABLE IF NOT EXISTS original_urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_url VARCHAR(2048) NOT NULL UNIQUE,
    total_clicks INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS short_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_id INT NOT NULL, 
    short_code VARCHAR(10) NOT NULL UNIQUE,
    clicks INT DEFAULT 0, 
    expires_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (original_id) REFERENCES original_urls(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELIMITER //

CREATE TRIGGER update_total_clicks_after_insert
AFTER INSERT ON short_links
FOR EACH ROW
BEGIN
    UPDATE original_urls o
    SET o.total_clicks = (
        SELECT COALESCE(SUM(s.clicks),0) 
        FROM short_links s 
        WHERE s.original_id = NEW.original_id
    )
    WHERE o.id = NEW.original_id;
END;
//

CREATE TRIGGER update_total_clicks_after_update
AFTER UPDATE ON short_links
FOR EACH ROW
BEGIN
    IF OLD.clicks <> NEW.clicks THEN
        UPDATE original_urls o
        SET o.total_clicks = (
            SELECT COALESCE(SUM(s.clicks),0) 
            FROM short_links s 
            WHERE s.original_id = NEW.original_id
        )
        WHERE o.id = NEW.original_id;
    END IF;
END;
//

DELIMITER ;
