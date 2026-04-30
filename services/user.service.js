const db = require("../database");

class UserService {
  create({ nome_usuario, senha, tipo }) {
    if (!nome_usuario || !senha || !tipo) {
      throw new Error("nome_usuario, senha e tipo são obrigatórios");
    }

    return new Promise((resolve, reject) => {
      const getTipoQuery = "SELECT id FROM tipos_usuario WHERE nome = ?";

      db.get(getTipoQuery, [tipo], (err, tipoRow) => {
        if (err) return reject(err);
        if (!tipoRow) return reject(new Error("Tipo de usuário inválido"));

        const insertQuery = `
          INSERT INTO users (nome_usuario, senha, tipo_usuario_id, status)
          VALUES (?, ?, ?, 1)
        `;

        db.run(
          insertQuery,
          [nome_usuario, senha, tipoRow.id],
          function (err) {
            if (err) return reject(err);

            resolve({
              id: this.lastID,
              nome_usuario,
              tipo,
              status: "ativo",
            });
          }
        );
      });
    });
  }


  list() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          u.id,
          u.nome_usuario,
          t.nome as tipo,
          CASE 
            WHEN u.status = 1 THEN 'ativo'
            ELSE 'inativo'
          END as status
        FROM users u
        LEFT JOIN tipos_usuario t ON t.id = u.tipo_usuario_id
      `;

      db.all(query, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          u.id,
          u.nome_usuario,
          t.nome as tipo,
          CASE 
            WHEN u.status = 1 THEN 'ativo'
            ELSE 'inativo'
          END as status
        FROM users u
        LEFT JOIN tipos_usuario t ON t.id = u.tipo_usuario_id
        WHERE u.id = ?
      `;

      db.get(query, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error("Usuário não encontrado"));
        resolve(row);
      });
    });
  }

  update(id, { nome_usuario, senha, tipo }) {
    if (!nome_usuario || !senha || !tipo) {
      throw new Error("Todos os campos são obrigatórios");
    }

    return new Promise((resolve, reject) => {
      const getTipoQuery = "SELECT id FROM tipos_usuario WHERE nome = ?";

      db.get(getTipoQuery, [tipo], (err, tipoRow) => {
        if (err) return reject(err);
        if (!tipoRow) return reject(new Error("Tipo inválido"));

        const query = `
          UPDATE users
          SET nome_usuario = ?, senha = ?, tipo_usuario_id = ?
          WHERE id = ?
        `;

        db.run(query, [nome_usuario, senha, tipoRow.id, id], function (err) {
          if (err) return reject(err);
          if (this.changes === 0) {
            return reject(new Error("Usuário não encontrado"));
          }

          resolve({
            id,
            nome_usuario,
            tipo,
          });
        });
      });
    });
  }


  patch(id, data) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (data.nome_usuario) {
        fields.push("nome_usuario = ?");
        values.push(data.nome_usuario);
      }

      if (data.senha) {
        fields.push("senha = ?");
        values.push(data.senha);
      }

      if (data.status) {
        fields.push("status = ?");
        values.push(data.status === "ativo" ? 1 : 0);
      }

      const updateTipo = (callback) => {
        if (!data.tipo) return callback(null, null);

        db.get(
          "SELECT id FROM tipos_usuario WHERE nome = ?",
          [data.tipo],
          (err, tipoRow) => {
            if (err) return callback(err);
            if (!tipoRow) return callback(new Error("Tipo inválido"));

            fields.push("tipo_usuario_id = ?");
            values.push(tipoRow.id);

            callback(null);
          }
        );
      };

      updateTipo((err) => {
        if (err) return reject(err);

        if (fields.length === 0) {
          return reject(new Error("Nenhum campo para atualizar"));
        }

        const query = `
          UPDATE users SET ${fields.join(", ")} WHERE id = ?
        `;

        values.push(id);

        db.run(query, values, function (err) {
          if (err) return reject(err);
          if (this.changes === 0) {
            return reject(new Error("Usuário não encontrado"));
          }

          resolve({ id, ...data });
        });
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM users WHERE id = ?";

      db.run(query, [id], function (err) {
        if (err) return reject(err);
        if (this.changes === 0) {
          return reject(new Error("Usuário não encontrado"));
        }

        resolve({ message: "Usuário deletado com sucesso" });
      });
    });
  }
}

module.exports = new UserService();