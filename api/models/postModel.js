const pool = require('../db/pool');

function hasAffectedOne(id, action, queryResult) {
    const withId = id !== null ? ` for id ${id}` : '';

    if (queryResult.rowCount > 1) {
        throw new Error(`Too many posts ${action}${withId}.`);
    } else if (queryResult.rowCount == 0) {
        throw new Error(`Post id ${id} not ${action}`);
    }
}

exports.fetchAllPost = async() => {
    const selectSql = `SELECT * 
                            FROM posts 
                            ORDER BY created DESC`;
    const queryResult = await pool.query(selectSql);
    return queryResult.rows;
};

exports.fetchById = async(id) => {
    const selectSql = `SELECT * 
                            FROM posts 
                            WHERE id = $1`;
    const parameters = [id];
    const queryResult = await pool.query(selectSql, parameters);
    
    if (queryResult.rowCount > 1) {
        throw new Error(`Too many posts retrieve for id ${id}.`);
    }

    return queryResult.rows[0];
};

exports.insert = async(post) => {
    const insertSql = `INSERT INTO posts (title, excert, content) 
                            VALUES ($1, $2, $3)
                            RETURNING *;`;
    const parameters = [post.title, post.excert, post.content];
    const queryResult = await pool.query(insertSql, parameters);
    
    hasAffectedOne(null, "inserted", queryResult);

    return queryResult.rows[0];
};

exports.update = async(id, post) => {
    const updateSql = `UPDATE posts
                            SET title = $1,
                                excert = $2,
                                content = $3
                            WHERE id = $4
                            RETURNING *;`;
    const parameters = [post.title, post.excert, post.content, id];
    const queryResult = await pool.query(updateSql, parameters);

    hasAffectedOne(null, "updated", queryResult);

    return queryResult.rows[0];
};

exports.publish = async(id) => {
    const updateSql = `UPDATE posts 
                        SET published = NOW() 
                        WHERE id = $1 
                        RETURNING *;`;
    const parameters = [id];
    const queryResult = await pool.query(updateSql, parameters);

    hasAffectedOne(null, "published", queryResult);

    return queryResult.rows[0];
};

exports.delete = async(id) => {
    const deleteSql = `DELETE 
                        FROM posts 
                        WHERE id = $1;`;
    const parameters = [id];
    const queryResult = await pool.query(deleteSql, parameters);
    
    hasAffectedOne(id, "deleted", queryResult);
    return queryResult.rowCount;
};