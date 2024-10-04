import db from '$lib/server/db';

export async function load() {
    return {
        rrweb_session_list: db().query(`
            SELECT
                sessions.session_uuid,
                sessions.timestamp,
                sessions.ip,
                sessions.fingerprint,
                sessions.info,
                SUM(session_events.data_size) AS data_size
            FROM
                sessions
            LEFT JOIN
                session_events
            ON
                session_events.session_uuid=sessions.session_uuid
            GROUP BY sessions.session_uuid
            ORDER BY sessions.timestamp DESC
        `).map((row) => {
            return {
                ...row,
                info: JSON.parse(row.info)
            }
        })
    };
}
