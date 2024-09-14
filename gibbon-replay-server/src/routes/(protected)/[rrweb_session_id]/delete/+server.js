import { redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
export const trailingSlash = "always";

export async function GET({ params }) {
    db.prepare(`
        DELETE FROM sessions WHERE session_uuid = ?
    `).run(params.rrweb_session_id);
    redirect(307, '../../');
}
