import redis from '$lib/server/redis';

export async function load() {
    const data = await redis.zrevrange('rrweb_session_list', 0, -1, 'WITHSCORES');

    const result = [];

    for (let i = 0; i < data.length; i += 2) {
        result.push({
            timestamp: data[i + 1],
            ...JSON.parse(data[i])
        });
    }
    return {
        rrweb_session_list: result
    };
}
