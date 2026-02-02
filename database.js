const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./databse.db", (err) => {
  if (err) {
    console.error("Error connection database: ", err);
  } else {
    console.log("Connected to SQLite.")
  }
});

db.run(
`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`
);

module.exports = db;


