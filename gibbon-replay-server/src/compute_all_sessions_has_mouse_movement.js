import { EventType, IncrementalSource } from 'rrweb';
import db, { migrate } from './lib/server/db.js';

migrate();

db().run('UPDATE sessions SET has_mouse_movement=FALSE');

let numberSessionHaveMouseMouvement = 0;
let totalSession = 0;
db().query('SELECT session_uuid FROM sessions').forEach(({session_uuid}) => {
    totalSession++;
    db().query(
        'SELECT data FROM session_events WHERE session_uuid=?',
        session_uuid
    ).some(({data}) => {
        if (
            JSON.parse(data).some(
                (event) => (
                    (event.type === EventType.IncrementalSnapshot) && 
                    (event.data.source === IncrementalSource.MouseMove)
                )
            )
        ) {
            numberSessionHaveMouseMouvement++;
            db().run(
                `
                    UPDATE sessions 
                       SET has_mouse_movement=TRUE
                     WHERE session_uuid=?
                `,
                session_uuid
            );
            return true;
        }
        return false;
    });
});

console.log(`${numberSessionHaveMouseMouvement}/${totalSession} session have mouve movement`);
