USE issue_tracking_db;

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    comment_type VARCHAR(30) NOT NULL DEFAULT 'reply',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_comments_ticket_id (ticket_id),
    INDEX idx_comments_user_id (user_id)
);
