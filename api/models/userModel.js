const pool = require('../db/pool');

/* function hasAffectedOne(id, action, queryResult) {
    const withId = id !== null ? ` for id ${id}` : '';

    if (queryResult.rowCount > 1) {
        throw new Error(`Too many posts ${action}${withId}.`);
    } else if (queryResult.rowCount == 0) {
        throw new Error(`Post id ${id} not ${action}`);
    }
} */
//ddssddss
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