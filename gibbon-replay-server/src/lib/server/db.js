import DB from '@beenotung/better-sqlite3-helper';

DB({
    path: process.env.SQLITE_PATH || 'gibbon.db',
    fileMustExist: false,
    WAL: false,
    migrate: false
});

DB().pragma('journal_mode = MEMORY');
DB().pragma('synchronous = OFF');
DB().pragma('foreign_keys = ON');

export const migrate = () => {
    console.log('Start data model migration…');
    DB().migrate({
        table: 'migration',
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
            `,
            `
                -- Up
                ALTER TABLE sessions ADD COLUMN duration_in_seconds INTEGER DEFAULT NULL;

                WITH first_events AS (
                    SELECT
                        session_uuid,
                        JSON_EXTRACT(data, '$[0].timestamp') AS timestamp
                    FROM session_events
                    WHERE (session_uuid, timestamp) IN (
                        SELECT
                            session_events.session_uuid,
                            MIN(session_events.timestamp)
                        FROM session_events
                        LEFT JOIN sessions
                        ON session_events.session_uuid=sessions.session_uuid
                        WHERE sessions.duration_in_seconds IS NULL
                        GROUP BY session_events.session_uuid
                    )
                ),
                last_events AS (
                    SELECT
                        session_uuid,
                        (
                            JSON_EXTRACT(data, '$[' || (JSON_ARRAY_LENGTH(data) - 1) || '].timestamp')
                        ) AS timestamp
                    FROM session_events
                    WHERE (session_uuid, timestamp) IN (
                        SELECT
                            session_events.session_uuid,
                            MAX(session_events.timestamp)
                        FROM session_events
                        LEFT JOIN sessions
                        ON session_events.session_uuid=sessions.session_uuid
                        WHERE sessions.duration_in_seconds IS NULL
                        GROUP BY session_events.session_uuid
                    )
                )
                UPDATE sessions
                SET
                    duration_in_seconds = COALESCE(
                        (
                            SELECT (last_events.timestamp - first_events.timestamp) / 1000
                              FROM first_events
                              JOIN last_events
                                ON first_events.session_uuid = last_events.session_uuid
                             WHERE first_events.session_uuid = sessions.session_uuid
                        ),
                        0
                    )
                WHERE
                    sessions.duration_in_seconds IS NULL;
                -- Down
            `,
            `
                -- Up
                DROP INDEX idx_sessions_timestamp;
                ALTER TABLE sessions ADD COLUMN tmp_timestamp INTEGER; -- I don't define a default value here
                                                                       -- because SQLite doesn't allow adding
                                                                       -- a column with ALTER that has a default
                                                                       -- value which is not a constant. See: https://www.sqlite.org/lang_altertable.html
                                                                       -- « The column may not have a default value of
                                                                       -- CURRENT_TIME, CURRENT_DATE, CURRENT_TIMESTAMP,
                                                                       -- or an expression in parentheses. »

                UPDATE sessions SET tmp_timestamp=UNIXEPOCH(timestamp);

                ALTER TABLE sessions DROP COLUMN timestamp;
                ALTER TABLE sessions RENAME COLUMN tmp_timestamp TO timestamp;
                CREATE INDEX idx_sessions_timestamp ON sessions (timestamp);

                DROP INDEX idx_session_events_timestamp;
                ALTER TABLE session_events ADD COLUMN tmp_timestamp INTEGER;

                UPDATE session_events SET tmp_timestamp=UNIXEPOCH(timestamp);

                ALTER TABLE session_events DROP COLUMN timestamp;
                ALTER TABLE session_events RENAME COLUMN tmp_timestamp TO timestamp;
                CREATE INDEX idx_session_events_timestamp ON session_events (timestamp);
                -- Down
            `
        ]
    });
    console.log('Data model migration completed');
};

export default DB;
