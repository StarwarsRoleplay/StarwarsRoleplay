-- Schema for Star Wars Roleplay Website
-- Used for caching faction data and member counts

CREATE TABLE IF NOT EXISTS factions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    member_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert placeholder data if needed or let the backend populate it
