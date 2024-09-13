import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (
            (username === (process.env.AUTH_USER || 'admin')) && 
            (password === (process.env.AUTH_PASSWORD || 'password'))
        ) {
            cookies.set(
                'auth',
                `${username}:${password}`,
                {
                    path: '/',
                    httpOnly: true
                }
            );
            redirect(302, '/');
        } else {
            cookies.delete('auth', { path: '/' });
            return fail(
                400,
                {
                    error: 'login, password invalid'
                }
            );
        };
    }
};
