import cron from 'node-cron';
import addDays from 'date-fns/addDays';
import db, { migrate } from './lib/server/db.js';

function deleteOldSessions(keep_session_age_days) {
    const delete_sessions_older_than_this_date = addDays(
        new Date(),
        -keep_session_age_days
    ).toISOString();
    const sessions_to_delete = db().queryFirstCell(
        'SELECT COUNT(*) FROM sessions WHERE timestamp < datetime(?)',
        delete_sessions_older_than_this_date
    );
    if (sessions_to_delete == 0) {
        console.log(`No sessions older than ${delete_sessions_older_than_this_date} (${keep_session_age_days} days) to delete`);
    } else {
        console.log(
            `Starting deletion of ${sessions_to_delete} sessions older than ${delete_sessions_older_than_this_date} (${keep_session_age_days} days)...`
        );
        db().prepare(`
            DELETE FROM sessions
            WHERE
                timestamp < datetime(?)
        `).run(delete_sessions_older_than_this_date);
        console.log(
            `${sessions_to_delete} deleted with success`
        );
    }
}

export async function init() {
    migrate();

    cron.schedule(
        '0 0 4 * *',
        async() => {
            deleteOldSessions(process.env.KEEP_SESSION_AGE_DAYS || 250);
        }
    );
}

export async function handle({ event, resolve }) {
    return resolve(event);
}
