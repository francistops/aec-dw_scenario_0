const pool = require("../db/pool");

const { createHash } = require("crypto");

// const hashBuffer = await crypto.subtle.digest('SHA-256', data);
// const userPassHash = crypto.createHash("sha256").update(userSentPassword).digest("hex");
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
    console.log('user: ',user)
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
  // todo if you want
//   hasAffectedOne(null, "inserted", queryResult);
  console.log('query: ', queryResult.rows[0]);
  return queryResult.rows[0];
};

exports.isUserValid = async (email, passHash) => {
  console.log('---in isUserValid--- ', email, passHash)
  const sql = `select "email" "passHash" from "users" where "email"=$1 AND "passHash"=$2;`;
  const param = [email, passHash];
  const queryResult = await pool.query(sql, param);
  if (queryResult.rowCount != 1) {
    throw new Error(`Error 401: failed to authorize: ${email} ${passHash}`);
  }
  return true;
};

// need improvement
exports.isPasswordValid = async (passHash, email) => {
    console.log('in isPasswordValid ', passHash)
  const sql = `select "passHash" from "users" where "email"=$1;`;
  const param = [email];
  const queryResult = await pool.query(sql, param);
  console.log(queryResult)
  if (queryResult.rowCount != 1) {
    throw new Error(`error 401: password invalid`);
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
  const userUuid = `DELETE FROM "tokens" WHERE ""`
  const userToken = 
  console.log('--- in logout model ---')
}

exports.deleteAccountByToken = async(token) => {
    console.log('--- in delete account model ---')
}