import { EventType, IncrementalSource } from 'rrweb';
import db, { migrate } from './lib/server/db.js';

migrate();

db().run('UPDATE sessions SET has_user_actions=FALSE');

let numberSessionHaveUserActions = 0;
let totalSession = 0;
db().query('SELECT session_uuid FROM sessions').forEach(({session_uuid}) => {
    totalSession++;
    db().query(
        'SELECT data FROM session_events WHERE session_uuid=?',
        session_uuid
    ).some(({data}) => {
        if (
            JSON.parse(data).some(
                (event) => {
                    return (
                        (event.type === EventType.IncrementalSnapshot) && 
                        (
                            (event.data.source === IncrementalSource.MouseMove) ||
                            (event.data.source === IncrementalSource.TouchMove) ||
                            (event.data.source === IncrementalSource.Scroll)
                        )
                    );
                }
            )
        ) {
            numberSessionHaveUserActions++;
            db().run(
                `
                    UPDATE sessions 
                       SET has_user_actions=TRUE
                     WHERE session_uuid=?
                `,
                session_uuid
            );
            return true;
        }
        return false;
    });
});

console.log(`${numberSessionHaveUserActions}/${totalSession} session have user actions`);
