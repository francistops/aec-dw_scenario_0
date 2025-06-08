const pool = require("../db/pool");

exports.isTokenValid = async (token) => {
  console.log("in isTokenValid ", token);
  const sql = `SELECT "expires", "tokenUuid"
                FROM "tokens"
                WHERE "tokenUuid" = $1
                AND "expires" >= NOW();`;
  const param = [token];
  const queryResult = await pool.query(sql, param);
  if (queryResult.rowCount != 1) {
    throw new Error("error 401: not a valid token");
  }

  return queryResult.rows[0];
};

exports.assignToken = async (userId) => {
  const sql = `INSERT into "tokens" ("userId") 
                  values ($1)
                  returning *;`;
  const param = [userId];
  const queryResult = await pool.query(sql, param);
  return queryResult.rows[0];
};

exports.fetchByToken = async (token) => {
  const sql = `SELECT * 
                FROM "tokens"
                WHERE "tokenUuid" = $1;`;
  const param = [token];
  const queryResult = await pool.query(sql, param);
  if (queryResult.rowCount != 1) {
    throw new Error(`Error 500: Too many tokens retrieve for token ${token}.`);
  }
  return queryResult.rows[0];
}