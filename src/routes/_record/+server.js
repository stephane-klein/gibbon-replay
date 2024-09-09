import redis from '$lib/server/redis';

export async function POST({ request }) {
    try {
        const data = await request.json();
        console.log(data);
        console.log(request.headers);
        if (!data.events) {
            console.log("ici1");
            await redis.zadd(
                'rrweb_session_list',
                'NX', 
                Date.now(),
                JSON.stringify({
                    ...data,
                    ip: (
                        request.headers.get('x-forwarded-for') ||
                        request.headers.get('x-real-ip')
                    )
                })
            )
        }
        await redis.zadd(
            `session:${data.rrweb_session_id}`,
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
