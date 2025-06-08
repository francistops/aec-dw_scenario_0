const pool = require("../db/pool");
const { createHash } = require("crypto");
const { fetchByToken } = require("./tokenModel");
const SALT = "monGrainDeCummin";

function hash(passHash) {
  return createHash("sha256")
    .update(SALT + passHash)
    .digest("hex");
}

function hasAffectedOne(id, action, queryResult) {
  const withId = id !== null ? ` for id ${id}` : "";

  if (queryResult.rowCount > 1) {
    throw new Error(`Too many users ${action}${withId}.`);
  } else if (queryResult.rowCount == 0) {
    throw new Error(`User id ${id} not ${action}`);
  }
}

exports.fetchAllUsers = async () => {
  const selectSql = `SELECT * FROM "users"`;
  const queryResult = await pool.query(selectSql);
  return queryResult.rows;
};

exports.fetchById = async (id) => {
  const selectSql = `SELECT * 
                        FROM "users"
                        WHERE "userUuid" = $1`;
  const parameters = [id];
  const queryResult = await pool.query(selectSql, parameters);

  if (queryResult.rowCount > 1) {
    throw new Error(`Too many users retrieve for id ${id}.`);
  }

  return queryResult.rows[0];
};

exports.createUser = async (user) => {
  // console.log('user: ',user)
  const insertSql = `INSERT INTO users ("email", "passHash", "firstName", "lastName") 
                      VALUES ($1, $2, $3, $4)
                      returning *;`;
  const parameters = [
    user.email,
    hash(user.passHash),
    user.firstName,
    user.lastName,
  ];
  const queryResult = await pool.query(insertSql, parameters);
  hasAffectedOne(null, "inserted", queryResult);
  
  // console.log('query: ', queryResult.rows[0]);
  return queryResult.rows[0];
};

exports.isUserValid = async (email, passHash) => {
  console.log('---in isUserValid--- ', email, hash(passHash));
  const sql = `SELECT "email" "passHash" FROM "users" WHERE "email"=$1 AND "passHash"=$2;`;
  console.log("hashPassHash et passHash   " + hash(passHash) + "  ----  " + passHash);
  const param = [email, hash(passHash)];
  const queryResult = await pool.query(sql, param);
  if (queryResult.rowCount != 1) {
    throw new Error(`401: failed to authorize`);
  }
  return true;
};

exports.fetchDetailsByEmail = async (email) => {
  const selectSql = `SELECT * 
                      FROM "users"
                      WHERE email = $1`;
  const parameters = [email];
  const queryResult = await pool.query(selectSql, parameters);

  if (queryResult.rowCount > 1) {
    throw new Error(`Error 500: Too many users retrieve for id ${id}.`);
  }

  return queryResult.rows[0];
};

exports.logoutByToken = async(token) => {
  // console.log('--- in logout model ---');
   const sqlUpdatedToken = `UPDATE "tokens" 
                        SET "expires" = NOW() 
                        WHERE "tokenUuid" = $1
                        RETURNING *;`;

  const updateResult = await pool.query(sqlUpdatedToken, [token]);
  return (updateResult.rowCount == 1) ?  true : false
};


exports.deleteAccountByToken = async(tokenUuid) => {
  console.log('--- in delete account model ---');
  // console.log('tokenUuid', tokenUuid)
    const sqlDeletedUser = `UPDATE "users"
                        SET 
                          "firstName" = NULL,
                          "lastName" = NULL,
                          "email" = CONCAT('anonyme-', "userUuid"),
                          "passHash" = REPEAT(' ', 64)
                        WHERE "userUuid" = $1;`;
                      
  const sqlUpdatedToken = `UPDATE "tokens" 
                        SET "expires" = NOW() 
                        WHERE "userId" = $1`;

  const tokenObj = await fetchByToken(tokenUuid);

  const deleteUserResult = await pool.query(sqlDeletedUser, [tokenObj.userId]);
  hasAffectedOne(tokenObj.userId, "anonymized", deleteUserResult);
  const updateResult = await pool.query(sqlUpdatedToken, [tokenObj.userId]);

  // console.log(updateResult)
  return (updateResult.rowCount == 1) ?  true : false
}