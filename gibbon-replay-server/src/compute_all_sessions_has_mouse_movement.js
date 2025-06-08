import db, { migrate } from './lib/server/db.js';

migrate();

db().query('SELECT session_uuid FROM sessions').forEach(({session_uuid}) => {
    console.log(session_uuid);
});
