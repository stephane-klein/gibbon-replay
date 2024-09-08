import redis from '$lib/server/redis';

export async function load() {
    const data = (await redis.zrange("session:3", 0, -1)).map(result => JSON.parse(result)).flat(1);
    console.log(data);
    return {
        events: data
    };
}
