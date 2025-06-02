const pool = require('../db/pool');


exports.fetchLogin = async() => {
  const selectSql = `SELECT * FROM "users"`;
  const queryResult = await pool.query(selectSql);
  console.log('queryResult: ', queryResult.rows);
  return queryResult.rows;
};

exports.fetchLoginByEmailFromDb = async(userSentEmail) => {
  const selectSql = `SELECT * FROM "users" WHERE email=$1`;
  const queryResult = await pool.query(selectSql);
  console.log('queryResult: ', queryResult.rows);
  return queryResult.rows;
};

exports.fetchLoginByEmailForPassword = async(userSentEmail) => {
  const selectSql = `SELECT passHash FROM "users" WHERE email=$1`;
  const queryResult = await pool.query(selectSql);
  console.log('queryResult: ', queryResult.rows);
  return queryResult.rows;
}