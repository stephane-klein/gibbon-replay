import db, { migrate } from './lib/server/db.js';

migrate();

const { changes: numberRowUpdated } = db().run(`
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
`);
console.log(`${numberRowUpdated} session.duration_in_seconds updated`);
