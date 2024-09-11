import redis from '$lib/server/redis';

export async function load({ params }) {
    const data = (
        await redis.zrange(
            `session:${params.rrweb_session_id}`,
            0,
            -1
        )
    ).map(result => JSON.parse(result)).flat(1);
    return {
        events: data
    };
}
