import db from '$lib/server/db';

export async function load({ url }) {
    const perPage = parseInt(url.searchParams.get('per_page') || '20');

    return {
        sessions_count: db().query(`
            SELECT COUNT(*) AS count FROM sessions
        `)[0].count,
        sessions_size: db().query(`
            SELECT
                SUM(data_size) AS data_size
            FROM
                session_events
        `)[0].data_size,
        sessions: db().query(
            `
                SELECT
                    sessions.session_uuid,
                    sessions.timestamp,
                    sessions.ip,
                    sessions.fingerprint,
                    sessions.info,
                    sessions.duration_in_seconds,
                    SUM(session_events.data_size) AS data_size
                FROM
                    sessions
                LEFT JOIN
                    session_events
                ON
                    session_events.session_uuid=sessions.session_uuid
                GROUP BY sessions.session_uuid
                ORDER BY sessions.timestamp DESC
                LIMIT ?
                OFFSET ?
            `,
            perPage,
            (parseInt(url.searchParams.get('page') || '1') - 1) * perPage
        ).map((row) => {
            return {
                ...row,
                info: JSON.parse(row.info)
            };
        })
    };
}
