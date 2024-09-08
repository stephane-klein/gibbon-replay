import redis from '$lib/server/redis';

export async function POST({ request }) {
    try {
        const data = await request.json();
        await redis.zadd(
            `session:3`,
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
