const pool = require('../db/pool');

const { createHash } = require('crypto');

const SALT = 'monGrainDeCummin';

function hash(passHash) {
  return createHash('sha256').update(SALT + passHash).digest('hex');
};

function hasAffectedOne(id, action, queryResult) {
    const withId = id !== null ? ` for id ${id}` : '';

    if (queryResult.rowCount > 1) {
        throw new Error(`Too many users ${action}${withId}.`);
    } else if (queryResult.rowCount == 0) {
        throw new Error(`User id ${id} not ${action}`);
    }
};

exports.fetchAllUsers = async() => {
    const selectSql = `SELECT * FROM "users"`;
    const queryResult = await pool.query(selectSql);
    return queryResult.rows;
};

exports.fetchById = async(id) => {
    const selectSql = `SELECT * 
                        FROM "users"
                        WHERE id = $1`;
    const parameters = [id];
    const queryResult = await pool.query(selectSql, parameters);
    
    if (queryResult.rowCount > 1) {
        throw new Error(`Too many users retrieve for id ${id}.`);
    }

    return queryResult.rows[0];
};

exports.createUser = async(user) => {
    const insertSql = `INSERT INTO users ("email", "passHash", "firstName", "lastName") 
                            VALUES ($1, $2, $3, $4)
                            returning *;`;
    const parameters = [user.email, hash(user.password), user.firstName, user.lastName];
    const queryResult = await pool.query(insertSql, parameters);
    
    hasAffectedOne(null, "inserted", queryResult);
    // console.log(queryResult.rows[0]);
    return queryResult.rows[0];
};

exports.isUserValid = async(email) => {
    // console.log('---in isUserValid--- ', email)
    const sql = `select "email" from "users" where "email"=$1;`;
    const param = [email];
    const queryResult = await pool.query(sql, param);
    if (queryResult.rowCount == 1) {
        return 0
    }
    console.log('error user dont exist')
    return 404
}

// need improvement 
exports.isPasswordValid = async(passHash) => {
    // console.log('---in isPasswordValid--- ', passHash)
    const sql = `select "passHash" from "users" where "passHash"=$1;`;
    const param = [passHash.passHash];
    try {
        await pool.query(sql, param);
    } catch (error) {
        console.log('error password not valid', error)
        return 404
    }

    return 0
}

exports.fetchDetailsByEmail = async(email) => {
    const selectSql = `SELECT * 
                        FROM "users"
                        WHERE email = $1`;
    const parameters = [email];
    const queryResult = await pool.query(selectSql, parameters);
    
    if (queryResult.rowCount > 1) {
        throw new Error(`Too many users retrieve for id ${id}.`);
    }

    return queryResult.rows[0];
};
