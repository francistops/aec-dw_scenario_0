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
  console.log('---in isUserValid--- ', email, hash(passHash));
  const user = `SELECT * FROM users WHERE email = $1;`;
  const userParam = [email];
  const userQueryResult = await pool.query(user, userParam);
  // J'ai changé pour séparer le email et le passHash
  if (userQueryResult.rowCount != 1) {
    throw new Error(`Error 401: Email not found`);
  }
  const dbPassHash = userQueryResult.rows[0].passHash;
  if (dbPassHash !== passHash) {
    throw new Error(`Error 401: Invalid password`);
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

// quand on logout on set expires à now
exports.logoutByToken = async(token) => {
  console.log('--- in logout model ---');
   const updatedToken = `UPDATE "tokens" 
                        SET "expires" = NOW() 
                        WHERE "tokenUuid" = $1
                        RETURNING *;`;

  const updateResult = await pool.query(updatedToken, [token]);

  return updateResult.rows[0];
}

exports.deleteAccountByToken = async(tokenUuid) => {
  console.log('--- in delete account model ---');

  const parameters = ` SELECT "userId" 
                          FROM "tokens" 
                          WHERE "tokenUuid" = $1;`;
  console.log(tokenUuid)
  const queryResult = await pool.query(parameters, [tokenUuid]);

  if (queryResult.rowCount !== 1) {
    throw new Error(`Invalid token or user not found`);
  }

  const userUuid = queryResult.rows[0].userId;

  const deletedUser = `UPDATE "users"
                        SET 
                          "firstName" = NULL,
                          "lastName" = NULL,
                          "email" = CONCAT('anonyme-', "userUuid"),
                          "passHash" = REPEAT(' ', 64)
                        WHERE "userUuid" = $1;`

  await pool.query(deletedUser, [userUuid]);

  const updatedToken = `UPDATE "tokens" 
                        SET "expires" = NOW() 
                        WHERE "userId" = $1`;

  const updateResult = await pool.query(updatedToken, [userUuid]);

  return updateResult.rows[0];
}