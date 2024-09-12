import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    const [username, password] = (cookies.get('auth') ?? ":").split(":");

    if (
        (username !== (process.env.AUTH_USER || 'admin')) ||
        (password !== (process.env.AUTH_PASSWORD || 'password'))
    ) {
        return redirect(303, '/login/');
    }
    return {
    }
};
