const postModel = require('../models/postModel');
const UNKNOWN_ERROR = {
        message: "Unknown error",
        errorCode: 9999
};

exports.getAllPosts = async (req, res) => {
    let result = UNKNOWN_ERROR;
    
    try {
        const posts = await postModel.fetchAllPost();
        result = {
            message: 'Success',
            errorCode: 0,
            rows: posts
        };
    } catch (error) {
        console.error('DB error', error);
        result.message = `Database error ${error}`;
        result.errorCode = 1001;
        res.status(500);
    }

    res.formatView(result);
};

exports.getPostById = async (req, res) => {
    let result = UNKNOWN_ERROR;
    const { id } = req.params;

    try {
        const post = await postModel.fetchById(id);

        result = {
            message: 'Success',
            errorCode: 0,
            post: post
        }
    } catch (error) {
        console.error('Error fetching post by ID:', error);

        res.status(500);
        result.message = `Error retrieving post with id ${id}`;
        result.errorCode = 1002;
    }

    res.formatView(result);
};

exports.createPost = async (req, res) => {
    let result = UNKNOWN_ERROR;
    const data = req.body;
    console.log(data);

    try {
        const createdPost = await postModel.insert(data.post);

        result = {
            message: 'Success',
            errorCode: 0,
            post: createdPost
        }
    } catch (error) {
        console.error('Error inserting post:', error);

        res.status(500);
        result.message = `Error inserting post`;
        result.errorCode = 1002;
    }

    res.formatView(result);
};

exports.updatePost = async (req, res) => {
    let result = UNKNOWN_ERROR;
    const { id } = req.params;
    const data = req.body;

    try {
        const updatedPost = await postModel.update(id, data.post);

        result = {
            message: 'Success',
            errorCode: 0,
            post: updatedPost
        }
    } catch (error) {
        console.error('Error inserting post:', error);

        res.status(500);
        result.message = `Error inserting post with id ${id}`;
        result.errorCode = 1002;
    }

    res.formatView(result);
};

exports.publishPost = async (req, res) => {
    let result = UNKNOWN_ERROR;
    const { id } = req.params;

    try {
        const publishedPost = await postModel.publish(id);

        result = {
            message: 'Success',
            errorCode: 0,
            post: publishedPost
        }
    } catch (error) {
        console.error('Error publishing post:', error);

        res.status(500);
        result.message = `Error inserting post with id ${id}`;
        result.errorCode = 1002;
    }

    res.formatView(result);
}

exports.deletePost = async (req, res) => {
    let result = UNKNOWN_ERROR;
    const { id } = req.params;

    try {
        const deletedCount = await postModel.delete(id);

        result = {
            message: 'Success',
            errorCode: 0,
            deletedPostCount: deletedCount
        }
    } catch (error) {
        console.error('Error deleting post:', error);

        res.status(500);
        result.message = `Error inserting post with id ${id}`;
        result.errorCode = 1002;
    }

    res.formatView(result);
};