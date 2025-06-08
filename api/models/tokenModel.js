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

  return true;
};

exports.assignToken = async (userId) => {
  const checkSql = `
                    SELECT * 
                      FROM "tokens"
                      WHERE "userId" = $1
                        AND ("expires" IS NULL OR "expires" > NOW())
                      LIMIT 1;`;
  const checkResult = await pool.query(checkSql, [userId]);

  if (checkResult.rowCount > 0) {
    throw new Error(`User already logged in`);
  }
 
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