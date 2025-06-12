import cron from 'node-cron';
import addDays from 'date-fns/addDays';
import { sequence } from '@sveltejs/kit/hooks';
import db, { migrate } from './lib/server/db.js';
import { reload } from 'ip-location-api';

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

    await reload({
        fields: 'country,city,country_name,eu,area',
        addCountryInfo: 'true',
        language: 'en'
    });

    cron.schedule(
        '0 0 4 * *',
        async() => {
            deleteOldSessions(process.env.KEEP_SESSION_AGE_DAYS || 250);
        }
    );
}

const handleCors = async ({ event, resolve }) => {
    if (event.request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    }

    const response = await resolve(event);

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
};

export const handle = sequence(handleCors);
