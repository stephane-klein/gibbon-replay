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
            if (process.env.GOTIFY_URL && process.env.GOTIFY_KEY) {
                try {
                    fetch(
                        new URL('/message', process.env.GOTIFY_URL).toString(),
                        {
                            method: 'POST',
                            headers: {
                                "Accept": 'application/json',
                                "X-Gotify-Key": process.env.GOTIFY_KEY,
                                "Content-type": 'application/json; charset=UTF-8'
                            },
                            body: JSON.stringify({
                                title: 'New session recording',
                                message: data.rrweb_session_id,
                                message: `[${data.rrweb_session_id}](${new URL("/" + data.rrweb_session_id + "/", process.env.ORIGIN).toString()})`,
                                extras: {
                                    "client::display": {
                                        "contentType": "text/markdown"
                                    },
                                }
                            })
                        }
                    ).catch(
                        (err) => {
                            console.error('Gotify request error:', err)
                        }
                    );
                } catch (error) {
                    console.error("Gotify fetch error:", error);
                }
            }
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
