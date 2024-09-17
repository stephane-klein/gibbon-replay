import db from '$lib/server/db';

export async function load({ params }) {
    const session = db.prepare(
        `SELECT * FROM sessions WHERE session_uuid = ?`
    ).get(params.rrweb_session_id);
    session.info = JSON.parse(session.info);

    return {
        session: session,
        events: db.prepare(`
            SELECT
                data
            FROM
                session_events
            WHERE session_uuid = ?
            ORDER BY timestamp DESC
        `).all(params.rrweb_session_id).map(row => JSON.parse(row.data)).flat(1)
    };
}
