const pool = require('../db/pool');


exports.fetchLogin = async() => {
  const selectSql = `SELECT * FROM "users"`;
  const queryResult = await pool.query(selectSql);
  console.log('queryResult: ', queryResult.rows);
  return queryResult.rows;
};

exports.fetchLoginByEmailFromDb = async(userSentEmail) => {
  const selectSql = `SELECT * FROM "users" WHERE email=$1`;
  const parameters = [userSentEmail]; 
  const queryResult = await pool.query(selectSql, parameters);
  console.log('queryResult: ', queryResult.rows);
  return queryResult.rows;
};

exports.fetchLoginByEmailForPassword = async(userSentEmail) => {
  const selectSql = `SELECT * FROM "users" WHERE email=$1`;
  const parameters = [userSentEmail]; 
  const queryResult = await pool.query(selectSql, parameters);
  console.log('queryResult: ', queryResult.rows);
  return queryResult.rows;
};

exports.fetchDebug = async() => {
  const selectSql = `SELECT * FROM "users"`;
  const queryResult = await pool.query(selectSql);
  // console.log('queryResult: ', queryResult.rows);
  return queryResult.rows;
};

exports.fetchDebugByEmailFromDb = async(userEmail) => {
  console.log('in fetchDebugByEmailFromDb userEmail', userEmail)
  const selectSql = `SELECT "email", "passHash"
                      FROM "users"
                      WHERE "email"=$1;`;
  const parameters = [userEmail]; 
  const queryResult = await pool.query(selectSql, parameters);
  console.log('in fetchDebugByEmailFromDb queryResult: ', queryResult.rows);
  return queryResult.rows;
}