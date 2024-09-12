import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
    cookies.delete('auth', { path: '/' });
    redirect(302, '/');
}
