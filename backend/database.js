const Database = require("better-sqlite3");//using better-sqlite3 module

function openDB()
{
    //create(first time)/open the db
    const db = new Database("attacks.db");

    //creating the tables if not exists

    db.prepare(`
        CREATE TABLE IF NOT EXISTS attacks (
        Id TEXT PRIMARY KEY,
        Name TEXT NOT NULL,
        Description TEXT,
        x_mitre_platforms TEXT,
        x_mitre_detection TEXT)
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS attack_pattern_phases (
        attack_id TEXT NOT NULL,
        phase_name TEXT NOT NULL,
        PRIMARY KEY (attack_id, phase_name),
        FOREIGN KEY (attack_id) REFERENCES attacks(Id))
    `).run();
    
    return db;
}

module.exports = openDB;//export function + db for use in other files