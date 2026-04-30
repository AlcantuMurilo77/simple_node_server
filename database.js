const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./databse.db", (err) => {
  if (err) {
    console.error("Error connection database: ", err);
  } else {
    console.log("Connected to SQLite.")
  }
});
db.serialize(() => {

  db.run("PRAGMA foreign_keys = ON");

  db.run(`
    CREATE TABLE IF NOT EXISTS tipos_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_usuario TEXT NOT NULL,
      senha TEXT NOT NULL,
      tipo_usuario_id INTEGER,
      status INTEGER,
      FOREIGN KEY (tipo_usuario_id) REFERENCES tipos_usuario(id)
    );
  `);

  db.run(`
    INSERT OR IGNORE INTO tipos_usuario (nome)
    VALUES ('cliente'), ('admin');
  `);
});


module.exports = db;