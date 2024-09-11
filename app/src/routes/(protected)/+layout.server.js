export const load = async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"'
            },
            body: 'Unauthorized'
        };
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials).split(':');
    const [username, password] = credentials;

    const isValid = (
        (username === process.env.AUTH_USER || 'admin') && 
        (password === process.env.AUTH_PASSWORD || 'password')
    );

    if (!isValid) {
        return {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"'
            },
            body: 'Unauthorized'
        };
    }

    return {
        status: 200
    };
};
