
const db = require("../database");

class UserService {
  create(name) {
    if (!name) {
      throw new Error("Name is required");
    }

    return new Promise((resolve, reject) => {
      const query = "INSERT INTO users (name) VALUES (?)";

      db.run(query, [name], function (err) {
        if (err) {
          return reject(err);
        }

        resolve({
          id: this.lastID,
          name: name,
        });
      });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users";

      db.all(query, [], (err, rows) => {
        if (err) {
          return reject(err);
        }

        resolve(rows);
      });
    });
  }
}

module.exports = new UserService();
