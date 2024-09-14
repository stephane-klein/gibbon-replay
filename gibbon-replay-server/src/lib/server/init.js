import db from './db.js';

db.exec(`
CREATE TABLE IF NOT EXISTS sessions (
    session_uuid   TEXT NOT NULL UNIQUE,
    timestamp      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip             TEXT DEFAULT NULL,
    fingerprint    TEXT DEFAULT NULL,
    info           JSON DEFAULT NULL,
    PRIMARY KEY(session_uuid)
);

CREATE INDEX IF NOT EXISTS idx_sessions_timestamp ON sessions (timestamp);
CREATE INDEX IF NOT EXISTS idx_sessions_ip ON sessions (ip);
CREATE INDEX IF NOT EXISTS idx_sessions_fingerprint ON sessions (fingerprint);

CREATE TABLE IF NOT EXISTS session_events (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    session_uuid TEXT NOT NULL,
    timestamp    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data         TEXT,
    FOREIGN KEY (session_uuid) REFERENCES sessions(session_uuid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_session_events_session_uuid ON session_events (session_uuid);
CREATE INDEX IF NOT EXISTS idx_session_events_timestamp ON session_events (timestamp);;
`);
