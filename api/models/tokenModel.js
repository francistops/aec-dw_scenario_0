const tokenController = require('../controllers/authController');

exports.createUser = async(userObj) => {
    console.log(user);
    const sql = `INSERT INTO "users" ("email", "passHash", "firstName", "lastName) VALUE
                    ($1, $2, $3, $4);`
    const param = [user.email]

    
}