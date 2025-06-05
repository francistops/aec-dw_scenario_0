const pool = require('../db/pool');
//const authGuard = require('../middlewares/authGuard');

exports.isTokenValid = async(token) => {
    console.log('in isTokenValid ', token)
    return token

};

exports.assignToken = async(email) => {
    // console.log('in assignToken')
    const sql = `update users set token = gen_random_uuid() where email=$1 returning *;`;
    const param = [email]
    const queryResult = await pool.query(sql, param)
    return queryResult.rows[0]
};