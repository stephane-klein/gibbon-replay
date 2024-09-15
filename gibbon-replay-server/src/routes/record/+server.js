import db from "$lib/server/db.js";
import { lookup, reload } from 'ip-location-api';
export const trailingSlash = "always";

await reload({
    fields: 'country,city,country_name,eu,area',
    addCountryInfo: 'true',
    language: 'en'
})

export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
    })
}

export async function POST({ request }) {
    try {
        const data = JSON.parse(await request.text());
        if (!data.events) {
            const ip = (
                request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') || null
            );

            if (ip) {
                try {
                    data.location = lookup(ip);
                } catch(error) {
                    console.log(error);
                }
            }

            db.prepare(`
                INSERT INTO sessions (
                    session_uuid,
                    ip,
                    fingerprint,
                    info
                )
                VALUES(?, ?, ?, ?)
            `).run(
                data.rrweb_session_id,
                ip,
                data.fingerprint,
                JSON.stringify(data)
            );
        } else {
            db.prepare(`
                INSERT INTO session_events (
                    session_uuid,
                    timestamp,
                    data
                )
                VALUES(?, ?, ?)
            `).run(
                data.rrweb_session_id,
                data.events[0].timestamp,
                JSON.stringify(data.events)
            );
        }

        return new Response('',
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
    } catch (error) {
        console.error('Error:', error);

        return new Response(JSON.stringify({ error: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
