import { v4 as uuidv4 } from 'uuid';

export async function handle({ event, resolve }) {
    const cookies = event.cookies;
    let sessionId = cookies.get('rrweb_session_id');

    if (!sessionId) {
        sessionId = uuidv4();
    }

    cookies.set('rrweb_session_id', sessionId, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 5,
        //sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });

    const response = await resolve(event);
    return response;
}
