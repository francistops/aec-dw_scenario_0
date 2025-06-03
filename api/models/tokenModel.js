const pool = require("../db/pool");

function checkAffected(id, action, result) {
    // TODO
    if (result.rowCount > 1) throw new Error(`Too many tokens ${action}${suffix}.`);
    if (result.rowCount === 0) throw new Error(`Token id ${id} not ${action}.`);
}

export async function hasNoToken(user) {
   const sql = `select *
   from "tokens" 
   where "token"."userId" = $1 and "tokens"."expires" > NOW();
   `;
 const { rowCount } = await pool.query(sql, [user.id]);
    console.log(rowCount);

    return rowCount == 0;
}

// info in video at 4:20
export async function isTokenValid(token) {
    const sql = `
    select *
        from "tokens"
    where "token" = $1
        and Expires > NOW()
    limit 1;
    `;
    
    const { rows, rowCount } = await pool.query(sql, [token]);
    if (rowCount != 1) {
        throw new Error(`Should have received only one token, got ${rowCount}.`);
    }
    return rows[0];
};