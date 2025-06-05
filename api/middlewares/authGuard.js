const tokenModel = require('../models/tokenModel');

exports.validateToken = async(req, res, next) => {
  console.log('in validateToken', req.headers.authorization)
  const header = req.headers.authorization || '';

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res
      .status(400)
      .formatView({ message: 'Missing or malformed token', errorCode: 400 });
  }

  try {
    console.log('in authGuard try')
    const tokenRow = await tokenModel.isTokenValid(token);
    console.log(tokenRow)
    if (!tokenRow) {
      return res
        .status(401)
        .formatView({ message: 'Invalid or expired token', errorCode: 401 });
    }

    req.selectedToken = tokenRow;
    return next();
  } catch (err) {
    console.error('authGuard error:', err);
    return res
      .status(500)
      .formatView({ message: 'Auth check failed', errorCode: 500 });
  }
}