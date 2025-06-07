const pool = require("../db/pool");
//const authGuard = require('../middlewares/authGuard');

exports.isTokenValid = async (token) => {
  console.log("in isTokenValid ", token);
  const sql = `SELECT "expires", "tokenUuid"
                FROM "tokens"
                WHERE "tokenUuid" = $1
                AND "expires" >= NOW();`;
  const param = [token];
  const queryResult = await pool.query(sql, param);
  console.log(queryResult);
  if (queryResult.rowCount != 1) {
    throw new Error("error 401: not a valid token");
  }

  return true;
};

exports.assignToken = async (userId) => {
  // TODO change update for insert
    const sql = `insert into "tokens" ("userId") 
                    values ($1)
                    returning *;`;
  const param = [userId];
  const queryResult = await pool.query(sql, param);
  return queryResult.rows[0];
};