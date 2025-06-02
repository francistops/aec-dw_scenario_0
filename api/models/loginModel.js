const pool = require('../db/pool');


exports.fetchEmail = async() => {
  const selectSql = `SELECT * FROM "users"`;
  const queryResult = await pool.query(selectSql);
  console.log('queryResult: ', queryResult.rows);
  return queryResult.rows;
};

exports.fetchLogin = async(email) => {
  const selectSql = `SELECT * FROM "users" WHERE email=$1`;
  const queryResult = await pool.query(selectSql);
  console.log('queryResult: ', queryResult.rows);
  return queryResult.rows;
};