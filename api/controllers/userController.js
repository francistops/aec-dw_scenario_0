const userModel = require('../models/userModel');

const UNKNOWN_ERROR = {
        message: "Unknown error",
        errorCode: 9999
};

exports.getAllUsers = async (req, res) => {
    let result = UNKNOWN_ERROR;
    
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