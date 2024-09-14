import '$lib/server/init.js'; 

export async function handle({ event, resolve }) {
    return resolve(event);
}
