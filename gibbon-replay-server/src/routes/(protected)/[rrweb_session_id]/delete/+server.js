import { redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
export const trailingSlash = "always";

export async function GET({ params }) {
    db().delete('sessions', { session_uuid: params.rrweb_session_id });
    redirect(307, '../../');
}
