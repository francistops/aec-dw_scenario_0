const userModel = require('../models/userModel');
const tokenModel = require('../models/userModel');

const UNKNOWN_ERROR = {
        message: "Unknown error",
        errorCode: 9999
};

exports.getAllUsers = async (req, res) => {
    let result = UNKNOWN_ERROR;
    if (Object.keys(req.query).length === 0) {
        try {
            const users = await userModel.fetchAllUsers();
            result = {
                message: 'Success',
                errorCode: 0,
                users: users
            };
        } catch (error) {
            console.error('DB error', error);
            result.message = `Database error ${error}`;
            result.errorCode = 1001;
            res.status(500);
        }
    }
    res.formatView(result);
};

exports.getUserById = async (req, res) => {
    let result = UNKNOWN_ERROR;
    const { id } = req.params;

    try {
        const user = await userModel.fetchById(id);

        result = {
            message: 'Success',
            errorCode: 0,
            post: post
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500);
        result.message = `Error retrieving user with id ${id}`;
        result.errorCode = 1002;
    }

    res.formatView(result);
};

exports.subscribe = async (req, res) => {
    console.log('---in userController subscribe---');

    let result = UNKNOWN_ERROR;
    const newUser = req.body;
    console.log(newUser);


    try {
        const createdUser = await userModel.createUser(newUser);
        console.log(createdUser);
        result = {
            message: 'Success',
            errorCode: 0,
            user: createdUser
        }
    } catch (error) {
        console.error('Error inserting user:', error);

        res.status(500);
        result.message = `Error inserting user`;
        result.errorCode = 1002;
    }

    res.formatView(result);
};

exports.login = async(req, res) => {
    console.log('---in userController login---')
// console.log("in sendLogin req: ", req.body.email, typeof(req.body.email));
// console.log("in sendLogin res: ", res);

  let result = UNKNOWN_ERROR;

  //get user info from curl POST method
  const userEmail = req.body.email;
  const userHash = req.body.password;

  try {
    const loggedUser = await userModel.isUserValid(userEmail);
    result = {
      message: "Successfull login",
      errorCode: 0,
      user: loggedUser
    };
    // create and insert a token in the user.token table
    const debugToken = await loginModel.insertTokenIntoUserTable(userEmail);
    user = {
        email: dbEmail,
        passHash: dbHash,
        token: debugToken.token
        }
    } catch (error) {
    console.error("DB error", error);
    result.message = `Database error ${error}`;
    result.errorCode = 1001;
    res.status(500);
  }

  // console.log("result: ", result);
  console.log("user: ", user);
  res.formatView(result, user);
};

function isPasswordValid(passHash, passHash2, res) {
  if (passHash != passHash2) {
    return res
      .status(401)
      .json({ message: "Unauthorized: password non valide", errorCode: 1001 });
  }
  return true;
}

function isUserValid(userEmail, dbEmail, res) {
  if (userEmail != dbEmail) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Utilisateur non trouvé", errorCode: 1001 });
  }
  return true;
}
