const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");



const UNKNOWN_ERROR = {
  message: "Unknown error",
  errorCode: 9999,
};

exports.getAllUsers = async (req, res) => {
  let result = UNKNOWN_ERROR;
  try {
    const users = await userModel.fetchAllUsers();
    result = {
      message: "Success",
      errorCode: 0,
      users: users,
    };
  } catch (error) {
    console.error("DB error", error);
    result.message = `Database error ${error}`;
    result.errorCode = 1001;
    res.status(500);
  }
  res.formatView(result);
};

exports.getUserById = async (req, res) => {
  let result = UNKNOWN_ERROR;
  const { id } = req.params;

  try {
    const user = await userModel.fetchById(id);

    result = {
      message: "Success",
      errorCode: 0,
      post: post,
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500);
    result.message = `Error retrieving user with id ${id}`;
    result.errorCode = 1002;
  }

  res.formatView(result);
};

exports.subscribe = async (req, res) => {
  //console.log("---in userController subscribe---");

  let result = UNKNOWN_ERROR;
  const newUser = req.body;
  //console.log(newUser);

  try {
    const createdUser = await userModel.createUser(newUser);
    console.log('after model', createdUser);
    result = {
      message: "Success",
      errorCode: 0,
      user: createdUser,
    };
  } catch (error) {
    console.error("Error inserting user:", error);

    res.status(500);
    result.message = `Error inserting user`;
    result.errorCode = 1002;
  }

  res.formatView(result);
};

exports.login = async (req, res) => {
  // console.log("---in userController login---");

  let result = UNKNOWN_ERROR;

  // TODO find a way to combine
  const userEmail = req.body.email;
  const userPassHash = req.body.passHash;

  try {

    // ! verify with teacher
    // TODO re-salt the password on both the api and the DB

    const checkUser = await userModel.isUserValid(userEmail, userPassHash);
    if (checkUser) {
        const loggedUser = await userModel.fetchDetailsByEmail(userEmail);
        const userToken = await tokenModel.assignToken(loggedUser.userUuid);

        // TODO return is too verbose
        result = {
          message: "Successfull login",
          errorCode: 0,
          user: loggedUser,
          token: userToken
        };
      // } else {
      //   throw new Error(`Error 401: invalid password ${error}`);
      // }
    } else {
      throw new Error(`401 invalid email`);
    }
  } catch (error) {
    console.error("Authorization Denied", error);
    result.message = `${error}`;
    result.errorCode = 420;
    res.status(500);
  }

  //console.log("result: ", result);
  res.formatView(result);
};
