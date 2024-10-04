import db from '$lib/server/db';

export async function load() {
    return {
        rrweb_session_list: db().query(`
            SELECT
                session_uuid,
                timestamp,
                ip,
                fingerprint,
                info
            FROM
                sessions
            ORDER BY timestamp DESC
        `).map((row) => {
            return {
                ...row,
                info: JSON.parse(row.info)
            }
        })
    };
}
