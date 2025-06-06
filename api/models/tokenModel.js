const pool = require("../db/pool");
//const authGuard = require('../middlewares/authGuard');

exports.isTokenValid = async (userId) => {
  console.log("in isTokenValid ", userId);
  const sql = `SELECT "expires", "userId"
                            FROM "tokens"
                            WHERE "userId"="$1" AND "expires" > NOW();
                        `;
  const param = [userId];
  const queryResult = await pool.query(sql, param);
  console.log(queryResult);
  if (queryResult.rowCount != 1) {
    throw new Error("error 401: not a valid token");
  }

  return true;
};

exports.assignToken = async (userId) => {
  const sql = `update tokens 
                set token = gen_random_uuid() 
                where email=$1 returning *;
                `;
  const param = [userId];
  const queryResult = await pool.query(sql, param);
  return queryResult.rows[0];
};
