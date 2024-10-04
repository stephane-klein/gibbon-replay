import DB from '@beenotung/better-sqlite3-helper';

DB({
    path: process.env.SQLITE_PATH || 'gibbon.db',
    fileMustExist: false,
    WAL: false,
    migrate: {
        force: false, // set to 'last' to automatically reapply the last migration-file
        table: 'migration', // name of the database table that is used to keep track
        migrations: [
            `
                -- Up
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
                -- Down
            `,
            `
                -- Up
                ALTER TABLE session_events ADD COLUMN data_size INTEGER DEFAULT NULL;

                UPDATE session_events
                    SET data_size = LENGTH(src.data)
                FROM session_events AS src
                    WHERE (session_events.id = src.id) AND (src.data_size IS NULL);
                -- Down
            `
        ]
    }
})

DB().pragma('journal_mode = MEMORY');
DB().pragma('synchronous = OFF');
DB().pragma('foreign_keys = ON');

export default DB;
