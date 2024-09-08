import redis from '$lib/server/redis';

export async function load() {
    return {
        rrweb_session_list: await redis.zrevrange('rrweb_session_list', 0, -1)
    };
}
