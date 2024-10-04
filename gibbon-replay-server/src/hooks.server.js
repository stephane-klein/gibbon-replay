import '$lib/server/db.js'; 

export async function handle({ event, resolve }) {
    return resolve(event);
}
