import { isTokenValid } from '../models/tokenModel.js'

export async function validateToken(req, res, next) {
    const header = req.header.authorization || '';
    
    const [scheme, token] = header.split(' ')
    
    if (scheme !== 'Bearer' || !token) {
        return res
            .status(400)
            .formatView({ message: 'Missing or malformed token', errorCode: 400 });
    }
    
    try {
        const tokenRow = await isTokenValid(token);
        if (!tokenRow) {
            return res.status(401).formatView({ message: 'invalid or expired token', errorCode: 401 });
        }

        req.selectedToken = tokenRow;
        return next();
    } catch (err) {
        console.error('authGuard error: ', err);
        return res.status(500).formatView({ message: 'auth check failed', errorCode: 500 });
    }
}
