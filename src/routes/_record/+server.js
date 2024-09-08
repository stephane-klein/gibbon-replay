import redis from '$lib/server/redis';

export async function POST({ cookies, request }) {
    try {
        const rrweb_session_id = cookies.get('rrweb_session_id')
        const data = await request.json();
        await redis.zadd(
            'rrweb_session_list',
            'NX', 
            Date.now(),
            rrweb_session_id
        )
        await redis.zadd(
            `session:${rrweb_session_id}`,
            data.events[0].timestamp,
            JSON.stringify(data.events) 
        );

        return new Response('', {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
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
