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
    const selectSql = `SELECT "authorId", "created", "published", "title", "excert"
                            FROM posts 
                            ORDER BY created DESC`;
    const queryResult = await pool.query(selectSql);
    return queryResult.rows;
};

exports.fetchById = async(id) => {
    const selectSql = `SELECT "authorId", "created", "published", "title", "excert", "content"
                            FROM posts 
                            WHERE id = $1`;
    const parameters = [id];
    const queryResult = await pool.query(selectSql, parameters);
    
    if (queryResult.rowCount > 1) {
        throw new Error(`Too many posts retrieve for id ${id}.`);
    }

    return queryResult.rows[0];
};

exports.fetchNextPosts = async(ids, nbRequested) => {
    let selectSQL = `
        SELECT "posts"."id" AS "postId",
                "authorId",
                "created",
                "published",
                "excert",
                "content"
        FROM "posts"
            INNER JOIN "users" ON "authorId" = "uuId"
        WHERE "published" IS NOT NULL`
        
    if (ids.length > 0) {
        selectSQL += `
            AND "postId" NOT IN (${ids.map((item, index) => `$${index + 1}`).join(', ')})
        `; // Pas certaine du nom postId
        const symbolDollar = ids.map((item, index) => '$' + (index + 1)).join(', ');
    }

    select += `
        ORDER BY "published"
        FROM "posts"
        LIMIT $${ids.length + 1}
    `;
    const { rows } = await pool.query(selectSQL, [...ids, nbRequested]); //À vérifier
    
    let allPosts = [];

    // rows.forEach((item.index) => {
    //     const post = {
    //         id: item.postId,
    //         title: item.title,
    //         published: item.published
    //     } // Pas fini, à vérifier
    // })
}

exports.insert = async(post) => {
    const insertSql = `INSERT INTO "posts" ("authorId", "title", "excert", "content") 
                            VALUES ($1, $2, $3, $4)
                            RETURNING *;`;
    const parameters = [post.authorId, post.title, post.excert, post.content];
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

