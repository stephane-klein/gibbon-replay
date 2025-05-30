import { migrate } from './lib/server/db.js';

export async function init() {
    migrate();
}

export async function handle({ event, resolve }) {
    return resolve(event);
}
