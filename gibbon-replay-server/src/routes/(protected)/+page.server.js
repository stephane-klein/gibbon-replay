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
                sessions
        `)[0].data_size,
        sessions: db().query(
            `
                SELECT
                    session_uuid,
                    DATETIME(timestamp, 'unixepoch') AS timestamp,
                    ip,
                    fingerprint,
                    info,
                    duration_in_seconds,
                    data_size
                FROM
                    sessions
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
