const Database = require("better-sqlite3");//using better-sqlite3 module

//create/open(first time) the db
const db = new Database("attacks.db");

//creating the table if not exists
db.prepare(`
    CREATE TABLE IF NOT EXISTS attacks (
        Id TEXT PRIMARY KEY,
        Name TEXT NOT NULL,
        Description TEXT,
        x_mitre_platforms TEXT,
        x_mitre_detection TEXT,
        phase_name TEXT
    )
`).run();

module.exports = db;//export db for us in other files