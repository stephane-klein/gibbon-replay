import db from '$lib/server/db';

export async function load({ params }) {
    const session = db().queryFirstRow(
        `SELECT * FROM sessions WHERE session_uuid = ?`,
        params.rrweb_session_id
    );
    session.info = JSON.parse(session.info);

    return {
        session: session,
        events: db().query(
            `
            SELECT
                data
            FROM
                session_events
            WHERE session_uuid = ?
            ORDER BY timestamp DESC
            `,
            params.rrweb_session_id
        ).map(row => JSON.parse(row.data)).flat(1)
    };
}
