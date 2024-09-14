import Database from 'better-sqlite3';

console.log("ici1");
const db = new Database(
    process.env.SQLITE_PATH || 'gibbon.db'
);
db.pragma('journal_mode = MEMORY');
db.pragma('synchronous = OFF');
db.pragma('foreign_keys = ON');

export default db;
